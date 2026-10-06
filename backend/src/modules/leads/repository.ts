import { BaseRepository, IBaseRepository } from '../../repositories/BaseRepository';
import { ILeadDocument, LeadModel } from './model';

export interface ILeadRepository extends IBaseRepository<ILeadDocument> {
  findByCardIds(cardIds: string[]): Promise<ILeadDocument[]>;
}

export class LeadRepository extends BaseRepository<ILeadDocument> implements ILeadRepository {
  constructor() {
    super(LeadModel);
  }

  async findByCardIds(cardIds: string[]): Promise<ILeadDocument[]> {
    return this.model.find({ cardId: { $in: cardIds } }).sort({ createdAt: -1 }).populate('cardId', 'name template themeColor').exec();
  }
}
export default LeadRepository;
