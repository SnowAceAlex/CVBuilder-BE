import CV from '../models/cv.model.js';

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
      languages,
      sections,
    } = req.body;

    const cv = await CV.create({
      userId: req.user._id,
      cvTitle,
      templateId,
      status,
      personalInfo: personalInfo ?? {},
      educations: educations ?? [],
      experiences: experiences ?? [],
      skills: skills ?? [],
      projects: projects ?? [],
      certifications: certifications ?? [],
      languages: languages ?? [],
      sections: sections ?? [],
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
    const cvs = await CV.find({ userId: req.user._id }).sort({
      updatedAt: -1,
    });

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
    const cv = await CV.findById(req.params.id);

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

    if (
      req.body.templateId !== undefined &&
      req.body.templateId.toString() !== cv.templateId.toString()
    ) {
      return res.status(400).json({
        success: false,
        message:
          'Template cannot be changed for an existing CV. Please create a new CV with the desired template.',
      });
    }

    // Update only the fields provided in the request body
    const allowedFields = [
      'cvTitle',
      'status',
      'personalInfo',
      'educations',
      'experiences',
      'skills',
      'projects',
      'certifications',
      'languages',
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
      .json({ success: true, message: 'Education deleted successfully' });
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
      .json({ success: true, message: 'Experience deleted successfully' });
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

    const skill = cv.skills.id(req.params.skillId);
    if (!skill) {
      return res
        .status(404)
        .json({ success: false, message: 'Skill not found' });
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

// @desc    Update personal info
// @route   PUT /api/cv/:id/personal-info
// @access  Private
export const updatePersonalInfo = async (req, res, next) => {
  try {
    const cv = await CV.findById(req.params.id);

    if (!cv || cv.userId.toString() !== req.user._id.toString()) {
      return res.status(404).json({ success: false, message: 'CV not found' });
    }

    cv.personalInfo = { ...cv.personalInfo, ...req.body };
    await cv.save();

    res.status(200).json({ success: true, data: cv.personalInfo });
  } catch (error) {
    next(error);
  }
};

// @desc    Add a project entry into projects array
// @route   POST /api/cv/:id/projects
// @access  Private
export const addProject = async (req, res, next) => {
  try {
    const cv = await CV.findById(req.params.id);

    if (!cv || cv.userId.toString() !== req.user._id.toString()) {
      return res.status(404).json({ success: false, message: 'CV not found' });
    }

    cv.projects.push(req.body);
    await cv.save();

    const newProject = cv.projects[cv.projects.length - 1];
    res.status(201).json({ success: true, data: newProject });
  } catch (error) {
    next(error);
  }
};

// @desc    Edit a project entry in projects array
// @route   PUT /api/cv/:id/projects/:projectId
// @access  Private
export const editProject = async (req, res, next) => {
  try {
    const cv = await CV.findById(req.params.id);
    if (!cv || cv.userId.toString() !== req.user._id.toString()) {
      return res.status(404).json({ success: false, message: 'CV not found' });
    }

    const project = cv.projects.id(req.params.projectId);
    if (!project) {
      return res
        .status(404)
        .json({ success: false, message: 'Project not found' });
    }

    Object.assign(project, req.body);
    await cv.save();

    res.status(200).json({ success: true, data: project });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a project entry from projects array
// @route   DELETE /api/cv/:id/projects/:projectId
// @access  Private
export const deleteProject = async (req, res, next) => {
  try {
    const cv = await CV.findById(req.params.id);

    if (!cv || cv.userId.toString() !== req.user._id.toString()) {
      return res.status(404).json({ success: false, message: 'CV not found' });
    }

    const project = cv.projects.id(req.params.projectId);
    if (!project) {
      return res
        .status(404)
        .json({ success: false, message: 'Project not found' });
    }

    cv.projects.pull(req.params.projectId);
    await cv.save();

    res
      .status(200)
      .json({ success: true, message: 'Project deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// @desc    Add a certification entry into certifications array
// @route   POST /api/cv/:id/certifications
// @access  Private
export const addCertification = async (req, res, next) => {
  try {
    const cv = await CV.findById(req.params.id);

    if (!cv || cv.userId.toString() !== req.user._id.toString()) {
      return res.status(404).json({ success: false, message: 'CV not found' });
    }

    cv.certifications.push(req.body);
    await cv.save();

    const newCertification = cv.certifications[cv.certifications.length - 1];
    res.status(201).json({ success: true, data: newCertification });
  } catch (error) {
    next(error);
  }
};

// @desc    Edit a certification entry in certifications array
// @route   PUT /api/cv/:id/certifications/:certId
// @access  Private
export const editCertification = async (req, res, next) => {
  try {
    const cv = await CV.findById(req.params.id);
    if (!cv || cv.userId.toString() !== req.user._id.toString()) {
      return res.status(404).json({ success: false, message: 'CV not found' });
    }

    const certification = cv.certifications.id(req.params.certId);
    if (!certification) {
      return res
        .status(404)
        .json({ success: false, message: 'Certification not found' });
    }

    Object.assign(certification, req.body);
    await cv.save();

    res.status(200).json({ success: true, data: certification });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a certification entry from certifications array
// @route   DELETE /api/cv/:id/certifications/:certId
// @access  Private
export const deleteCertification = async (req, res, next) => {
  try {
    const cv = await CV.findById(req.params.id);

    if (!cv || cv.userId.toString() !== req.user._id.toString()) {
      return res.status(404).json({ success: false, message: 'CV not found' });
    }

    const certification = cv.certifications.id(req.params.certId);
    if (!certification) {
      return res
        .status(404)
        .json({ success: false, message: 'Certification not found' });
    }

    cv.certifications.pull(req.params.certId);
    await cv.save();

    res
      .status(200)
      .json({ success: true, message: 'Certification deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// @desc    Add a language entry into languages array
// @route   POST /api/cv/:id/languages
// @access  Private
export const addLanguage = async (req, res, next) => {
  try {
    const cv = await CV.findById(req.params.id);

    if (!cv || cv.userId.toString() !== req.user._id.toString()) {
      return res.status(404).json({ success: false, message: 'CV not found' });
    }

    cv.languages.push(req.body);
    await cv.save();

    const newLanguage = cv.languages[cv.languages.length - 1];
    res.status(201).json({ success: true, data: newLanguage });
  } catch (error) {
    next(error);
  }
};

// @desc    Edit a language entry in languages array
// @route   PUT /api/cv/:id/languages/:langId
// @access  Private
export const editLanguage = async (req, res, next) => {
  try {
    const cv = await CV.findById(req.params.id);
    if (!cv || cv.userId.toString() !== req.user._id.toString()) {
      return res.status(404).json({ success: false, message: 'CV not found' });
    }

    const language = cv.languages.id(req.params.langId);
    if (!language) {
      return res
        .status(404)
        .json({ success: false, message: 'Language not found' });
    }

    Object.assign(language, req.body);
    await cv.save();

    res.status(200).json({ success: true, data: language });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a language entry from languages array
// @route   DELETE /api/cv/:id/languages/:langId
// @access  Private
export const deleteLanguage = async (req, res, next) => {
  try {
    const cv = await CV.findById(req.params.id);

    if (!cv || cv.userId.toString() !== req.user._id.toString()) {
      return res.status(404).json({ success: false, message: 'CV not found' });
    }

    const language = cv.languages.id(req.params.langId);
    if (!language) {
      return res
        .status(404)
        .json({ success: false, message: 'Language not found' });
    }

    cv.languages.pull(req.params.langId);
    await cv.save();

    res
      .status(200)
      .json({ success: true, message: 'Language deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// @desc    Update CV sections ordering/visibility
// @route   PUT /api/cv/:id/sections
// @access  Private
export const updateSections = async (req, res, next) => {
  try {
    const cv = await CV.findById(req.params.id);

    if (!cv || cv.userId.toString() !== req.user._id.toString()) {
      return res.status(404).json({ success: false, message: 'CV not found' });
    }

    cv.sections = req.body;
    await cv.save();

    res.status(200).json({ success: true, data: cv.sections });
  } catch (error) {
    next(error);
  }
};
