import { jest } from '@jest/globals';

const mockTemplateModel = {
  find: jest.fn(),
  countDocuments: jest.fn(),
  findOne: jest.fn(),
};

jest.unstable_mockModule('../../models/template.model.js', () => ({
  default: mockTemplateModel,
}));

const { getTemplates, getTemplateById } = await import('../template.controller.js');

const createMockRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe('template.controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('lists active templates with pagination metadata', async () => {
    const templates = [{ _id: 't1', name: 'Professional Clean' }];

    const queryBuilder = {
      select: jest.fn().mockReturnThis(),
      sort: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      limit: jest.fn().mockResolvedValue(templates),
    };

    mockTemplateModel.find.mockReturnValue(queryBuilder);
    mockTemplateModel.countDocuments.mockResolvedValue(3);

    const req = {
      validatedQuery: { page: 1, limit: 2 },
    };
    const res = createMockRes();
    const next = jest.fn();

    await getTemplates(req, res, next);

    expect(mockTemplateModel.find).toHaveBeenCalledWith({ isActive: true });
    expect(mockTemplateModel.countDocuments).toHaveBeenCalledWith({
      isActive: true,
    });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      data: templates,
      pagination: {
        page: 1,
        limit: 2,
        total: 3,
        totalPages: 2,
      },
    });
    expect(next).not.toHaveBeenCalled();
  });

  it('returns 404 when template detail does not exist', async () => {
    mockTemplateModel.findOne.mockResolvedValue(null);

    const req = { validatedParams: { id: '507f1f77bcf86cd799439011' } };
    const res = createMockRes();
    const next = jest.fn();

    await getTemplateById(req, res, next);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'Template not found',
    });
    expect(next).not.toHaveBeenCalled();
  });
});
