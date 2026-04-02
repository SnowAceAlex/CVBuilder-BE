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
      defaultSections = template.sections ?? [];
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
      sections: defaultSections ?? [],
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

// @desc    Add an education entry into educations array
// @route   POST /api/cv/:id/educations
// @access  Private
export const addEducation = async (req, res, next) => {
  try {
    const cv = await CV.findById(req.params.id);

    if (!cv || cv.userId.toString() !== req.user._id.toString()) {
      return res.status(404).json({ success: false, message: 'CV not found' });
    }

    cv.educations.push(req.body);
    await cv.save();

    const newEducation = cv.educations[cv.educations.length - 1];
    res.status(201).json({ success: true, data: newEducation });
  } catch (error) {
    next(error);
  }
};

// @desc    Edit an education entry in educations array
// @route   PUT /api/cv/:id/educations/:eduId
// @access  Private
export const editEducation = async (req, res, next) => {
  try {
    const cv = await CV.findById(req.params.id);
    if (!cv || cv.userId.toString() !== req.user._id.toString()) {
      return res.status(404).json({ success: false, message: 'CV not found' });
    }

    const education = cv.educations.id(req.params.eduId);
    if (!education) {
      return res
        .status(404)
        .json({ success: false, message: 'Education not found' });
    }

    Object.assign(education, req.body);
    await cv.save();

    res.status(200).json({ success: true, data: education });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete an education entry from educations array
// @route   DELETE /api/cv/:id/educations/:eduId
// @access  Private
export const deleteEducation = async (req, res, next) => {
  try {
    const cv = await CV.findById(req.params.id);

    if (!cv || cv.userId.toString() !== req.user._id.toString()) {
      return res.status(404).json({ success: false, message: 'CV not found' });
    }

    const education = cv.educations.id(req.params.eduId);
    if (!education) {
      return res
        .status(404)
        .json({ success: false, message: 'Education not found' });
    }

    education.deleteOne();
    await cv.save();

    res
      .status(200)
      .json({ success: true, message: 'Education deleted succesfully' });
  } catch (error) {
    next(error);
  }
};

// @desc    Add an experience entry into experience array
// @route   POST /api/cv/:id/experiences
// @access  Private
export const addExperience = async (req, res, next) => {
  try {
    const cv = await CV.findById(req.params.id);
    if (!cv || cv.userId.toString() !== req.user._id.toString()) {
      return res.status(404).json({ success: false, message: 'CV not found' });
    }
    cv.experiences.push(req.body);
    await cv.save();

    const newExperience = cv.experiences[cv.experiences.length - 1];

    res.status(201).json({ success: true, data: newExperience });
  } catch (error) {
    next(error);
  }
};

// @desc    Edit an experience entry in experience array
// @route   PUT /api/cv/:id/experiences/:expId
// @access  Private
export const editExperience = async (req, res, next) => {
  try {
    const cv = await CV.findById(req.params.id);
    if (!cv || cv.userId.toString() !== req.user._id.toString()) {
      return res.status(404).json({ success: false, message: 'CV not found' });
    }

    const experience = cv.experiences.id(req.params.expId);
    if (!experience) {
      return res
        .status(404)
        .json({ success: false, message: 'Experience not found' });
    }

    Object.assign(experience, req.body);
    await cv.save();

    res.status(200).json({ success: true, data: experience });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete an experience entry from experience array
// @route   DELETE /api/cv/:id/experiences/:expId
// @access  Private
export const deleteExperience = async (req, res, next) => {
  try {
    const cv = await CV.findById(req.params.id);

    if (!cv || cv.userId.toString() !== req.user._id.toString()) {
      return res.status(404).json({ success: false, message: 'CV not found' });
    }

    const experience = cv.experiences.id(req.params.expId);
    if (!experience) {
      return res
        .status(404)
        .json({ success: false, message: 'Experience not found' });
    }
    cv.experiences.pull(req.params.expId);
    await cv.save();

    res
      .status(200)
      .json({ success: true, message: 'Experience deleted succesfully' });
  } catch (error) {
    next(error);
  }
};

// @desc    Add a skill entry into skill array
// @route   POST /api/cv/:id/skills
// @access  Private
export const addSkill = async (req, res, next) => {
  try {
    const cv = await CV.findById(req.params.id);
    if (!cv || cv.userId.toString() !== req.user._id.toString()) {
      return res.status(404).json({ success: false, message: 'CV not found' });
    }
    cv.skills.push(req.body);
    await cv.save();

    const newSkill = cv.skills[cv.skills.length - 1];

    res.status(201).json({ success: true, data: newSkill });
  } catch (error) {
    next(error);
  }
};

// @desc    Edit a skill entry in skill array
// @route   PUT /api/cv/:id/skills/:skillId
// @access  Private
export const editSkill = async (req, res, next) => {
  try {
    const cv = await CV.findById(req.params.id);
    if (!cv || cv.userId.toString() !== req.user._id.toString()) {
      return res.status(404).json({ success: false, message: 'CV not found' });
    }

    const skill = cv.skills.id(req.params.skillId);
    if (!skill) {
      return res
        .status(404)
        .json({ success: false, message: 'Skill not found' });
    }

    Object.assign(skill, req.body);
    await cv.save();

    res.status(200).json({ success: true, data: skill });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a skill entry from skill array
// @route   DELETE /api/cv/:id/skills/:skillId
// @access  Private
export const deleteSkill = async (req, res, next) => {
  try {
    const cv = await CV.findById(req.params.id);

    if (!cv || cv.userId.toString() !== req.user._id.toString()) {
      return res.status(404).json({ success: false, message: 'CV not found' });
    }

    cv.skills.pull(req.params.skillId);
    await cv.save();

    res
      .status(200)
      .json({ success: true, message: 'Skill deleted succesfully' });
  } catch (error) {
    next(error);
  }
};
