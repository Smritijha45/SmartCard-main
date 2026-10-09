import { Schema, model, Document } from 'mongoose';
import { UserRole } from '../../constants/roles';

export interface IInvitation {
  companyId: Schema.Types.ObjectId;
  email: string;
  role: UserRole;
  token: string;
  status: 'pending' | 'accepted' | 'rejected' | 'expired' | 'revoked';
  invitedBy: Schema.Types.ObjectId;
  expiresAt: Date;
  acceptedAt?: Date;
  rejectedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface IInvitationDocument extends IInvitation, Document {}

const InvitationSchema = new Schema<IInvitationDocument>({
  companyId: { type: Schema.Types.ObjectId, ref: 'Company', required: true, index: true },
  email: { type: String, required: true, lowercase: true, trim: true, index: true },
  role: { type: String, enum: Object.values(UserRole), default: UserRole.EMPLOYEE },
  token: { type: String, required: true, unique: true, index: true },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected', 'expired', 'revoked'],
    default: 'pending',
    index: true
  },
  invitedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  expiresAt: { type: Date, required: true },
  acceptedAt: { type: Date },
  rejectedAt: { type: Date }
}, {
  timestamps: true
});

InvitationSchema.index({ companyId: 1, email: 1, status: 1 });

export const InvitationModel = model<IInvitationDocument>('Invitation', InvitationSchema);
export default InvitationModel;
