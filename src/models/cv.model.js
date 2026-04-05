import mongoose from 'mongoose';

// ── Embedded Sub-Schemas ──

const personalInfoSchema = new mongoose.Schema(
  {
    fullName: { type: String, trim: true },
    email: { type: String, trim: true },
    phone: { type: String, trim: true },
    address: { type: String, trim: true },
    jobTitle: { type: String, trim: true },
    summary: { type: String, trim: true },
  },
  { _id: false },
);

const educationSchema = new mongoose.Schema({
  schoolName: { type: String, required: true, trim: true },
  major: { type: String, trim: true },
  startDate: { type: Date },
  endDate: { type: Date },
  description: { type: String, trim: true },
});

const experienceSchema = new mongoose.Schema({
  companyName: { type: String, required: true, trim: true },
  position: { type: String, required: true, trim: true },
  startDate: { type: Date },
  endDate: { type: Date },
  description: { type: String, trim: true },
});

const skillSchema = new mongoose.Schema({
  skillName: { type: String, required: true, trim: true },
  level: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced', 'Expert'],
    default: 'Intermediate',
  },
});

const projectSchema = new mongoose.Schema({
  projectName: { type: String, required: true, trim: true },
  description: { type: String, trim: true },
  url: { type: String, trim: true },
  startDate: { type: Date },
  endDate: { type: Date },
});

const certificationSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  issuer: { type: String, trim: true },
  issueDate: { type: Date },
  expiryDate: { type: Date },
  url: { type: String, trim: true },
});

const sectionSchema = new mongoose.Schema(
  {
    sectionKey: {
      type: String,
      required: true,
      enum: [
        'personalInfo',
        'educations',
        'experiences',
        'skills',
        'projects',
        'certifications',
      ],
    },
    displayName: { type: String, required: true },
    order: { type: Number, required: true },
    isVisible: { type: Boolean, default: true },
  },
  { _id: false },
);

const templateSnapshotSectionSchema = new mongoose.Schema(
  {
    sectionKey: {
      type: String,
      enum: [
        'personalInfo',
        'educations',
        'experiences',
        'skills',
        'projects',
        'certifications',
      ],
    },
    displayName: { type: String },
    order: { type: Number },
    isVisible: { type: Boolean },
  },
  { _id: false },
);

const templateSnapshotSchema = new mongoose.Schema(
  {
    templateId: { type: mongoose.Schema.Types.ObjectId, ref: 'Template' },
    name: { type: String, trim: true },
    category: { type: String, trim: true },
    thumbnailUrl: { type: String, trim: true },
    schemaVersion: { type: Number },
    layout: {
      sections: [templateSnapshotSectionSchema],
    },
    fieldConfig: [{ type: mongoose.Schema.Types.Mixed }],
    renderMeta: { type: mongoose.Schema.Types.Mixed },
  },
  { _id: false },
);

// ── Main CV Schema ──

const cvSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    templateId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Template',
      required: true,
    },
    cvTitle: {
      type: String,
      required: true,
      trim: true,
      default: 'Untitled CV',
    },
    status: {
      type: String,
      enum: ['draft', 'completed', 'published'],
      default: 'draft',
    },

    // Embedded content
    personalInfo: personalInfoSchema,
    educations: [educationSchema],
    experiences: [experienceSchema],
    skills: [skillSchema],
    projects: [projectSchema],
    certifications: [certificationSchema],

    // Section ordering for drag-and-drop
    sections: [sectionSchema],
    templateSnapshot: templateSnapshotSchema,
  },
  { timestamps: true },
);

export default mongoose.model('CV', cvSchema);
