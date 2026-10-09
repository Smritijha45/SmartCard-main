import { Schema, model, Document } from 'mongoose';
import { UserRole } from '../../constants/roles';
import { SubscriptionPlanTier } from '../../config/plans';

export interface IUserSession {
  token: string;
  expiresAt: Date;
  device?: string;
  ip?: string;
}

export interface IUserCustomLimits {
  maxActiveCards?: number;
  maxTeamMembers?: number;
}

export interface IPaymentRecord {
  id: string;
  amount: number;
  currency: string;
  status: 'completed' | 'pending' | 'failed' | 'refunded';
  invoiceUrl?: string;
  description: string;
  date: Date;
  paymentMethod?: string;
}

export interface IUserSubscription {
  plan: SubscriptionPlanTier;
  status: 'active' | 'trialing' | 'past_due' | 'canceled' | 'expired';
  is24hPass?: boolean;
  passExpiryDate?: Date;
  trialStartDate?: Date;
  trialExpiryDate?: Date;
  currentPeriodStart?: Date;
  currentPeriodEnd?: Date;
  paymentProvider?: 'razorpay' | 'stripe' | 'manual';
  paymentProviderId?: string;
  cancelAtPeriodEnd?: boolean;
  canceledAt?: Date;
  paymentHistory: IPaymentRecord[];
}

export interface IUser {
  accountId: string;
  name: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  subscriptionPlan: SubscriptionPlanTier;
  subscription: IUserSubscription;
  customLimits?: IUserCustomLimits;
  companyId?: Schema.Types.ObjectId;
  profilePhoto?: string;
  isSuspended: boolean;
  isEmailVerified: boolean;
  emailVerificationToken?: string;
  emailVerificationExpires?: Date;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  otp?: {
    code: string;
    expiresAt: Date;
  };
  refreshTokens: IUserSession[];
  deletedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserDocument extends IUser, Document {}

const PaymentRecordSchema = new Schema<IPaymentRecord>({
  id: { type: String, required: true },
  amount: { type: Number, required: true },
  currency: { type: String, default: 'INR' },
  status: { type: String, enum: ['completed', 'pending', 'failed', 'refunded'], default: 'completed' },
  invoiceUrl: { type: String },
  description: { type: String, required: true },
  date: { type: Date, default: Date.now },
  paymentMethod: { type: String, default: 'UPI / Card' }
}, { _id: false });

const UserSubscriptionSchema = new Schema<IUserSubscription>({
  plan: {
    type: String,
    enum: ['starter', 'professional', 'enterprise'],
    default: 'starter',
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'trialing', 'past_due', 'canceled', 'expired'],
    default: 'active',
    required: true
  },
  is24hPass: { type: Boolean, default: false },
  passExpiryDate: { type: Date },
  trialStartDate: { type: Date },
  trialExpiryDate: { type: Date },
  currentPeriodStart: { type: Date, default: Date.now },
  currentPeriodEnd: { type: Date },
  paymentProvider: { type: String, enum: ['razorpay', 'stripe', 'manual'], default: 'manual' },
  paymentProviderId: { type: String },
  cancelAtPeriodEnd: { type: Boolean, default: false },
  canceledAt: { type: Date },
  paymentHistory: [PaymentRecordSchema]
}, { _id: false });

const UserSessionSchema = new Schema<IUserSession>({
  token: { type: String, required: true },
  expiresAt: { type: Date, required: true },
  device: { type: String },
  ip: { type: String }
}, { _id: false });

const UserSchema = new Schema<IUserDocument>({
  accountId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  name: { type: String, required: true, trim: true },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    index: true
  },
  passwordHash: { type: String, required: true },
  role: {
    type: String,
    enum: Object.values(UserRole),
    default: UserRole.USER,
    index: true
  },
  subscriptionPlan: {
    type: String,
    enum: ['starter', 'professional', 'enterprise'],
    default: 'starter',
    index: true
  },
  subscription: {
    type: UserSubscriptionSchema,
    default: () => ({
      plan: 'starter',
      status: 'active',
      is24hPass: false,
      currentPeriodStart: new Date(),
      paymentHistory: []
    })
  },
  customLimits: {
    maxActiveCards: { type: Number },
    maxTeamMembers: { type: Number }
  },
  companyId: { type: Schema.Types.ObjectId, ref: 'Company', index: true },
  profilePhoto: { type: String },
  isSuspended: { type: Boolean, default: false },
  isEmailVerified: { type: Boolean, default: false },
  emailVerificationToken: { type: String },
  emailVerificationExpires: { type: Date },
  resetPasswordToken: { type: String },
  resetPasswordExpires: { type: Date },
  otp: {
    code: { type: String },
    expiresAt: { type: Date }
  },
  refreshTokens: [UserSessionSchema],
  deletedAt: { type: Date, default: null, index: true }
}, {
  timestamps: true
});

export const UserModel = model<IUserDocument>('User', UserSchema);
export default UserModel;
