import { Request, Response, NextFunction } from 'express';
import LeadService from './service';

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
      const leads = await this.leadService.getLeadsByUser(userId);
      res.status(200).json(leads);
    } catch (error) {
      next(error);
    }
  };
}
export default LeadController;
