import { z } from 'zod';

// ── Shared constants ──

const ALLOWED_GENDERS = ['Male', 'Female', 'Other', 'Prefer not to say'];

const PASSWORD_MIN = 8;
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/;

const passwordSchema = z
  .string()
  .min(PASSWORD_MIN, `Password must be at least ${PASSWORD_MIN} characters`)
  .regex(
    PASSWORD_REGEX,
    'Password must include uppercase, lowercase, and number',
  );

// ── Auth schemas ──

export const registerSchema = z.object({
  email: z
    .string({ required_error: 'Email is required' })
    .trim()
    .email('Invalid email format')
    .toLowerCase(),
  password: passwordSchema,
  fullName: z
    .string({ required_error: 'Full name is required' })
    .trim()
    .min(1, 'Full name is required')
    .max(100, 'Full name must be at most 100 characters'),
});

export const loginSchema = z.object({
  email: z
    .string({ required_error: 'Email is required' })
    .trim()
    .email('Invalid email format')
    .toLowerCase(),
  password: z
    .string({ required_error: 'Password is required' })
    .min(1, 'Password is required'),
});

export const changePasswordSchema = z.object({
  currentPassword: z
    .string({ required_error: 'Current password is required' })
    .min(1, 'Current password is required'),
  newPassword: passwordSchema,
});

// ── Profile schemas ──

export const updateProfileSchema = z
  .object({
    fullName: z
      .string()
      .trim()
      .min(1, 'Full name cannot be empty')
      .max(100)
      .optional(),
    phone: z.string().trim().max(14, 'Phone is too long').optional().nullable(),
    address: z
      .string()
      .trim()
      .max(200, 'Address is too long')
      .optional()
      .nullable(),
    jobTitle: z
      .string()
      .trim()
      .max(100, 'Job title is too long')
      .optional()
      .nullable(),
    summary: z
      .string()
      .trim()
      .max(2000, 'Summary is too long')
      .optional()
      .nullable(),
    website: z
      .string()
      .trim()
      .url('Invalid website URL')
      .optional()
      .nullable()
      .or(z.literal('')),
    birthday: z
      .string()
      .datetime({ offset: true, message: 'Invalid date format' })
      .optional()
      .nullable()
      .or(z.literal('')),
    gender: z
      .enum(ALLOWED_GENDERS, {
        errorMap: () => ({
          message: `Gender must be one of: ${ALLOWED_GENDERS.join(', ')}`,
        }),
      })
      .optional()
      .nullable(),
  })
  .refine((val) => Object.keys(val).length > 0, {
    message: 'At least one profile field is required',
  });

// ── Experience schemas ──

export const addExperienceSchema = z.object({
  companyName: z
    .string({ required_error: 'Company name is required' })
    .trim()
    .min(1, 'Company name is required')
    .max(200, 'Company name is too long'),
  position: z
    .string({ required_error: 'Position is required' })
    .trim()
    .min(1, 'Position is required')
    .max(200, 'Position is too long'),
  startDate: z.string().datetime({ offset: true }).optional().nullable(),
  endDate: z.string().datetime({ offset: true }).optional().nullable(),
});

export const updateExperienceSchema = addExperienceSchema
  .partial()
  .refine((val) => Object.keys(val).length > 0, {
    message: 'At least one experience field is required',
  });

// ── Education schemas ──

export const addEducationSchema = z.object({
  schoolName: z
    .string({ required_error: 'School name is required' })
    .trim()
    .min(1, 'School name is required')
    .max(200, 'School name is too long'),
  major: z.string().trim().max(200, 'Major is too long').optional().nullable(),
  startDate: z.string().datetime({ offset: true }).optional().nullable(),
  endDate: z.string().datetime({ offset: true }).optional().nullable(),
});

export const updateEducationSchema = addEducationSchema
  .partial()
  .refine((val) => Object.keys(val).length > 0, {
    message: 'At least one education field is required',
  });

// ── Avatar schema ──

export const uploadAvatarSchema = z.object({
  url: z
    .string({ required_error: 'URL is required' })
    .trim()
    .url('Invalid avatar URL')
    .min(1, 'URL is required'),
  publicId: z.string().trim().optional(),
});

// ── Param validators ──

export const mongoIdParamSchema = z.object({
  id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid ID format'),
});

// ── Validation middleware factory (reuse from cv.validation.js pattern) ──

export const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);

  if (!result.success) {
    const zodError = result.error;
    const zodIssues = zodError.issues ?? zodError.errors ?? [];

    const errors = zodIssues.map((err) => ({
      field: err.path.join('.'),
      message: err.message,
    }));

    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors,
    });
  }

  req.body = result.data;
  next();
};

export const validateParams = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.params);

  if (!result.success) {
    const zodError = result.error;
    const zodIssues = zodError.issues ?? zodError.errors ?? [];

    const errors = zodIssues.map((err) => ({
      field: err.path.join('.'),
      message: err.message,
    }));

    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors,
    });
  }

  next();
};
