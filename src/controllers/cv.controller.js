import CV from '../models/cv.model.js';
import Template from '../models/template.model.js';

// @desc    Create a new CV
// @route   POST /api/cv
// @access  Private
export const createCV = async (req, res, next) => {
  try {
    const {
      cvTitle,
      templateId,
      status,
      personalInfo,
      educations,
      experiences,
      skills,
      projects,
      certifications,
      sections,
    } = req.body;

    // If a templateId is provided, copy the template's default sections
    let defaultSections = sections;
    if (templateId && !sections) {
      const template = await Template.findById(templateId);
      if (!template) {
        return res
          .status(404)
          .json({ success: false, message: 'Template not found' });
      }
      defaultSections = template.sections;
    }

    const cv = await CV.create({
      userId: req.user._id,
      cvTitle,
      templateId,
      status,
      personalInfo,
      educations,
      experiences,
      skills,
      projects,
      certifications,
      sections: defaultSections,
    });

    res.status(201).json({ success: true, data: cv });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all CVs for the authenticated user
// @route   GET /api/cv
// @access  Private
export const getAllCVs = async (req, res, next) => {
  try {
    const cvs = await CV.find({ userId: req.user._id })
      .populate('templateId', 'name category thumbnailUrl')
      .sort({ updatedAt: -1 });

    res.status(200).json({ success: true, count: cvs.length, data: cvs });
  } catch (error) {
    next(error);
  }
};

// @desc    Get a single CV by ID
// @route   GET /api/cv/:id
// @access  Private
export const getCVById = async (req, res, next) => {
  try {
    const cv = await CV.findById(req.params.id).populate(
      'templateId',
      'name category thumbnailUrl sections',
    );

    if (!cv) {
      return res.status(404).json({ success: false, message: 'CV not found' });
    }

    // Ownership guard — users can only view their own CVs
    if (cv.userId.toString() !== req.user._id.toString()) {
      return res.status(404).json({ success: false, message: 'CV not found' });
    }

    res.status(200).json({ success: true, data: cv });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a CV
// @route   PUT /api/cv/:id
// @access  Private
export const updateCV = async (req, res, next) => {
  try {
    const cv = await CV.findById(req.params.id);

    if (!cv) {
      return res.status(404).json({ success: false, message: 'CV not found' });
    }

    // Ownership guard
    if (cv.userId.toString() !== req.user._id.toString()) {
      return res.status(404).json({ success: false, message: 'CV not found' });
    }

    // Update only the fields provided in the request body
    const allowedFields = [
      'cvTitle',
      'templateId',
      'status',
      'personalInfo',
      'educations',
      'experiences',
      'skills',
      'projects',
      'certifications',
      'sections',
    ];

    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        cv[field] = req.body[field];
      }
    }

    const updatedCV = await cv.save();

    res.status(200).json({ success: true, data: updatedCV });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a CV
// @route   DELETE /api/cv/:id
// @access  Private
export const deleteCV = async (req, res, next) => {
  try {
    const cv = await CV.findById(req.params.id);

    if (!cv) {
      return res.status(404).json({ success: false, message: 'CV not found' });
    }

    // Ownership guard
    if (cv.userId.toString() !== req.user._id.toString()) {
      return res.status(404).json({ success: false, message: 'CV not found' });
    }

    await cv.deleteOne();

    res.status(200).json({ success: true, message: 'CV deleted successfully' });
  } catch (error) {
    next(error);
  }
};
