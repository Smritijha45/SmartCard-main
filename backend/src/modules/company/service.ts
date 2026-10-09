import crypto from 'crypto';
import dns from 'dns';
import { CompanyRepository } from './repository';
import { UserRepository } from '../users/repository';
import { CardRepository } from '../cards/repository';
import { CardModel } from '../cards/model';
import LeadRepository from '../leads/repository';
import { InvitationModel } from './invitationModel';
import { AuditLogModel } from './auditLogModel';
import { SupportTicketModel } from './supportTicketModel';
import {
  CompanyResponseDTO,
  toCompanyResponseDTO,
  TeamMemberDTO,
  InvitationDTO,
  AuditLogDTO,
  SupportTicketDTO
} from './types';
import { NotFoundError, BadRequestError, ConflictError, ForbiddenError } from '../../errors/AppError';
import { UserRole } from '../../constants/roles';
import { getPlanConfig } from '../../config/plans';
import logger from '../../lib/logger';

export class CompanyService {
  private companyRepository: CompanyRepository;
  private userRepository: UserRepository;
  private cardRepository: CardRepository;
  private leadRepository: LeadRepository;

  constructor(
    companyRepository = new CompanyRepository(),
    userRepository = new UserRepository(),
    cardRepository = new CardRepository(),
    leadRepository = new LeadRepository()
  ) {
    this.companyRepository = companyRepository;
    this.userRepository = userRepository;
    this.cardRepository = cardRepository;
    this.leadRepository = leadRepository;
  }

  private async recordAudit(
    companyId: string,
    actorId: string,
    action: string,
    entityType: 'user' | 'card' | 'domain' | 'sso' | 'branding' | 'workspace' | 'lead' | 'ticket',
    details: Record<string, any> = {},
    entityId?: string,
    ip?: string,
    userAgent?: string
  ): Promise<void> {
    try {
      const actor = await this.userRepository.findById(actorId);
      await AuditLogModel.create({
        companyId,
        actorId,
        actorEmail: actor?.email || 'system@smartcard.app',
        actorName: actor?.name || 'Workspace Administrator',
        action,
        entityType,
        entityId,
        details,
        ip,
        userAgent,
        timestamp: new Date()
      });
    } catch (err) {
      logger.error({ err }, 'Failed to write audit log');
    }
  }

  async createCompany(ownerId: string, companyData: { name: string; domain?: string }): Promise<CompanyResponseDTO> {
    const user = await this.userRepository.findById(ownerId);
    if (!user) {
      throw new NotFoundError('Owner user profile not found');
    }

    if (user.companyId) {
      throw new BadRequestError('User is already associated with a company workspace');
    }

    if (companyData.domain) {
      const existingDomain = await this.companyRepository.findByDomain(companyData.domain);
      if (existingDomain) {
        throw new ConflictError('Company domain is already registered');
      }
    }

    const planConfig = getPlanConfig('enterprise');

    const company = await this.companyRepository.create({
      name: companyData.name,
      domain: companyData.domain,
      ownerId: ownerId,
      subscriptionPlan: 'enterprise',
      memberLimit: planConfig.limits.maxTeamMembers,
      cardLimit: planConfig.limits.maxActiveCards,
      isSuspended: false,
      branding: {
        logoUrl: '',
        primaryColor: '#2563EB',
        secondaryColor: '#1E293B',
        badgeText: `${companyData.name} Team Member`,
        hidePlatformBadge: false,
        cardTheme: 'executive-dark'
      },
      ssoConfig: {
        enabled: false,
        provider: 'google',
        status: 'unconfigured'
      }
    });

    // Upgrade owner to Enterprise plan and OWNER role
    await this.userRepository.update(ownerId, {
      $set: {
        companyId: company.id,
        role: UserRole.OWNER,
        subscriptionPlan: 'enterprise'
      }
    });

    await this.recordAudit(company.id, ownerId, 'WORKSPACE_CREATED', 'workspace', {
      name: companyData.name,
      domain: companyData.domain
    });

    return toCompanyResponseDTO(company, 1, 0);
  }

  async getCompanyDetails(companyId: string): Promise<CompanyResponseDTO> {
    const company = await this.companyRepository.findById(companyId);
    if (!company) {
      throw new NotFoundError('Company workspace not found');
    }

    const [membersCount, cardsCount] = await Promise.all([
      this.userRepository.find({ companyId, deletedAt: null }),
      this.cardRepository.find({ companyId, deletedAt: null })
    ]);

    return toCompanyResponseDTO(company, membersCount.length, cardsCount.length);
  }

  async updateBranding(companyId: string, actorId: string, brandingData: any): Promise<CompanyResponseDTO> {
    const company = await this.companyRepository.findById(companyId);
    if (!company) {
      throw new NotFoundError('Company workspace not found');
    }

    const updated = await this.companyRepository.update(companyId, {
      $set: {
        branding: {
          ...company.branding,
          ...brandingData
        }
      }
    });

    if (!updated) {
      throw new NotFoundError('Failed to update branding');
    }

    await this.recordAudit(companyId, actorId, 'BRANDING_UPDATED', 'branding', brandingData);
    return this.getCompanyDetails(companyId);
  }

  async sendInvitation(companyId: string, actorId: string, data: { email: string; role: UserRole }): Promise<InvitationDTO> {
    const company = await this.companyRepository.findById(companyId);
    if (!company) {
      throw new NotFoundError('Company workspace not found');
    }

    // Check member limits
    const currentMembers = await this.userRepository.find({ companyId, deletedAt: null });
    const pendingInvites = await InvitationModel.countDocuments({ companyId, status: 'pending' });
    const totalActiveSeats = currentMembers.length + pendingInvites;

    if (totalActiveSeats >= company.memberLimit) {
      throw new ForbiddenError(
        `Workspace seat limit reached (${company.memberLimit} active members/invites). Please upgrade limit or revoke pending invites.`
      );
    }

    const email = data.email.toLowerCase().trim();

    // Check if user is already a member
    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser && existingUser.companyId?.toString() === companyId) {
      throw new BadRequestError('User is already a member of this workspace');
    }

    // Check existing pending invitation
    const existingInvite = await InvitationModel.findOne({ companyId, email, status: 'pending' });
    if (existingInvite) {
      throw new BadRequestError('An active invitation has already been sent to this email');
    }

    const token = `inv_${crypto.randomBytes(24).toString('hex')}`;
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    const invite = await InvitationModel.create({
      companyId,
      email,
      role: data.role || UserRole.EMPLOYEE,
      token,
      status: 'pending',
      invitedBy: actorId,
      expiresAt
    });

    await this.recordAudit(companyId, actorId, 'INVITATION_SENT', 'user', {
      email,
      role: data.role
    }, invite.id);

    return {
      id: invite.id,
      email: invite.email,
      role: invite.role,
      token: invite.token,
      status: invite.status,
      expiresAt: invite.expiresAt.toISOString(),
      createdAt: invite.createdAt.toISOString()
    };
  }

  async getInvitations(companyId: string): Promise<InvitationDTO[]> {
    const invites = await InvitationModel.find({ companyId }).sort({ createdAt: -1 });
    return invites.map((inv) => ({
      id: inv.id,
      email: inv.email,
      role: inv.role,
      token: inv.token,
      status: inv.status,
      expiresAt: inv.expiresAt.toISOString(),
      createdAt: inv.createdAt.toISOString()
    }));
  }

  async acceptInvitation(token: string, userId: string): Promise<void> {
    const invite = await InvitationModel.findOne({ token, status: 'pending' });
    if (!invite) {
      throw new NotFoundError('Invalid or expired invitation link');
    }

    if (new Date() > invite.expiresAt) {
      invite.status = 'expired';
      await invite.save();
      throw new BadRequestError('This invitation has expired. Please ask your administrator for a new invite.');
    }

    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundError('User profile not found');
    }

    // Associate user with workspace
    await this.userRepository.update(userId, {
      $set: {
        companyId: invite.companyId,
        role: invite.role,
        subscriptionPlan: 'enterprise'
      }
    });

    invite.status = 'accepted';
    invite.acceptedAt = new Date();
    await invite.save();

    await this.recordAudit(invite.companyId.toString(), userId, 'INVITATION_ACCEPTED', 'user', {
      email: user.email,
      role: invite.role
    });
  }

  async rejectInvitation(token: string, userId?: string): Promise<void> {
    const invite = await InvitationModel.findOne({ token, status: 'pending' });
    if (!invite) {
      throw new NotFoundError('Invalid or expired invitation link');
    }

    invite.status = 'rejected';
    invite.rejectedAt = new Date();
    await invite.save();

    if (userId) {
      await this.recordAudit(invite.companyId.toString(), userId, 'INVITATION_REJECTED', 'user', {
        email: invite.email
      });
    }
  }

  async revokeInvitation(companyId: string, actorId: string, invitationId: string): Promise<void> {
    const invite = await InvitationModel.findOne({ _id: invitationId, companyId });
    if (!invite) {
      throw new NotFoundError('Invitation not found');
    }

    invite.status = 'revoked';
    await invite.save();

    await this.recordAudit(companyId, actorId, 'INVITATION_REVOKED', 'user', {
      email: invite.email
    }, invitationId);
  }

  async getTeamMembers(companyId: string): Promise<TeamMemberDTO[]> {
    const members = await this.userRepository.find({ companyId, deletedAt: null });

    // Count cards for each member
    const cards = await this.cardRepository.find({ companyId, deletedAt: null });
    const cardCountMap: Record<string, number> = {};
    cards.forEach(c => {
      const uid = c.userId.toString();
      cardCountMap[uid] = (cardCountMap[uid] || 0) + 1;
    });

    return members.map((m) => ({
      id: m.id,
      name: m.name,
      email: m.email,
      role: m.role,
      profilePhoto: m.profilePhoto,
      cardCount: cardCountMap[m.id] || 0,
      isSuspended: m.isSuspended || false,
      joinedAt: m.createdAt ? m.createdAt.toISOString() : undefined
    }));
  }

  async updateMemberRole(companyId: string, actorId: string, memberUserId: string, newRole: UserRole): Promise<void> {
    const company = await this.companyRepository.findById(companyId);
    if (!company) {
      throw new NotFoundError('Company workspace not found');
    }

    const memberUser = await this.userRepository.findById(memberUserId);
    if (!memberUser || memberUser.companyId?.toString() !== companyId) {
      throw new NotFoundError('Member not found in this workspace');
    }

    if (memberUser.role === UserRole.OWNER && newRole !== UserRole.OWNER) {
      throw new BadRequestError('Cannot modify workspace Owner role. Transfer ownership first.');
    }

    await this.userRepository.update(memberUserId, {
      $set: { role: newRole }
    });

    await this.recordAudit(companyId, actorId, 'ROLE_UPDATED', 'user', {
      targetUserId: memberUserId,
      targetUserEmail: memberUser.email,
      previousRole: memberUser.role,
      newRole
    }, memberUserId);
  }

  async removeTeamMember(companyId: string, actorId: string, memberUserId: string): Promise<void> {
    const company = await this.companyRepository.findById(companyId);
    if (!company) {
      throw new NotFoundError('Company workspace not found');
    }

    const memberUser = await this.userRepository.findById(memberUserId);
    if (!memberUser || memberUser.companyId?.toString() !== companyId) {
      throw new NotFoundError('Member not found in this workspace');
    }

    if (memberUser.role === UserRole.OWNER) {
      throw new BadRequestError('Cannot remove workspace Owner');
    }

    // Disassociate cards from workspace
    await CardModel.updateMany(
      { userId: memberUserId, companyId },
      { $unset: { companyId: 1 } }
    );

    // Reset member
    await this.userRepository.update(memberUserId, {
      $unset: { companyId: 1 },
      $set: { role: UserRole.USER, subscriptionPlan: 'starter' }
    });

    await this.recordAudit(companyId, actorId, 'MEMBER_REMOVED', 'user', {
      removedEmail: memberUser.email,
      removedName: memberUser.name
    }, memberUserId);
  }

  async getOrganizationCards(companyId: string): Promise<any[]> {
    const cards = await this.cardRepository.find({ companyId, deletedAt: null });
    return cards.map(c => ({
      id: c._id.toString(),
      userId: c.userId.toString(),
      username: c.username,
      name: c.name,
      role: c.role || c.title,
      email: c.email,
      themeColor: c.themeColor,
      template: c.template,
      cardTheme: c.cardTheme,
      isSuspended: c.isSuspended || false,
      isPublic: c.isPublic,
      views: c.views || 0,
      scans: c.scans || 0,
      qrCodeUrl: c.qrCodeUrl,
      updatedAt: c.updatedAt
    }));
  }

  async setMemberCardSuspension(companyId: string, actorId: string, cardId: string, isSuspended: boolean): Promise<void> {
    const card = await this.cardRepository.findById(cardId);
    if (!card || card.companyId?.toString() !== companyId) {
      throw new NotFoundError('Card not found in this workspace');
    }

    await this.cardRepository.update(cardId, { $set: { isSuspended } });

    await this.recordAudit(companyId, actorId, isSuspended ? 'CARD_SUSPENDED' : 'CARD_ACTIVATED', 'card', {
      cardId,
      cardName: card.name,
      username: card.username
    }, cardId);
  }

  async configureCustomDomain(companyId: string, actorId: string, domainName: string): Promise<any> {
    const cleanDomain = domainName.toLowerCase().trim().replace(/^https?:\/\//, '').replace(/\/+$/, '');
    if (!cleanDomain || !/^[a-z0-9.-]+\.[a-z]{2,}$/.test(cleanDomain)) {
      throw new BadRequestError('Please provide a valid domain name (e.g. cards.yourcompany.com)');
    }

    const existing = await this.companyRepository.findOne({
      'customDomain.domain': cleanDomain,
      _id: { $ne: companyId }
    });
    if (existing) {
      throw new ConflictError('This custom domain is already registered by another organization');
    }

    const verificationToken = `sc_vtok_${crypto.randomBytes(16).toString('hex')}`;
    const targetRecord = `smartcard-site-verification=${verificationToken}`;
    const routingTarget = 'cname.smartcard.app';

    const customDomainConfig = {
      domain: cleanDomain,
      verificationToken,
      status: 'pending' as const,
      dnsType: 'TXT' as const,
      targetRecord,
      routingTarget,
      lastCheckedAt: new Date()
    };

    await this.companyRepository.update(companyId, {
      $set: {
        domain: cleanDomain,
        customDomain: customDomainConfig
      }
    });

    await this.recordAudit(companyId, actorId, 'DOMAIN_CONFIGURED', 'domain', {
      domain: cleanDomain,
      dnsType: 'TXT',
      targetRecord
    });

    return customDomainConfig;
  }

  async verifyCustomDomain(companyId: string, actorId: string): Promise<any> {
    const company = await this.companyRepository.findById(companyId);
    if (!company || !company.customDomain || !company.customDomain.domain) {
      throw new NotFoundError('No custom domain configured for this workspace');
    }

    const { domain, verificationToken, targetRecord } = company.customDomain;
    let verified = false;
    let verificationError: string | undefined;

    try {
      // Perform actual DNS TXT record lookup
      const records = await dns.promises.resolveTxt(domain);
      const flattened = records.map(r => r.join(''));
      const hasTxtToken = flattened.some(r => r.includes(verificationToken) || r.includes(targetRecord));

      if (hasTxtToken) {
        verified = true;
      } else {
        // Also check CNAME
        try {
          const cnames = await dns.promises.resolveCname(domain);
          if (cnames.some(c => c.includes('smartcard') || c.includes('smartcard.app'))) {
            verified = true;
          } else {
            verificationError = `TXT record "${targetRecord}" was not detected on DNS servers for ${domain}. Please verify your DNS provider configuration.`;
          }
        } catch {
          verificationError = `TXT record "${targetRecord}" was not detected on DNS servers for ${domain}. DNS records may take up to 24 hours to propagate.`;
        }
      }
    } catch (dnsErr: any) {
      verificationError = `DNS lookup failed for ${domain}: ${dnsErr.message || 'Record not found'}. Ensure TXT or CNAME record is added.`;
    }

    const status = verified ? 'verified' : 'failed';
    const updatePayload: any = {
      'customDomain.status': status,
      'customDomain.lastCheckedAt': new Date(),
    };

    if (verified) {
      updatePayload['customDomain.verifiedAt'] = new Date();
      updatePayload['customDomain.verificationError'] = undefined;
    } else {
      updatePayload['customDomain.verificationError'] = verificationError;
    }

    await this.companyRepository.update(companyId, { $set: updatePayload });

    await this.recordAudit(companyId, actorId, verified ? 'DOMAIN_VERIFIED' : 'DOMAIN_VERIFICATION_FAILED', 'domain', {
      domain,
      status,
      error: verificationError
    });

    return {
      domain,
      status,
      verified,
      error: verificationError,
      lastCheckedAt: new Date().toISOString()
    };
  }

  async removeCustomDomain(companyId: string, actorId: string): Promise<void> {
    await this.companyRepository.update(companyId, {
      $unset: { domain: 1, customDomain: 1 }
    });

    await this.recordAudit(companyId, actorId, 'DOMAIN_REMOVED', 'domain');
  }

  validateSSOConfig(ssoData: any): { valid: boolean; error?: string } {
    const { provider, clientId, clientSecret, issuerUrl, metadataUrl } = ssoData;
    if (!provider) {
      return { valid: false, error: 'Identity provider must be specified (google, azure, saml, or oidc)' };
    }

    if (provider === 'google') {
      if (!clientId || !clientId.endsWith('.apps.googleusercontent.com')) {
        return { valid: false, error: 'Google OAuth Client ID must end with .apps.googleusercontent.com' };
      }
      if (!clientSecret || clientSecret.length < 10) {
        return { valid: false, error: 'Valid Google OAuth Client Secret is required' };
      }
    } else if (provider === 'azure') {
      if (!issuerUrl || !issuerUrl.includes('login.microsoftonline.com')) {
        return { valid: false, error: 'Azure AD Issuer URL must contain login.microsoftonline.com/<Tenant-ID>' };
      }
      if (!clientId || clientId.length < 10) {
        return { valid: false, error: 'Valid Azure Application (Client) ID is required' };
      }
    } else if (provider === 'saml') {
      if (!metadataUrl && !issuerUrl) {
        return { valid: false, error: 'SAML 2.0 requires a valid IdP Metadata XML URL or Entity ID' };
      }
    } else if (provider === 'oidc') {
      if (!issuerUrl || !issuerUrl.startsWith('https://')) {
        return { valid: false, error: 'OIDC Discovery Issuer URL must begin with https://' };
      }
      if (!clientId) {
        return { valid: false, error: 'OIDC Client ID is required' };
      }
    }

    return { valid: true };
  }

  async updateSSOConfig(companyId: string, actorId: string, ssoData: any): Promise<any> {
    const validation = this.validateSSOConfig(ssoData);
    const status = validation.valid ? 'active' : 'invalid';

    const ssoConfig = {
      enabled: ssoData.enabled !== undefined ? ssoData.enabled : true,
      provider: ssoData.provider || 'google',
      clientId: ssoData.clientId,
      clientSecret: ssoData.clientSecret,
      issuerUrl: ssoData.issuerUrl,
      metadataUrl: ssoData.metadataUrl,
      domainHint: ssoData.domainHint,
      status,
      lastValidatedAt: new Date(),
      validationError: validation.error
    };

    await this.companyRepository.update(companyId, {
      $set: { ssoConfig }
    });

    await this.recordAudit(companyId, actorId, 'SSO_CONFIG_UPDATED', 'sso', {
      provider: ssoData.provider,
      status,
      validationError: validation.error
    });

    return ssoConfig;
  }

  async getAuditLogs(companyId: string, page = 1, limit = 50): Promise<{ logs: AuditLogDTO[]; total: number }> {
    const skip = (page - 1) * limit;
    const [logs, total] = await Promise.all([
      AuditLogModel.find({ companyId }).sort({ timestamp: -1 }).skip(skip).limit(limit).lean(),
      AuditLogModel.countDocuments({ companyId })
    ]);

    return {
      logs: logs.map(l => ({
        id: l._id.toString(),
        actorId: l.actorId.toString(),
        actorEmail: l.actorEmail,
        actorName: l.actorName,
        action: l.action,
        entityType: l.entityType,
        entityId: l.entityId,
        details: l.details,
        ip: l.ip,
        timestamp: l.timestamp.toISOString()
      })),
      total
    };
  }

  async createSupportTicket(
    companyId: string | undefined,
    userId: string,
    ticketData: { subject: string; category: any; priority: any; message: string }
  ): Promise<SupportTicketDTO> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundError('User profile not found');
    }

    const ticketNumber = `SC-TKT-${Math.floor(100000 + Math.random() * 900000)}`;

    const ticket = await SupportTicketModel.create({
      companyId: companyId || user.companyId,
      userId,
      userEmail: user.email,
      userName: user.name,
      ticketNumber,
      subject: ticketData.subject,
      category: ticketData.category || 'general',
      priority: ticketData.priority || 'medium',
      status: 'open',
      messages: [
        {
          senderId: userId,
          senderName: user.name,
          senderRole: user.role,
          message: ticketData.message,
          createdAt: new Date()
        }
      ]
    });

    if (companyId) {
      await this.recordAudit(companyId, userId, 'SUPPORT_TICKET_CREATED', 'ticket', {
        ticketNumber,
        subject: ticketData.subject,
        priority: ticketData.priority
      }, ticket.id);
    }

    return {
      id: ticket.id,
      ticketNumber: ticket.ticketNumber,
      subject: ticket.subject,
      category: ticket.category,
      priority: ticket.priority,
      status: ticket.status,
      userName: ticket.userName,
      userEmail: ticket.userEmail,
      messages: ticket.messages.map(m => ({
        id: (m as any)._id?.toString(),
        senderId: m.senderId.toString(),
        senderName: m.senderName,
        senderRole: m.senderRole,
        message: m.message,
        createdAt: m.createdAt.toISOString()
      })),
      createdAt: ticket.createdAt.toISOString(),
      updatedAt: ticket.updatedAt.toISOString()
    };
  }

  async getSupportTickets(companyId?: string, userId?: string): Promise<SupportTicketDTO[]> {
    const query: any = {};
    if (companyId) query.companyId = companyId;
    else if (userId) query.userId = userId;

    const tickets = await SupportTicketModel.find(query).sort({ createdAt: -1 });
    return tickets.map(t => ({
      id: t.id,
      ticketNumber: t.ticketNumber,
      subject: t.subject,
      category: t.category,
      priority: t.priority,
      status: t.status,
      userName: t.userName,
      userEmail: t.userEmail,
      messages: t.messages.map(m => ({
        id: (m as any)._id?.toString(),
        senderId: m.senderId.toString(),
        senderName: m.senderName,
        senderRole: m.senderRole,
        message: m.message,
        createdAt: m.createdAt.toISOString()
      })),
      createdAt: t.createdAt.toISOString(),
      updatedAt: t.updatedAt.toISOString()
    }));
  }

  async addSupportMessage(ticketId: string, userId: string, message: string): Promise<SupportTicketDTO> {
    const ticket = await SupportTicketModel.findById(ticketId);
    if (!ticket) {
      throw new NotFoundError('Support ticket not found');
    }

    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundError('User profile not found');
    }

    ticket.messages.push({
      senderId: userId as any,
      senderName: user.name,
      senderRole: user.role,
      message,
      createdAt: new Date()
    } as any);

    if (ticket.status === 'resolved' || ticket.status === 'closed') {
      ticket.status = 'in_progress';
    }

    await ticket.save();

    return {
      id: ticket.id,
      ticketNumber: ticket.ticketNumber,
      subject: ticket.subject,
      category: ticket.category,
      priority: ticket.priority,
      status: ticket.status,
      userName: ticket.userName,
      userEmail: ticket.userEmail,
      messages: ticket.messages.map(m => ({
        id: (m as any)._id?.toString(),
        senderId: m.senderId.toString(),
        senderName: m.senderName,
        senderRole: m.senderRole,
        message: m.message,
        createdAt: m.createdAt.toISOString()
      })),
      createdAt: ticket.createdAt.toISOString(),
      updatedAt: ticket.updatedAt.toISOString()
    };
  }

  async exportTeamReport(companyId: string, format: 'csv' | 'json'): Promise<{ data: string; contentType: string; filename: string }> {
    const [company, members, cards, leads] = await Promise.all([
      this.companyRepository.findById(companyId),
      this.userRepository.find({ companyId }),
      this.cardRepository.find({ companyId, deletedAt: null }),
      this.leadRepository.findFiltered({ companyId, page: 1, limit: 10000 })
    ]);

    if (!company) {
      throw new NotFoundError('Company workspace not found');
    }

    if (format === 'json') {
      const payload = {
        organization: {
          name: company.name,
          domain: company.domain,
          plan: company.subscriptionPlan,
          totalMembers: members.length,
          totalCards: cards.length,
          totalLeads: leads.total
        },
        members: members.map(m => ({ id: m.id, name: m.name, email: m.email, role: m.role })),
        cards: cards.map(c => ({ id: c.id, name: c.name, username: c.username, views: c.views, scans: c.scans })),
        leads: leads.leads
      };
      return {
        data: JSON.stringify(payload, null, 2),
        contentType: 'application/json',
        filename: `${company.name.toLowerCase().replace(/\s+/g, '-')}-team-report-${Date.now()}.json`
      };
    }

    // CSV format
    const rows = [
      `"Organization:","${company.name}"`,
      `"Total Members:","${members.length}"`,
      `"Total Active Cards:","${cards.length}"`,
      `"Total Leads Captured:","${leads.total}"`,
      '',
      '"--- TEAM MEMBERS ---"',
      '"ID","Name","Email","Role","JoinedDate"',
      ...members.map(m => `"${m.id}","${m.name}","${m.email}","${m.role}","${m.createdAt.toISOString()}"`),
      '',
      '"--- TEAM CARDS ---"',
      '"Card ID","Name","Username","Views","Scans","Public URL"',
      ...cards.map(c => `"${c.id}","${c.name}","${c.username}",${c.views || 0},${c.scans || 0},"${c.qrCodeUrl || ''}"`),
      '',
      '"--- CENTRALIZED LEADS ---"',
      '"Lead ID","Name","Email","Company","Status","Score","DateCreated"',
      ...leads.leads.map(l => `"${l.id}","${l.name}","${l.email || ''}","${l.company || ''}","${l.status}",${l.score || 0},"${l.createdAt.toISOString()}"`)
    ];

    return {
      data: rows.join('\n'),
      contentType: 'text/csv',
      filename: `${company.name.toLowerCase().replace(/\s+/g, '-')}-team-report-${Date.now()}.csv`
    };
  }
}
export default CompanyService;
