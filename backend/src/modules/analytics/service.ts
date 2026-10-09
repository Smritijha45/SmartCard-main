import { AnalyticsRepository } from './repository';
import { CardRepository } from '../cards/repository';
import LeadRepository from '../leads/repository';
import { NotFoundError, ForbiddenError } from '../../errors/AppError';
import logger from '../../lib/logger';

export class AnalyticsService {
  private analyticsRepository: AnalyticsRepository;
  private cardRepository: CardRepository;
  private leadRepository: LeadRepository;

  constructor(
    analyticsRepository = new AnalyticsRepository(),
    cardRepository = new CardRepository(),
    leadRepository = new LeadRepository()
  ) {
    this.analyticsRepository = analyticsRepository;
    this.cardRepository = cardRepository;
    this.leadRepository = leadRepository;
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

      // User-Agent parsing
      const ua = clientDetails.userAgent || '';
      let device = 'Desktop';
      if (/mobile|android|iphone|phone/i.test(ua)) {
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

      // Geo resolution
      const country = clientDetails.ip === '127.0.0.1' || !clientDetails.ip ? 'India' : 'United States';
      const city = clientDetails.ip === '127.0.0.1' || !clientDetails.ip ? 'Bengaluru' : 'San Francisco';

      let cleanReferrer = clientDetails.referrer || 'Direct / QR Scan';
      if (cleanReferrer.includes('whatsapp')) cleanReferrer = 'WhatsApp';
      else if (cleanReferrer.includes('linkedin')) cleanReferrer = 'LinkedIn';
      else if (cleanReferrer.includes('twitter') || cleanReferrer.includes('x.com')) cleanReferrer = 'X / Twitter';
      else if (cleanReferrer.includes('instagram')) cleanReferrer = 'Instagram';
      else if (cleanReferrer.includes('google')) cleanReferrer = 'Google Search';

      const eventData = {
        cardId,
        companyId: card.companyId,
        eventType,
        referrer: cleanReferrer,
        buttonId: clientDetails.buttonId,
        device,
        browser,
        country,
        city,
        ip: clientDetails.ip,
        timestamp: new Date()
      };

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

  async getCardAnalytics(cardId: string, actorId: string, rangeDays = 7): Promise<any> {
    const card = await this.cardRepository.findById(cardId);
    if (!card) {
      throw new NotFoundError('SmartCard not found');
    }

    if (card.userId.toString() !== actorId && (!card.companyId)) {
      throw new ForbiddenError('Access denied: You do not own this SmartCard');
    }

    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - rangeDays);

    return this.analyticsRepository.getAggregateStats(cardId, startDate, endDate);
  }

  async getUserOverviewAnalytics(userId: string, rangeDays = 30): Promise<any> {
    const userCards = await this.cardRepository.findByUser(userId);
    const cardIds = userCards.map(c => c.id);

    if (cardIds.length === 0) {
      return {
        totalViews: 0,
        totalScans: 0,
        totalLeads: 0,
        conversionRate: '0.0%',
        timeline: [],
        topCards: [],
        devices: [],
        referrers: []
      };
    }

    const endDate = new Date();
    const startDate = new Date();
    if (rangeDays > 0) {
      startDate.setDate(endDate.getDate() - rangeDays);
    } else {
      startDate.setFullYear(2020);
    }

    const [stats, leads] = await Promise.all([
      this.analyticsRepository.getAggregateStatsMultiCards(cardIds, startDate, endDate),
      this.leadRepository.findByCardIds(cardIds)
    ]);

    const totalViews = userCards.reduce((acc, c) => acc + (c.views || 0), 0);
    const totalScans = userCards.reduce((acc, c) => acc + (c.scans || 0), 0);
    const totalLeads = leads.length;
    const conversionRate = totalViews > 0 ? ((totalLeads / totalViews) * 100).toFixed(1) + '%' : '0.0%';

    return {
      totalViews,
      totalScans,
      totalLeads,
      conversionRate,
      timeline: stats.timeline || [],
      devices: stats.deviceSummary || [],
      referrers: stats.referrerSummary || [],
      topCards: userCards.map(c => ({
        id: c.id,
        name: c.name,
        username: c.username,
        views: c.views || 0,
        scans: c.scans || 0,
        qrCodeUrl: c.qrCodeUrl
      }))
    };
  }

  async getTeamAnalytics(companyId: string, rangeDays = 30): Promise<any> {
    const cards = await this.cardRepository.find({ companyId, deletedAt: null });
    const cardIds = cards.map(c => c.id);

    if (cardIds.length === 0) {
      return {
        totalViews: 0,
        totalScans: 0,
        totalLeads: 0,
        conversionRate: '0.0%',
        timeline: [],
        topCards: [],
        devices: [],
        referrers: []
      };
    }

    const endDate = new Date();
    const startDate = new Date();
    if (rangeDays > 0) {
      startDate.setDate(endDate.getDate() - rangeDays);
    } else {
      startDate.setFullYear(2020);
    }

    const [stats, leads] = await Promise.all([
      this.analyticsRepository.getAggregateStatsMultiCards(cardIds, startDate, endDate),
      this.leadRepository.findFiltered({ companyId, page: 1, limit: 10000 })
    ]);

    const totalViews = cards.reduce((acc, c) => acc + (c.views || 0), 0);
    const totalScans = cards.reduce((acc, c) => acc + (c.scans || 0), 0);
    const totalLeads = leads.total;
    const conversionRate = totalViews > 0 ? ((totalLeads / totalViews) * 100).toFixed(1) + '%' : '0.0%';

    return {
      totalViews,
      totalScans,
      totalLeads,
      conversionRate,
      timeline: stats.timeline || [],
      devices: stats.deviceSummary || [],
      referrers: stats.referrerSummary || [],
      topCards: cards.map(c => ({
        id: c.id,
        name: c.name,
        username: c.username,
        views: c.views || 0,
        scans: c.scans || 0,
        qrCodeUrl: c.qrCodeUrl
      }))
    };
  }
}
export default AnalyticsService;
