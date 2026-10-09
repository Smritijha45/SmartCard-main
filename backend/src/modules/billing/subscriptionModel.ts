import { Schema, model, Document, Types } from 'mongoose';
import { SubscriptionPlanTier } from '../../config/plans';

export interface ISubscription {
  userId: Types.ObjectId;
  companyId?: Types.ObjectId;
  plan: SubscriptionPlanTier;
  status: 'active' | 'trialing' | 'past_due' | 'canceled' | 'expired';
  is24hPass: boolean;
  passExpiryDate?: Date;
  razorpaySubscriptionId?: string;
  razorpayPlanId?: string;
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  cancelAtPeriodEnd: boolean;
  canceledAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface ISubscriptionDocument extends ISubscription, Document {}

const SubscriptionSchema = new Schema<ISubscriptionDocument>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true, index: true },
  companyId: { type: Schema.Types.ObjectId, ref: 'Company', index: true },
  plan: {
    type: String,
    enum: ['starter', 'professional', 'enterprise'],
    default: 'starter',
    required: true,
    index: true
  },
  status: {
    type: String,
    enum: ['active', 'trialing', 'past_due', 'canceled', 'expired'],
    default: 'active',
    required: true,
    index: true
  },
  is24hPass: { type: Boolean, default: false, index: true },
  passExpiryDate: { type: Date, index: true },
  razorpaySubscriptionId: { type: String, sparse: true, index: true },
  razorpayPlanId: { type: String },
  currentPeriodStart: { type: Date, default: Date.now },
  currentPeriodEnd: { type: Date, default: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) },
  cancelAtPeriodEnd: { type: Boolean, default: false },
  canceledAt: { type: Date }
}, {
  timestamps: true
});

export const SubscriptionModel = model<ISubscriptionDocument>('Subscription', SubscriptionSchema);
export default SubscriptionModel;
