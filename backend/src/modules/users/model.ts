import { Schema, model, Document } from 'mongoose';
import { UserRole } from '../../constants/roles';

export interface IUserSession {
  token: string;
  expiresAt: Date;
  device?: string;
  ip?: string;
}

export interface IUser {
  name: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  companyId?: Schema.Types.ObjectId;
  profilePhoto?: string;
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

const UserSessionSchema = new Schema<IUserSession>({
  token: { type: String, required: true },
  expiresAt: { type: Date, required: true },
  device: { type: String },
  ip: { type: String }
}, { _id: false });

const UserSchema = new Schema<IUserDocument>({
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
  companyId: { type: Schema.Types.ObjectId, ref: 'Company', index: true },
  profilePhoto: { type: String },
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
