import { Request, Response, NextFunction } from 'express';
import CompanyService from './service';

export class CompanyController {
  private companyService: CompanyService;

  constructor(companyService = new CompanyService()) {
    this.companyService = companyService;
  }

  getWorkspace = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const companyId = req.user?.companyId;
      if (!companyId) {
        res.status(200).json({ success: true, data: null });
        return;
      }
      const details = await this.companyService.getCompanyDetails(companyId.toString());
      res.status(200).json({ success: true, data: details });
    } catch (error) {
      next(error);
    }
  };

  create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const ownerId = req.user!.id;
      const company = await this.companyService.createCompany(ownerId, req.body);
      res.status(201).json({
        success: true,
        message: 'Company workspace provisioned successfully',
        data: company
      });
    } catch (error) {
      next(error);
    }
  };

  updateBranding = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const companyId = req.user?.companyId;
      if (!companyId) {
        res.status(400).json({ success: false, message: 'You do not belong to an organization workspace' });
        return;
      }
      const details = await this.companyService.updateBranding(companyId.toString(), req.user!.id, req.body);
      res.status(200).json({ success: true, message: 'Branding updated successfully', data: details });
    } catch (error) {
      next(error);
    }
  };

  getMembers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const companyId = req.user?.companyId;
      if (!companyId) {
        res.status(200).json({ success: true, data: [] });
        return;
      }
      const members = await this.companyService.getTeamMembers(companyId.toString());
      res.status(200).json({ success: true, data: members });
    } catch (error) {
      next(error);
    }
  };

  updateMemberRole = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const companyId = req.user?.companyId;
      if (!companyId) {
        res.status(400).json({ success: false, message: 'You do not belong to an organization workspace' });
        return;
      }
      const { id: memberUserId } = req.params;
      const { role } = req.body;
      await this.companyService.updateMemberRole(companyId.toString(), req.user!.id, memberUserId, role);
      res.status(200).json({ success: true, message: 'Member role updated successfully' });
    } catch (error) {
      next(error);
    }
  };

  removeMember = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const companyId = req.user?.companyId;
      if (!companyId) {
        res.status(400).json({ success: false, message: 'You do not belong to an organization workspace' });
        return;
      }
      const { id: memberUserId } = req.params;
      await this.companyService.removeTeamMember(companyId.toString(), req.user!.id, memberUserId);
      res.status(200).json({ success: true, message: 'Team member removed from workspace' });
    } catch (error) {
      next(error);
    }
  };

  sendInvitation = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const companyId = req.user?.companyId;
      if (!companyId) {
        res.status(400).json({ success: false, message: 'You do not belong to an organization workspace' });
        return;
      }
      const invite = await this.companyService.sendInvitation(companyId.toString(), req.user!.id, req.body);
      res.status(201).json({ success: true, message: 'Invitation sent successfully', data: invite });
    } catch (error) {
      next(error);
    }
  };

  getInvitations = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const companyId = req.user?.companyId;
      if (!companyId) {
        res.status(200).json({ success: true, data: [] });
        return;
      }
      const invites = await this.companyService.getInvitations(companyId.toString());
      res.status(200).json({ success: true, data: invites });
    } catch (error) {
      next(error);
    }
  };

  acceptInvitation = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { token } = req.params;
      const userId = req.user!.id;
      await this.companyService.acceptInvitation(token, userId);
      res.status(200).json({ success: true, message: 'Successfully joined organization workspace' });
    } catch (error) {
      next(error);
    }
  };

  rejectInvitation = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { token } = req.params;
      const userId = req.user?.id;
      await this.companyService.rejectInvitation(token, userId);
      res.status(200).json({ success: true, message: 'Invitation declined' });
    } catch (error) {
      next(error);
    }
  };

  revokeInvitation = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const companyId = req.user?.companyId;
      if (!companyId) {
        res.status(400).json({ success: false, message: 'You do not belong to an organization workspace' });
        return;
      }
      const { id } = req.params;
      await this.companyService.revokeInvitation(companyId.toString(), req.user!.id, id);
      res.status(200).json({ success: true, message: 'Invitation revoked' });
    } catch (error) {
      next(error);
    }
  };

  getCards = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const companyId = req.user?.companyId;
      if (!companyId) {
        res.status(200).json({ success: true, data: [] });
        return;
      }
      const cards = await this.companyService.getOrganizationCards(companyId.toString());
      res.status(200).json({ success: true, data: cards });
    } catch (error) {
      next(error);
    }
  };

  setCardSuspension = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const companyId = req.user?.companyId;
      if (!companyId) {
        res.status(400).json({ success: false, message: 'You do not belong to an organization workspace' });
        return;
      }
      const { id } = req.params;
      const { isSuspended } = req.body;
      await this.companyService.setMemberCardSuspension(companyId.toString(), req.user!.id, id, !!isSuspended);
      res.status(200).json({ success: true, message: `Card ${isSuspended ? 'suspended' : 'activated'} successfully` });
    } catch (error) {
      next(error);
    }
  };

  configureDomain = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const companyId = req.user?.companyId;
      if (!companyId) {
        res.status(400).json({ success: false, message: 'You do not belong to an organization workspace' });
        return;
      }
      const { domain } = req.body;
      const result = await this.companyService.configureCustomDomain(companyId.toString(), req.user!.id, domain);
      res.status(200).json({ success: true, message: 'Custom domain configured. Please complete DNS verification.', data: result });
    } catch (error) {
      next(error);
    }
  };

  verifyDomain = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const companyId = req.user?.companyId;
      if (!companyId) {
        res.status(400).json({ success: false, message: 'You do not belong to an organization workspace' });
        return;
      }
      const result = await this.companyService.verifyCustomDomain(companyId.toString(), req.user!.id);
      res.status(200).json({
        success: result.verified,
        message: result.verified ? 'Custom domain verified and active!' : 'DNS verification pending or failed',
        data: result
      });
    } catch (error) {
      next(error);
    }
  };

  removeDomain = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const companyId = req.user?.companyId;
      if (!companyId) {
        res.status(400).json({ success: false, message: 'You do not belong to an organization workspace' });
        return;
      }
      await this.companyService.removeCustomDomain(companyId.toString(), req.user!.id);
      res.status(200).json({ success: true, message: 'Custom domain removed' });
    } catch (error) {
      next(error);
    }
  };

  validateSSO = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const validation = this.companyService.validateSSOConfig(req.body);
      res.status(200).json({ success: validation.valid, data: validation });
    } catch (error) {
      next(error);
    }
  };

  updateSSO = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const companyId = req.user?.companyId;
      if (!companyId) {
        res.status(400).json({ success: false, message: 'You do not belong to an organization workspace' });
        return;
      }
      const config = await this.companyService.updateSSOConfig(companyId.toString(), req.user!.id, req.body);
      res.status(200).json({ success: true, message: 'SSO configuration updated', data: config });
    } catch (error) {
      next(error);
    }
  };

  getAuditLogs = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const companyId = req.user?.companyId;
      if (!companyId) {
        res.status(200).json({ success: true, data: [], meta: { total: 0 } });
        return;
      }
      const { page = '1', limit = '50' } = req.query;
      const result = await this.companyService.getAuditLogs(companyId.toString(), parseInt(page as string, 10), parseInt(limit as string, 10));
      res.status(200).json({ success: true, data: result.logs, meta: { total: result.total } });
    } catch (error) {
      next(error);
    }
  };

  createSupportTicket = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const companyId = req.user?.companyId?.toString();
      const userId = req.user!.id;
      const ticket = await this.companyService.createSupportTicket(companyId, userId, req.body);
      res.status(201).json({ success: true, message: 'Support ticket submitted successfully', data: ticket });
    } catch (error) {
      next(error);
    }
  };

  getSupportTickets = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const companyId = req.user?.companyId?.toString();
      const userId = req.user!.id;
      const tickets = await this.companyService.getSupportTickets(companyId, userId);
      res.status(200).json({ success: true, data: tickets });
    } catch (error) {
      next(error);
    }
  };

  addSupportMessage = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const userId = req.user!.id;
      const { message } = req.body;
      const ticket = await this.companyService.addSupportMessage(id, userId, message);
      res.status(200).json({ success: true, message: 'Message added to ticket', data: ticket });
    } catch (error) {
      next(error);
    }
  };

  exportReport = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const companyId = req.user?.companyId;
      if (!companyId) {
        res.status(400).json({ success: false, message: 'You do not belong to an organization workspace' });
        return;
      }
      const { format = 'csv' } = req.query;
      const exportResult = await this.companyService.exportTeamReport(companyId.toString(), format === 'json' ? 'json' : 'csv');
      res.setHeader('Content-Type', exportResult.contentType);
      res.setHeader('Content-Disposition', `attachment; filename="${exportResult.filename}"`);
      res.status(200).send(exportResult.data);
    } catch (error) {
      next(error);
    }
  };
}
export default CompanyController;
