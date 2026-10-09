import { Request, Response, NextFunction } from 'express';
import LeadService from './service';
import { LeadStatus } from './model';

export class LeadController {
  private leadService: LeadService;

  constructor(leadService = new LeadService()) {
    this.leadService = leadService;
  }

  create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const lead = await this.leadService.createLead(req.body);
      res.status(201).json({
        success: true,
        message: 'Lead captured successfully',
        data: lead
      });
    } catch (error) {
      next(error);
    }
  };

  getMyLeads = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({ message: 'User not authenticated' });
        return;
      }

      const {
        status,
        search,
        startDate,
        endDate,
        cardId,
        companyId,
        page = '1',
        limit = '20'
      } = req.query;

      const cardIds = cardId ? [cardId as string] : undefined;

      const result = await this.leadService.getFilteredLeads({
        userId: companyId ? undefined : userId,
        companyId: companyId as string | undefined,
        cardIds,
        status: status as LeadStatus | undefined,
        search: search as string | undefined,
        startDate: startDate ? new Date(startDate as string) : undefined,
        endDate: endDate ? new Date(endDate as string) : undefined,
        page: parseInt(page as string, 10),
        limit: parseInt(limit as string, 10)
      });

      res.status(200).json({
        success: true,
        data: result.leads,
        meta: {
          total: result.total,
          page: result.page,
          totalPages: result.totalPages,
          statusCounts: result.statusCounts
        }
      });
    } catch (error) {
      next(error);
    }
  };

  updateStatus = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const userId = req.user!.id;

      const updated = await this.leadService.updateLeadStatus(id, status as LeadStatus, userId);
      res.status(200).json({
        success: true,
        message: 'Lead status updated successfully',
        data: updated
      });
    } catch (error) {
      next(error);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const userId = req.user!.id;

      const updated = await this.leadService.updateLead(id, req.body, userId);
      res.status(200).json({
        success: true,
        message: 'Lead updated successfully',
        data: updated
      });
    } catch (error) {
      next(error);
    }
  };

  delete = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const userId = req.user!.id;

      await this.leadService.deleteLead(id, userId);
      res.status(200).json({
        success: true,
        message: 'Lead deleted successfully'
      });
    } catch (error) {
      next(error);
    }
  };

  exportLeads = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({ message: 'User not authenticated' });
        return;
      }

      const {
        format = 'csv',
        status,
        search,
        startDate,
        endDate,
        cardId,
        companyId
      } = req.query;

      const cardIds = cardId ? [cardId as string] : undefined;

      const exportResult = await this.leadService.exportLeads({
        userId: companyId ? undefined : userId,
        companyId: companyId as string | undefined,
        cardIds,
        status: status as LeadStatus | undefined,
        search: search as string | undefined,
        startDate: startDate ? new Date(startDate as string) : undefined,
        endDate: endDate ? new Date(endDate as string) : undefined,
      }, format === 'json' ? 'json' : 'csv');

      res.setHeader('Content-Type', exportResult.contentType);
      res.setHeader('Content-Disposition', `attachment; filename="${exportResult.filename}"`);
      res.status(200).send(exportResult.data);
    } catch (error) {
      next(error);
    }
  };
}
export default LeadController;
