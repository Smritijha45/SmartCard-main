import { Schema, model, Document } from 'mongoose';
import { SubscriptionPlanTier } from '../../config/plans';

export interface ICustomDomain {
  domain: string;
  verificationToken: string;
  status: 'pending' | 'verified' | 'failed';
  dnsType: 'TXT' | 'CNAME';
  targetRecord: string;
  verifiedAt?: Date;
  routingTarget?: string;
  lastCheckedAt?: Date;
  verificationError?: string;
}

export interface ISSOConfig {
  enabled: boolean;
  provider: 'google' | 'azure' | 'saml' | 'oidc';
  clientId?: string;
  clientSecret?: string;
  issuerUrl?: string;
  metadataUrl?: string;
  domainHint?: string;
  status: 'unconfigured' | 'active' | 'invalid';
  lastValidatedAt?: Date;
  validationError?: string;
}

export interface ICompanyBranding {
  logoUrl?: string;
  primaryColor?: string;
  secondaryColor?: string;
  badgeText?: string;
  hidePlatformBadge?: boolean;
  cardTheme?: string;
}

export interface ICompany {
  name: string;
  domain?: string;
  ownerId: Schema.Types.ObjectId;
  subscriptionPlan: SubscriptionPlanTier;
  memberLimit: number;
  cardLimit: number;
  branding?: ICompanyBranding;
  customDomain?: ICustomDomain;
  ssoConfig?: ISSOConfig;
  isSuspended: boolean;
  deletedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICompanyDocument extends ICompany, Document {}

const CustomDomainSchema = new Schema<ICustomDomain>({
  domain: { type: String, trim: true, lowercase: true },
  verificationToken: { type: String, required: true },
  status: { type: String, enum: ['pending', 'verified', 'failed'], default: 'pending' },
  dnsType: { type: String, enum: ['TXT', 'CNAME'], default: 'TXT' },
  targetRecord: { type: String, required: true },
  verifiedAt: { type: Date },
  routingTarget: { type: String },
  lastCheckedAt: { type: Date },
  verificationError: { type: String },
}, { _id: false });

const SSOConfigSchema = new Schema<ISSOConfig>({
  enabled: { type: Boolean, default: false },
  provider: { type: String, enum: ['google', 'azure', 'saml', 'oidc'], default: 'google' },
  clientId: { type: String, trim: true },
  clientSecret: { type: String, trim: true },
  issuerUrl: { type: String, trim: true },
  metadataUrl: { type: String, trim: true },
  domainHint: { type: String, trim: true },
  status: { type: String, enum: ['unconfigured', 'active', 'invalid'], default: 'unconfigured' },
  lastValidatedAt: { type: Date },
  validationError: { type: String },
}, { _id: false });

const BrandingSchema = new Schema<ICompanyBranding>({
  logoUrl: { type: String, trim: true },
  primaryColor: { type: String, default: '#2563EB' },
  secondaryColor: { type: String, default: '#1E293B' },
  badgeText: { type: String, default: 'Enterprise Verified' },
  hidePlatformBadge: { type: Boolean, default: false },
  cardTheme: { type: String, default: 'executive-dark' },
}, { _id: false });

const CompanySchema = new Schema<ICompanyDocument>({
  name: { type: String, required: true, trim: true },
  domain: { type: String, unique: true, sparse: true, lowercase: true, trim: true, index: true },
  ownerId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  subscriptionPlan: {
    type: String,
    enum: ['starter', 'professional', 'enterprise'],
    default: 'enterprise'
  },
  memberLimit: { type: Number, default: 25 },
  cardLimit: { type: Number, default: 100 },
  branding: { type: BrandingSchema, default: () => ({}) },
  customDomain: { type: CustomDomainSchema },
  ssoConfig: { type: SSOConfigSchema, default: () => ({ enabled: false, provider: 'google', status: 'unconfigured' }) },
  isSuspended: { type: Boolean, default: false },
  deletedAt: { type: Date, default: null, index: true }
}, {
  timestamps: true
});

export const CompanyModel = model<ICompanyDocument>('Company', CompanySchema);
export default CompanyModel;
