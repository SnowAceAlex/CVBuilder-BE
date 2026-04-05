import mongoose from 'mongoose';

const templateSectionSchema = new mongoose.Schema(
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

const templateFieldSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, trim: true },
    label: { type: String, trim: true },
    placeholder: { type: String, trim: true },
    inputType: {
      type: String,
      enum: ['text', 'textarea', 'email', 'tel', 'url', 'date', 'select'],
      default: 'text',
    },
    required: { type: Boolean, default: false },
    isVisible: { type: Boolean, default: true },
    options: [{ type: String, trim: true }],
    defaultValue: { type: mongoose.Schema.Types.Mixed },
  },
  { _id: false },
);

const templateSectionConfigSchema = new mongoose.Schema(
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
    fields: [templateFieldSchema],
    // Used for array sections, e.g. experiences entries
    minItems: { type: Number, min: 0 },
    maxItems: { type: Number, min: 0 },
    defaultEntries: [{ type: mongoose.Schema.Types.Mixed }],
  },
  { _id: false },
);

const templateSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    thumbnailUrl: { type: String, trim: true },
    category: {
      type: String,
      enum: ['professional', 'creative', 'minimal', 'modern', 'academic'],
      default: 'professional',
    },
    // Default section layout — copied into CVs that use this template
    sections: [templateSectionSchema],
    // V2 layout structure; preferred for new templates
    layout: {
      sections: [templateSectionSchema],
    },
    // Field-level section config for template-driven CV building
    fieldConfig: [templateSectionConfigSchema],
    schemaVersion: { type: Number, default: 1, min: 1 },
    renderMeta: {
      variant: { type: String, trim: true },
      supportsPhoto: { type: Boolean, default: false },
      tokens: { type: Map, of: String },
    },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

templateSchema.pre('validate', function ensureLayoutSections(next) {
  if (!this.layout) {
    this.layout = {};
  }

  const layoutSections = this.layout.sections;
  const hasLayoutSections = Array.isArray(layoutSections) && layoutSections.length > 0;
  const hasLegacySections =
    Array.isArray(this.sections) && this.sections.length > 0;

  if (!hasLayoutSections && hasLegacySections) {
    this.layout.sections = this.sections;
  }

  if (!hasLegacySections && hasLayoutSections) {
    this.sections = layoutSections;
  }

  next();
});

export default mongoose.model('Template', templateSchema);
