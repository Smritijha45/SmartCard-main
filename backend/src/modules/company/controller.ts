import { Request, Response, NextFunction } from 'express';
import CompanyService from './service';

export class CompanyController {
  private companyService: CompanyService;

  constructor(companyService = new CompanyService()) {
    this.companyService = companyService;
  }

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

  addMember = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const companyId = req.user!.companyId;
      const actorId = req.user!.id;

      if (!companyId) {
        res.status(400).json({ success: false, message: 'You do not belong to a company workspace' });
        return;
      }

      const member = await this.companyService.addTeamMember(companyId.toString(), actorId, req.body);

      res.status(200).json({
        success: true,
        message: 'Team member associated successfully',
        data: member
      });
    } catch (error) {
      next(error);
    }
  };

  removeMember = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const companyId = req.user!.companyId;
      const actorId = req.user!.id;
      const { id: memberUserId } = req.params;

      if (!companyId) {
        res.status(400).json({ success: false, message: 'You do not belong to a company workspace' });
        return;
      }

      await this.companyService.removeTeamMember(companyId.toString(), actorId, memberUserId);

      res.status(200).json({
        success: true,
        message: 'Team member removed from workspace'
      });
    } catch (error) {
      next(error);
    }
  };

  getMembers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const companyId = req.user!.companyId;

      if (!companyId) {
        res.status(200).json({ success: true, data: [] });
        return;
      }

      const members = await this.companyService.getTeamMembers(companyId.toString());

      res.status(200).json({
        success: true,
        data: members
      });
    } catch (error) {
      next(error);
    }
  };
}
export default CompanyController;
