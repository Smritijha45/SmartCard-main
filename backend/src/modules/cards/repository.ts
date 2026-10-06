import { BaseRepository, IBaseRepository } from '../../repositories/BaseRepository';
import { ICardDocument, CardModel } from './model';

export interface ICardRepository extends IBaseRepository<ICardDocument> {
  findByUser(userId: string): Promise<ICardDocument[]>;
  findByCompany(companyId: string): Promise<ICardDocument[]>;
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

  async incrementViews(cardId: string): Promise<void> {
    await this.model.updateOne({ _id: cardId }, { $inc: { views: 1 } }).exec();
  }

  async incrementScans(cardId: string): Promise<void> {
    await this.model.updateOne({ _id: cardId }, { $inc: { scans: 1 } }).exec();
  }
}
