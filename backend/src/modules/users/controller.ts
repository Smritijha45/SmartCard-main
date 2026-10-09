import { Request, Response, NextFunction } from 'express';
import UserService from './service';

export class UserController {
  private userService: UserService;

  constructor(userService = new UserService()) {
    this.userService = userService;
  }

  getProfile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user!.id;
      const profile = await this.userService.getUserProfile(userId);

      res.status(200).json({
        success: true,
        data: profile
      });
    } catch (error) {
      next(error);
    }
  };

  updateProfile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user!.id;
      const updated = await this.userService.updateUserProfile(userId, req.body);

      res.status(200).json({
        success: true,
        message: 'Profile updated successfully',
        data: updated
      });
    } catch (error) {
      next(error);
    }
  };

  updatePlan = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user!.id;
      const { plan } = req.body;
      const updated = await this.userService.updateSubscriptionPlan(userId, plan);

      res.status(200).json({
        success: true,
        message: `Plan upgraded to ${updated.planConfig.name}`,
        data: updated
      });
    } catch (error) {
      next(error);
    }
  };

  purchase24hPass = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user!.id;
      const updated = await this.userService.purchase24hPass(userId);

      res.status(200).json({
        success: true,
        message: '₹20 24-Hour Introductory Professional Pass activated successfully!',
        data: updated
      });
    } catch (error) {
      next(error);
    }
  };

  changePassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user!.id;
      await this.userService.changePassword(userId, req.body);

      res.status(200).json({
        success: true,
        message: 'Password changed successfully'
      });
    } catch (error) {
      next(error);
    }
  };

  changeUserRole = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const actorRole = req.user!.role;
      const { id: targetUserId } = req.params;
      const { role: newRole } = req.body;

      const updated = await this.userService.updateRole(actorRole, targetUserId, newRole);

      res.status(200).json({
        success: true,
        message: 'User role updated successfully',
        data: updated
      });
    } catch (error) {
      next(error);
    }
  };
}
export default UserController;
