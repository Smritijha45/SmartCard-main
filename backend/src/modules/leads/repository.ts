import { BaseRepository, IBaseRepository } from '../../repositories/BaseRepository';
import { ILeadDocument, LeadModel, LeadStatus } from './model';

export interface LeadFilterOptions {
  cardIds?: string[];
  userId?: string;
  companyId?: string;
  status?: LeadStatus | string;
  search?: string;
  startDate?: Date;
  endDate?: Date;
  page?: number;
  limit?: number;
}

export interface PaginatedLeadsResult {
  leads: ILeadDocument[];
  total: number;
  page: number;
  totalPages: number;
  statusCounts: Record<string, number>;
}

export interface ILeadRepository extends IBaseRepository<ILeadDocument> {
  findByCardIds(cardIds: string[]): Promise<ILeadDocument[]>;
  findFiltered(options: LeadFilterOptions): Promise<PaginatedLeadsResult>;
}

export class LeadRepository extends BaseRepository<ILeadDocument> implements ILeadRepository {
  constructor() {
    super(LeadModel);
  }

  async findByCardIds(cardIds: string[]): Promise<ILeadDocument[]> {
    return this.model
      .find({ cardId: { $in: cardIds } })
      .sort({ createdAt: -1 })
      .populate('cardId', 'name username template themeColor')
      .exec();
  }

  async findFiltered(options: LeadFilterOptions): Promise<PaginatedLeadsResult> {
    const {
      cardIds,
      userId,
      companyId,
      status,
      search,
      startDate,
      endDate,
      page = 1,
      limit = 20
    } = options;

    const query: any = {};

    if (companyId) {
      query.companyId = companyId;
    } else if (userId) {
      query.userId = userId;
    } else if (cardIds && cardIds.length > 0) {
      query.cardId = { $in: cardIds };
    }

    if (status && status !== 'All') {
      query.status = status;
    }

    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = startDate;
      if (endDate) query.createdAt.$lte = endDate;
    }

    if (search && search.trim()) {
      const regex = new RegExp(search.trim(), 'i');
      query.$or = [
        { name: regex },
        { email: regex },
        { phone: regex },
        { company: regex },
        { eventTag: regex },
        { notes: regex },
      ];
    }

    const skip = (page - 1) * limit;

    const [leads, total, stats] = await Promise.all([
      this.model
        .find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate('cardId', 'name username template themeColor')
        .exec(),
      this.model.countDocuments(query),
      this.model.aggregate([
        {
          $match: {
            ...(companyId ? { companyId } : userId ? { userId } : cardIds ? { cardId: { $in: cardIds } } : {})
          }
        },
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 }
          }
        }
      ])
    ]);

    const statusCounts: Record<string, number> = {
      New: 0,
      Contacted: 0,
      Qualified: 0,
      Converted: 0,
      Lost: 0,
    };

    stats.forEach((s) => {
      if (s._id) {
        statusCounts[s._id] = s.count;
      }
    });

    return {
      leads,
      total,
      page,
      totalPages: Math.ceil(total / limit) || 1,
      statusCounts
    };
  }
}
export default LeadRepository;
