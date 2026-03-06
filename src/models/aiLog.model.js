import mongoose from 'mongoose';

const aiLogSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    cvId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'CV',
      index: true,
    },
    promptType: {
      type: String,
      required: true,
      enum: [
        'summary_generation',
        'skill_suggestion',
        'experience_rewrite',
        'full_cv_review',
        'cover_letter',
        'other',
      ],
    },
    provider: {
      type: String,
      required: true,
      enum: ['gemini', 'chatgpt'],
    },
    inputText: { type: String },
    responseText: { type: String },
    tokensUsed: { type: Number, default: 0 },
  },
  {
    timestamps: { createdAt: true, updatedAt: false }, // Only createdAt, logs are immutable
  },
);

export default mongoose.model('AiLog', aiLogSchema);
