import { BaseRepository, IBaseRepository } from '../../repositories/BaseRepository';
import { IUserDocument, UserModel } from './model';

export interface IUserRepository extends IBaseRepository<IUserDocument> {
  findByEmail(email: string): Promise<IUserDocument | null>;
  findByAccountId(accountId: string): Promise<IUserDocument | null>;
  findByResetToken(token: string): Promise<IUserDocument | null>;
  findByVerificationToken(token: string): Promise<IUserDocument | null>;
  addRefreshToken(userId: string, token: string, expiresAt: Date, ip?: string, device?: string): Promise<void>;
  revokeRefreshToken(userId: string, token: string): Promise<void>;
  findActiveSession(userId: string, token: string): Promise<boolean>;
  setOtp(userId: string, code: string, expiresAt: Date): Promise<void>;
  clearOtp(userId: string): Promise<void>;
}

export class UserRepository extends BaseRepository<IUserDocument> implements IUserRepository {
  constructor() {
    super(UserModel);
  }

  async findByEmail(email: string): Promise<IUserDocument | null> {
    return this.findOne({ email: email.toLowerCase() });
  }

  async findByAccountId(accountId: string): Promise<IUserDocument | null> {
    return this.findOne({ accountId });
  }

  async findByResetToken(token: string): Promise<IUserDocument | null> {
    return this.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: new Date() }
    });
  }

  async findByVerificationToken(token: string): Promise<IUserDocument | null> {
    return this.findOne({
      emailVerificationToken: token,
      emailVerificationExpires: { $gt: new Date() }
    });
  }

  async addRefreshToken(
    userId: string,
    token: string,
    expiresAt: Date,
    ip?: string,
    device?: string
  ): Promise<void> {
    await this.model.updateOne(
      { _id: userId },
      {
        $push: {
          refreshTokens: { token, expiresAt, ip, device }
        }
      }
    ).exec();
  }

  async revokeRefreshToken(userId: string, token: string): Promise<void> {
    await this.model.updateOne(
      { _id: userId },
      {
        $pull: {
          refreshTokens: { token }
        }
      }
    ).exec();
  }

  async findActiveSession(userId: string, token: string): Promise<boolean> {
    const user = await this.model.findOne({
      _id: userId,
      'refreshTokens.token': token,
      'refreshTokens.expiresAt': { $gt: new Date() }
    }).exec();
    return !!user;
  }

  async setOtp(userId: string, code: string, expiresAt: Date): Promise<void> {
    await this.model.updateOne(
      { _id: userId },
      {
        $set: {
          otp: { code, expiresAt }
        }
      }
    ).exec();
  }

  async clearOtp(userId: string): Promise<void> {
    await this.model.updateOne(
      { _id: userId },
      {
        $unset: { otp: '' }
      }
    ).exec();
  }
}
export default UserRepository;
