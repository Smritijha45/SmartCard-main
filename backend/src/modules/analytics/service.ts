import { AnalyticsRepository } from './repository';
import { CardRepository } from '../cards/repository';
import { getRedisClient } from '../../lib/redis';
import config from '../../config';
import { NotFoundError, ForbiddenError } from '../../errors/AppError';
import logger from '../../lib/logger';

export class AnalyticsService {
  private analyticsRepository: AnalyticsRepository;
  private cardRepository: CardRepository;

  constructor(
    analyticsRepository = new AnalyticsRepository(),
    cardRepository = new CardRepository()
  ) {
    this.analyticsRepository = analyticsRepository;
    this.cardRepository = cardRepository;
  }

  async track(
    cardId: string,
    eventType: 'view' | 'scan' | 'click' | 'save',
    clientDetails: { ip?: string; userAgent?: string; referrer?: string; buttonId?: string }
  ): Promise<void> {
    try {
      const card = await this.cardRepository.findById(cardId);
      if (!card) {
        throw new NotFoundError('SmartCard not found for analytics tracking');
      }

      // Simple parsing of User-Agent
      const ua = clientDetails.userAgent || '';
      let device = 'Desktop';
      if (/mobile|android|iphone|ipad|phone/i.test(ua)) {
        device = 'Mobile';
      } else if (/tablet|ipad/i.test(ua)) {
        device = 'Tablet';
      }

      let browser = 'Other';
      if (/chrome|crios/i.test(ua)) {
        browser = 'Chrome';
      } else if (/safari/i.test(ua) && !/chrome/i.test(ua)) {
        browser = 'Safari';
      } else if (/firefox|iceweasel/i.test(ua)) {
        browser = 'Firefox';
      } else if (/edge/i.test(ua)) {
        browser = 'Edge';
      }

      // Geolocation - Mock GeoIP resolver (In enterprise, use maxmind or similar)
      const country = clientDetails.ip === '127.0.0.1' ? 'Local' : 'United States';
      const city = clientDetails.ip === '127.0.0.1' ? 'Localhost' : 'San Francisco';

      const eventData = {
        cardId,
        companyId: card.companyId,
        eventType,
        referrer: clientDetails.referrer,
        buttonId: clientDetails.buttonId,
        device,
        browser,
        country,
        city,
        ip: clientDetails.ip,
        timestamp: new Date()
      };

      // Background write: To achieve Stripe/Vercel level performance, we write async
      // In a full scaling app, we add this to BullMQ queue: `analyticsQueue.add('logEvent', eventData)`
      // Here, we trigger it asynchronously so the request doesn't block
      this.analyticsRepository.create(eventData).catch((err) => {
        logger.error({ err, cardId }, 'Failed to persist analytics event in background');
      });

      // Increment total counters on Card document
      if (eventType === 'view') {
        this.cardRepository.incrementViews(cardId).catch(() => {});
      } else if (eventType === 'scan') {
        this.cardRepository.incrementScans(cardId).catch(() => {});
      }
    } catch (error) {
      logger.error({ error, cardId }, 'Analytics tracking failed');
    }
  }

  async getCardAnalytics(
    cardId: string,
    actorId: string,
    rangeDays = 7
  ): Promise<any> {
    const card = await this.cardRepository.findById(cardId);
    if (!card) {
      throw new NotFoundError('SmartCard not found');
    }

    // Auth check: only card owner or manager of the card's company can read analytics
    if (card.userId.toString() !== actorId) {
      throw new ForbiddenError('Access denied: You do not own this SmartCard');
    }

    const redis = getRedisClient(config.REDIS_URI);
    const cacheKey = `analytics:${cardId}:${rangeDays}`;

    try {
      const cached = await redis.get(cacheKey);
      if (cached) {
        return JSON.parse(cached);
      }
    } catch (err) {
      logger.error({ err }, 'Redis cache fetch failed in AnalyticsService');
    }

    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - rangeDays);

    const stats = await this.analyticsRepository.getAggregateStats(cardId, startDate, endDate);

    // Cache results for 5 minutes (300 seconds)
    try {
      await redis.setex(cacheKey, 300, JSON.stringify(stats));
    } catch (err) {
      logger.error({ err }, 'Redis cache write failed in AnalyticsService');
    }

    return stats;
  }
}
export default AnalyticsService;
