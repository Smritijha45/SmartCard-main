import { Schema, model, Document } from 'mongoose';

export interface ICompany {
  name: string;
  domain?: string;
  ownerId: Schema.Types.ObjectId;
  subscriptionPlan: 'Free' | 'Pro' | 'Enterprise';
  isSuspended: boolean;
  deletedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICompanyDocument extends ICompany, Document {}

const CompanySchema = new Schema<ICompanyDocument>({
  name: { type: String, required: true, trim: true },
  domain: { type: String, unique: true, sparse: true, lowercase: true, trim: true, index: true },
  ownerId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  subscriptionPlan: { type: String, enum: ['Free', 'Pro', 'Enterprise'], default: 'Free' },
  isSuspended: { type: Boolean, default: false },
  deletedAt: { type: Date, default: null, index: true }
}, {
  timestamps: true
});

export const CompanyModel = model<ICompanyDocument>('Company', CompanySchema);
export default CompanyModel;
