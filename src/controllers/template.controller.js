import Template from '../models/template.model.js';

// @desc    List active CV templates
// @route   GET /api/templates
// @access  Public
export const getTemplates = async (req, res, next) => {
  try {
    const page = req.validatedQuery?.page ?? 1;
    const limit = req.validatedQuery?.limit ?? 12;
    const skip = (page - 1) * limit;

    const [templates, total] = await Promise.all([
      Template.find({ isActive: true })
        .select(
          'name thumbnailUrl category schemaVersion renderMeta layout sections',
        )
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Template.countDocuments({ isActive: true }),
    ]);

    const totalPages = Math.ceil(total / limit) || 1;

    res.status(200).json({
      success: true,
      data: templates,
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get template details by ID
// @route   GET /api/templates/:id
// @access  Public
export const getTemplateById = async (req, res, next) => {
  try {
    const templateId = req.validatedParams?.id ?? req.params.id;
    const template = await Template.findOne({
      _id: templateId,
      isActive: true,
    });

    if (!template) {
      return res
        .status(404)
        .json({ success: false, message: 'Template not found' });
    }

    res.status(200).json({ success: true, data: template });
  } catch (error) {
    next(error);
  }
};
