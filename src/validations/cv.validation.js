import { z } from 'zod';

// ── Helper: MongoDB ObjectId string ──
const objectIdRegex = /^[a-fA-F0-9]{24}$/;
const objectIdSchema = z.string().regex(objectIdRegex, 'Invalid ObjectId');

// ── Sub-schemas (mirror cv.model.js) ──

const personalInfoSchema = z
  .object({
    fullName: z.string().trim().optional(),
    email: z.string().trim().email('Invalid email').optional(),
    phone: z.string().trim().optional(),
    address: z.string().trim().optional(),
    jobTitle: z.string().trim().optional(),
    summary: z.string().trim().optional(),
  })
  .optional();

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

export const skillSchema = z.object({
  skillName: z.string().trim().min(1, 'Skill name is required'),
  level: z
    .enum(['Beginner', 'Intermediate', 'Advanced', 'Expert'])
    .default('Intermediate'),
});

const projectSchema = z.object({
  projectName: z.string().trim().min(1, 'Project name is required'),
  description: z.string().trim().optional(),
  url: z.string().trim().url('Invalid URL').optional().or(z.literal('')),
  startDate: z.string().datetime({ offset: true }).optional(),
  endDate: z.string().datetime({ offset: true }).optional(),
});

const certificationSchema = z.object({
  name: z.string().trim().min(1, 'Certification name is required'),
  issuer: z.string().trim().optional(),
  issueDate: z.string().datetime({ offset: true }).optional(),
  expiryDate: z.string().datetime({ offset: true }).optional(),
  url: z.string().trim().url('Invalid URL').optional().or(z.literal('')),
});

const sectionSchema = z.object({
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

// ── Main schemas ──

export const createCVSchema = z.object({
  cvTitle: z.string().trim().min(1, 'CV title is required'),
  templateId: objectIdSchema.optional(),
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
    const errors = result.error.errors.map((err) => ({
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
