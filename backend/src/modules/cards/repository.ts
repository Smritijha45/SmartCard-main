import { BaseRepository, IBaseRepository } from '../../repositories/BaseRepository';
import { ICardDocument, CardModel } from './model';

export interface ICardRepository extends IBaseRepository<ICardDocument> {
  findByUser(userId: string): Promise<ICardDocument[]>;
  findByCompany(companyId: string): Promise<ICardDocument[]>;
  findByUsername(username: string): Promise<ICardDocument | null>;
  findByIdOrUsername(identifier: string): Promise<ICardDocument | null>;
  incrementViews(cardId: string): Promise<void>;
  incrementScans(cardId: string): Promise<void>;
}

export class CardRepository extends BaseRepository<ICardDocument> implements ICardRepository {
  constructor() {
    super(CardModel);
  }

  async findByUser(userId: string): Promise<ICardDocument[]> {
    return this.find({ userId });
  }

  async findByCompany(companyId: string): Promise<ICardDocument[]> {
    return this.find({ companyId });
  }

  async findByUsername(username: string): Promise<ICardDocument | null> {
    return this.model.findOne({ username: username.toLowerCase().trim(), deletedAt: null }).exec();
  }

  async findByIdOrUsername(identifier: string): Promise<ICardDocument | null> {
    if (/^[0-9a-fA-F]{24}$/.test(identifier)) {
      const byId = await this.model.findOne({ _id: identifier, deletedAt: null }).exec();
      if (byId) return byId;
    }
    return this.model.findOne({ username: identifier.toLowerCase().trim(), deletedAt: null }).exec();
  }

  async incrementViews(cardId: string): Promise<void> {
    await this.model.updateOne({ _id: cardId }, { $inc: { views: 1 } }).exec();
  }

  async incrementScans(cardId: string): Promise<void> {
    await this.model.updateOne({ _id: cardId }, { $inc: { scans: 1 } }).exec();
  }
}
