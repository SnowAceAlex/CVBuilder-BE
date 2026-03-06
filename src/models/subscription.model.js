import mongoose from 'mongoose';

const subscriptionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    plan: {
      type: String,
      required: true,
      enum: ['free', 'pro', 'premium'],
      default: 'free',
    },
    status: {
      type: String,
      required: true,
      enum: ['active', 'expired', 'cancelled'],
      default: 'active',
    },
    aiRequestLimit: {
      type: Number,
      required: true,
      default: 5, // Free tier default
    },
    startDate: { type: Date, default: Date.now },
    endDate: { type: Date },
    paymentProvider: {
      type: String,
      enum: ['stripe', null],
      default: null,
    },
    stripeCustomerId: { type: String, default: null },
    stripeSubscriptionId: { type: String, default: null },
  },
  { timestamps: true },
);

export default mongoose.model('Subscription', subscriptionSchema);
