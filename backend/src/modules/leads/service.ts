import LeadRepository, { LeadFilterOptions, PaginatedLeadsResult } from './repository';
import { CardRepository } from '../cards/repository';
import { UserRepository } from '../users/repository';
import NotificationService from '../notifications/service';
import { ILeadDocument, LeadStatus } from './model';
import { NotFoundError, ForbiddenError } from '../../errors/AppError';
import logger from '../../lib/logger';

export class LeadService {
  private leadRepository: LeadRepository;
  private cardRepository: CardRepository;
  private userRepository: UserRepository;
  private notificationService: NotificationService;

  constructor(
    leadRepository = new LeadRepository(),
    cardRepository = new CardRepository(),
    userRepository = new UserRepository(),
    notificationService = new NotificationService()
  ) {
    this.leadRepository = leadRepository;
    this.cardRepository = cardRepository;
    this.userRepository = userRepository;
    this.notificationService = notificationService;
  }

  async createLead(leadData: any): Promise<ILeadDocument> {
    const card = await this.cardRepository.findById(leadData.cardId);
    if (!card) {
      throw new NotFoundError('SmartCard not found');
    }

    const payload = {
      ...leadData,
      userId: card.userId,
      companyId: card.companyId,
      status: leadData.status || 'New',
      source: leadData.source || 'public_card',
      score: leadData.score || Math.floor(70 + Math.random() * 25),
    };

    const lead = await this.leadRepository.create(payload);
    logger.info({ leadId: lead.id, cardId: leadData.cardId }, 'New lead captured successfully');

    // Trigger notification to card owner
    try {
      await this.notificationService.createNotification({
        userId: card.userId.toString(),
        type: 'lead',
        title: 'New Lead Captured!',
        description: `${lead.name} left their contact info on your card "${card.name}".${lead.eventTag ? ` Event: ${lead.eventTag}` : ''}`
      });
    } catch (err) {
      logger.error({ err }, 'Failed to trigger notification for captured lead');
    }

    return lead;
  }

  async getFilteredLeads(options: LeadFilterOptions): Promise<PaginatedLeadsResult> {
    return this.leadRepository.findFiltered(options);
  }

  async getLeadsByUser(userId: string): Promise<ILeadDocument[]> {
    const cards = await this.cardRepository.findByUser(userId);
    const cardIds = cards.map(c => c.id);
    if (cardIds.length === 0) return [];
    return this.leadRepository.findByCardIds(cardIds);
  }

  async updateLeadStatus(leadId: string, status: LeadStatus, actorId: string): Promise<ILeadDocument> {
    const lead = await this.leadRepository.findById(leadId);
    if (!lead) {
      throw new NotFoundError('Lead not found');
    }

    // Ownership or workspace check
    const user = await this.userRepository.findById(actorId);
    const isOwner = lead.userId.toString() === actorId;
    const isOrgAdmin = user?.companyId && lead.companyId && user.companyId.toString() === lead.companyId.toString();

    if (!isOwner && !isOrgAdmin) {
      throw new ForbiddenError('You do not have permission to manage this lead');
    }

    const updated = await this.leadRepository.update(leadId, { $set: { status } });
    if (!updated) {
      throw new NotFoundError('Failed to update lead');
    }

    return updated;
  }

  async updateLead(leadId: string, updateData: any, actorId: string): Promise<ILeadDocument> {
    const lead = await this.leadRepository.findById(leadId);
    if (!lead) {
      throw new NotFoundError('Lead not found');
    }

    const user = await this.userRepository.findById(actorId);
    const isOwner = lead.userId.toString() === actorId;
    const isOrgAdmin = user?.companyId && lead.companyId && user.companyId.toString() === lead.companyId.toString();

    if (!isOwner && !isOrgAdmin) {
      throw new ForbiddenError('You do not have permission to manage this lead');
    }

    const updated = await this.leadRepository.update(leadId, { $set: updateData });
    if (!updated) {
      throw new NotFoundError('Failed to update lead');
    }

    return updated;
  }

  async deleteLead(leadId: string, actorId: string): Promise<void> {
    const lead = await this.leadRepository.findById(leadId);
    if (!lead) {
      throw new NotFoundError('Lead not found');
    }

    const user = await this.userRepository.findById(actorId);
    const isOwner = lead.userId.toString() === actorId;
    const isOrgAdmin = user?.companyId && lead.companyId && user.companyId.toString() === lead.companyId.toString();

    if (!isOwner && !isOrgAdmin) {
      throw new ForbiddenError('You do not have permission to delete this lead');
    }

    await this.leadRepository.hardDelete(leadId);
  }

  async exportLeads(options: LeadFilterOptions, format: 'csv' | 'json'): Promise<{ data: string; contentType: string; filename: string }> {
    // Fetch all matching records without pagination limit for export
    const result = await this.leadRepository.findFiltered({ ...options, page: 1, limit: 10000 });
    const leads = result.leads;

    if (format === 'json') {
      return {
        data: JSON.stringify(leads, null, 2),
        contentType: 'application/json',
        filename: `smartcard-leads-${Date.now()}.json`
      };
    }

    // CSV format
    const headers = ['ID', 'Name', 'Email', 'Phone', 'Company', 'Role', 'Status', 'Score', 'EventTag', 'Source', 'DateCreated'];
    const rows = leads.map(l => [
      `"${l.id}"`,
      `"${(l.name || '').replace(/"/g, '""')}"`,
      `"${(l.email || '').replace(/"/g, '""')}"`,
      `"${(l.phone || '').replace(/"/g, '""')}"`,
      `"${(l.company || '').replace(/"/g, '""')}"`,
      `"${(l.role || '').replace(/"/g, '""')}"`,
      `"${l.status}"`,
      l.score || 0,
      `"${(l.eventTag || '').replace(/"/g, '""')}"`,
      `"${(l.source || '').replace(/"/g, '""')}"`,
      `"${l.createdAt.toISOString()}"`
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    return {
      data: csvContent,
      contentType: 'text/csv',
      filename: `smartcard-leads-${Date.now()}.csv`
    };
  }
}
export default LeadService;
