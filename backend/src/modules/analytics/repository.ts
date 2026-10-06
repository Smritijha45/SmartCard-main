import { Types } from 'mongoose';
import { BaseRepository, IBaseRepository } from '../../repositories/BaseRepository';
import { IAnalyticsDocument, AnalyticsModel } from './model';

export interface IAnalyticsRepository extends IBaseRepository<IAnalyticsDocument> {
  getAggregateStats(
    cardId: string,
    startDate: Date,
    endDate: Date
  ): Promise<any>;
}

export class AnalyticsRepository extends BaseRepository<IAnalyticsDocument> implements IAnalyticsRepository {
  constructor() {
    super(AnalyticsModel);
  }

  async getAggregateStats(cardId: string, startDate: Date, endDate: Date): Promise<any> {
    const cardObjectId = new Types.ObjectId(cardId);

    const stats = await this.model.aggregate([
      {
        $match: {
          cardId: cardObjectId,
          timestamp: { $gte: startDate, $lte: endDate }
        }
      },
      {
        $facet: {
          eventSummary: [
            {
              $group: {
                _id: '$eventType',
                count: { $sum: 1 }
              }
            }
          ],
          deviceSummary: [
            {
              $group: {
                _id: '$device',
                count: { $sum: 1 }
              }
            },
            { $sort: { count: -1 } },
            { $limit: 5 }
          ],
          browserSummary: [
            {
              $group: {
                _id: '$browser',
                count: { $sum: 1 }
              }
            },
            { $sort: { count: -1 } },
            { $limit: 5 }
          ],
          locationSummary: [
            {
              $group: {
                _id: { country: '$country', city: '$city' },
                count: { $sum: 1 }
              }
            },
            { $sort: { count: -1 } },
            { $limit: 10 }
          ],
          timeline: [
            {
              $group: {
                _id: {
                  $dateToString: { format: '%Y-%m-%d', date: '$timestamp' }
                },
                views: {
                  $sum: { $cond: [{ $eq: ['$eventType', 'view'] }, 1, 0] }
                },
                scans: {
                  $sum: { $cond: [{ $eq: ['$eventType', 'scan'] }, 1, 0] }
                },
                clicks: {
                  $sum: { $cond: [{ $eq: ['$eventType', 'click'] }, 1, 0] }
                },
                saves: {
                  $sum: { $cond: [{ $eq: ['$eventType', 'save'] }, 1, 0] }
                }
              }
            },
            { $sort: { _id: 1 } }
          ]
        }
      }
    ]).exec();

    return stats[0] || {
      eventSummary: [],
      deviceSummary: [],
      browserSummary: [],
      locationSummary: [],
      timeline: []
    };
  }
}
export default AnalyticsRepository;
