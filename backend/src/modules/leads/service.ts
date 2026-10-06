import LeadRepository from './repository';
import { CardRepository } from '../cards/repository';
import NotificationService from '../notifications/service';
import { ILeadDocument } from './model';
import { NotFoundError } from '../../errors/AppError';
import logger from '../../lib/logger';

export class LeadService {
  private leadRepository: LeadRepository;
  private cardRepository: CardRepository;
  private notificationService: NotificationService;

  constructor(
    leadRepository = new LeadRepository(),
    cardRepository = new CardRepository(),
    notificationService = new NotificationService()
  ) {
    this.leadRepository = leadRepository;
    this.cardRepository = cardRepository;
    this.notificationService = notificationService;
  }

  async createLead(leadData: any): Promise<ILeadDocument> {
    const card = await this.cardRepository.findById(leadData.cardId);
    if (!card) {
      throw new NotFoundError('SmartCard not found');
    }

    const lead = await this.leadRepository.create(leadData);
    logger.info({ leadId: lead.id, cardId: leadData.cardId }, 'New lead captured successfully');

    // Trigger notification to card owner
    try {
      await this.notificationService.createNotification({
        userId: card.userId.toString(),
        type: 'lead',
        title: 'New Lead Captured',
        description: `${lead.name} left their contact info on your card "${card.name}".${lead.eventTag ? ` Event: ${lead.eventTag}` : ''}`
      });
    } catch (err) {
      logger.error({ err }, 'Failed to trigger notification for captured lead');
    }

    return lead;
  }

  async getLeadsByUser(userId: string): Promise<ILeadDocument[]> {
    const cards = await this.cardRepository.findByUser(userId);
    const cardIds = cards.map(c => c.id);
    if (cardIds.length === 0) return [];
    return this.leadRepository.findByCardIds(cardIds);
  }
}
export default LeadService;
