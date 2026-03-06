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
        isActive: { type: Boolean, default: true },
    },
    { timestamps: true },
);

export default mongoose.model('Template', templateSchema);
