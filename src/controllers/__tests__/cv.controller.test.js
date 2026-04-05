import { jest } from '@jest/globals';

const mockCVModel = {
  create: jest.fn(),
  findById: jest.fn(),
};

const mockTemplateModel = {
  findOne: jest.fn(),
};

jest.unstable_mockModule('../../models/cv.model.js', () => ({
  default: mockCVModel,
}));
jest.unstable_mockModule('../../models/template.model.js', () => ({
  default: mockTemplateModel,
}));

const { createCV, updateCV } = await import('../cv.controller.js');

const createMockRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe('cv.controller template-first behavior', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('creates CV using active template defaults and snapshot', async () => {
    const template = {
      _id: '507f1f77bcf86cd799439011',
      name: 'Professional Clean',
      category: 'professional',
      thumbnailUrl: 'https://example.com/1.png',
      schemaVersion: 2,
      layout: {
        sections: [
          {
            sectionKey: 'personalInfo',
            displayName: 'Personal Information',
            order: 0,
            isVisible: true,
          },
        ],
      },
      fieldConfig: [
        {
          sectionKey: 'personalInfo',
          fields: [
            {
              key: 'jobTitle',
              defaultValue: 'Backend Developer',
            },
          ],
        },
        {
          sectionKey: 'skills',
          defaultEntries: [{ skillName: 'Node.js', level: 'Advanced' }],
        },
      ],
      renderMeta: { variant: 'clean' },
    };

    const createdCv = { _id: 'cv123' };
    mockTemplateModel.findOne.mockResolvedValue(template);
    mockCVModel.create.mockResolvedValue(createdCv);

    const req = {
      user: { _id: 'user123' },
      body: {
        cvTitle: 'My CV',
        templateId: '507f1f77bcf86cd799439011',
        personalInfo: { fullName: 'Dummy User' },
      },
    };
    const res = createMockRes();
    const next = jest.fn();

    await createCV(req, res, next);

    expect(mockTemplateModel.findOne).toHaveBeenCalledWith({
      _id: '507f1f77bcf86cd799439011',
      isActive: true,
    });
    expect(mockCVModel.create).toHaveBeenCalledWith(
      expect.objectContaining({
        userId: 'user123',
        cvTitle: 'My CV',
        templateId: '507f1f77bcf86cd799439011',
        personalInfo: {
          jobTitle: 'Backend Developer',
          fullName: 'Dummy User',
        },
        skills: [{ skillName: 'Node.js', level: 'Advanced' }],
        sections: template.layout.sections,
        templateSnapshot: expect.objectContaining({
          templateId: template._id,
          name: template.name,
          schemaVersion: 2,
        }),
      }),
    );
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ success: true, data: createdCv });
    expect(next).not.toHaveBeenCalled();
  });

  it('rejects template reassignment on existing CV', async () => {
    const cvDoc = {
      userId: { toString: () => 'user123' },
      templateId: { toString: () => 'template-old' },
      save: jest.fn(),
    };
    mockCVModel.findById.mockResolvedValue(cvDoc);

    const req = {
      params: { id: 'cv123' },
      user: { _id: 'user123' },
      body: { templateId: 'template-new' },
    };
    const res = createMockRes();
    const next = jest.fn();

    await updateCV(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message:
        'Template cannot be changed for an existing CV. Please create a new CV with the desired template.',
    });
    expect(cvDoc.save).not.toHaveBeenCalled();
    expect(next).not.toHaveBeenCalled();
  });
});
