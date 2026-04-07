import { z } from 'zod';

// ── Helper: MongoDB ObjectId string ──
// Removed due to text-based templateId

// ── Sub-schemas (mirror cv.model.js) ──

export const personalInfoSchema = z
  .object({
    fullName: z.string().trim().optional(),
    email: z.string().trim().email('Invalid email').optional(),
    phone: z.string().trim().optional(),
    address: z.string().trim().optional(),
    jobTitle: z.string().trim().optional(),
    summary: z.string().trim().optional(),
  })
  .optional();

export const personalInfoUpdateSchema = personalInfoSchema
  .unwrap()
  .partial()
  .refine((val) => Object.keys(val).length > 0, {
    message: 'At least one personal info field is required',
  });

export const educationSchema = z.object({
  schoolName: z.string().trim().min(1, 'School name is required'),
  major: z.string().trim().optional(),
  startDate: z.string().datetime({ offset: true }).optional(),
  endDate: z.string().datetime({ offset: true }).optional(),
  description: z.string().trim().optional(),
});

export const experienceSchema = z.object({
  companyName: z.string().trim().min(1, 'Company name is required'),
  position: z.string().trim().min(1, 'Position is required'),
  startDate: z.string().datetime({ offset: true }).optional(),
  endDate: z.string().datetime({ offset: true }).optional(),
  description: z.string().trim().optional(),
});

const skillLevelSchema = z.enum([
  'Beginner',
  'Intermediate',
  'Advanced',
  'Expert',
]);

export const skillSchema = z.object({
  skillName: z.string().trim().min(1, 'Skill name is required'),
  level: skillLevelSchema.default('Intermediate'),
});

// ── Update (partial) schemas for embedded resources ──
// PUT handlers support partial updates via Object.assign(), so required fields
// are made optional, but empty `{}` updates are rejected.
export const educationUpdateSchema = educationSchema
  .partial()
  .refine((val) => Object.keys(val).length > 0, {
    message: 'At least one education field is required',
  });

export const experienceUpdateSchema = experienceSchema
  .partial()
  .refine((val) => Object.keys(val).length > 0, {
    message: 'At least one experience field is required',
  });

export const skillUpdateSchema = z
  .object({
    skillName: z.string().trim().min(1, 'Skill name is required'),
    level: skillLevelSchema,
  })
  .partial()
  .refine((val) => Object.keys(val).length > 0, {
    message: 'At least one skill field is required',
  });

export const projectSchema = z.object({
  projectName: z.string().trim().min(1, 'Project name is required'),
  description: z.string().trim().optional(),
  url: z.string().trim().url('Invalid URL').optional().or(z.literal('')),
  startDate: z.string().datetime({ offset: true }).optional(),
  endDate: z.string().datetime({ offset: true }).optional(),
});

export const projectUpdateSchema = projectSchema
  .partial()
  .refine((val) => Object.keys(val).length > 0, {
    message: 'At least one project field is required',
  });

export const certificationSchema = z.object({
  name: z.string().trim().min(1, 'Certification name is required'),
  issuer: z.string().trim().optional(),
  issueDate: z.string().datetime({ offset: true }).optional(),
  expiryDate: z.string().datetime({ offset: true }).optional(),
  url: z.string().trim().url('Invalid URL').optional().or(z.literal('')),
});

export const certificationUpdateSchema = certificationSchema
  .partial()
  .refine((val) => Object.keys(val).length > 0, {
    message: 'At least one certification field is required',
  });

export const sectionSchema = z.object({
  sectionKey: z.enum([
    'personalInfo',
    'educations',
    'experiences',
    'skills',
    'projects',
    'certifications',
  ]),
  displayName: z.string().trim().min(1, 'Display name is required'),
  order: z.number().int().min(0),
  isVisible: z.boolean().default(true),
});

export const sectionsUpdateSchema = z
  .array(sectionSchema)
  .min(1, 'Sections array cannot be empty');

// ── Main schemas ──

export const createCVSchema = z.object({
  cvTitle: z.string().trim().min(1, 'CV title is required'),
  templateId: z.string().trim().min(1, 'Template ID is required'),
  status: z.enum(['draft', 'completed', 'published']).default('draft'),
  personalInfo: personalInfoSchema,
  educations: z.array(educationSchema).optional(),
  experiences: z.array(experienceSchema).optional(),
  skills: z.array(skillSchema).optional(),
  projects: z.array(projectSchema).optional(),
  certifications: z.array(certificationSchema).optional(),
  sections: z.array(sectionSchema).optional(),
});

export const updateCVSchema = createCVSchema.partial();

// ── Validation middleware factory ──

export const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);

  if (!result.success) {
    // Zod historically used `.errors` (older versions) and newer uses `.issues`.
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
