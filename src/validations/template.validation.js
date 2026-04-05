import { z } from 'zod';

const objectIdRegex = /^[a-fA-F0-9]{24}$/;

const templateListQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(12),
});

const templateParamsSchema = z.object({
  id: z.string().regex(objectIdRegex, 'Invalid ObjectId'),
});

const toValidationErrors = (zodIssues) =>
  zodIssues.map((err) => ({
    field: err.path.join('.'),
    message: err.message,
  }));

export const validateTemplateListQuery = (req, res, next) => {
  const result = templateListQuerySchema.safeParse(req.query);

  if (!result.success) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: toValidationErrors(result.error.issues ?? result.error.errors ?? []),
    });
  }

  req.validatedQuery = result.data;
  next();
};

export const validateTemplateIdParam = (req, res, next) => {
  const result = templateParamsSchema.safeParse(req.params);

  if (!result.success) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: toValidationErrors(result.error.issues ?? result.error.errors ?? []),
    });
  }

  req.validatedParams = result.data;
  next();
};
