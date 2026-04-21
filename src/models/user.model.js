import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

// ── Embedded Sub-Schemas ──

const profileEducationSchema = new mongoose.Schema({
  schoolName: { type: String, required: true, trim: true },
  major: { type: String, trim: true },
  startDate: { type: Date },
  endDate: { type: Date },
});

const profileExperienceSchema = new mongoose.Schema({
  companyName: { type: String, required: true, trim: true },
  position: { type: String, required: true, trim: true },
  startDate: { type: Date },
  endDate: { type: Date },
});

const userSchema = new mongoose.Schema(
  {
    // Auth fields
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String }, // Not required for OAuth users
    fullName: { type: String, trim: true },
    // Deprecated: kept for backwards compatibility with existing records.
    firstName: { type: String, trim: true },
    lastName: { type: String, trim: true },
    refreshToken: String,
    googleId: { type: String, default: null },
    githubId: { type: String, default: null },

    // Role
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },

    // Profile fields (used as defaults when creating a new CV)
    phone: { type: String, trim: true },
    address: { type: String, trim: true },
    jobTitle: { type: String, trim: true },
    summary: { type: String, trim: true },
    website: { type: String, trim: true },

    // Basic information
    birthday: { type: Date, default: null },
    gender: {
      type: String,
      enum: ['Male', 'Female', 'Other', 'Prefer not to say', null],
      default: null,
    },

    // History
    experiences: { type: [profileExperienceSchema], default: [] },
    educations: { type: [profileEducationSchema], default: [] },
  },
  { timestamps: true },
);

// Hash password before saving
userSchema.pre('save', async function () {
  if (!this.isModified('password') || !this.password) return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Method to verify password
userSchema.methods.matchPassword = async function (enteredPassword) {
  if (!this.password) return false;
  return await bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model('User', userSchema);
