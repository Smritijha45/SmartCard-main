import { Request, Response, NextFunction } from 'express';
import NotificationService from './service';

export class NotificationController {
  private notificationService: NotificationService;

  constructor(notificationService = new NotificationService()) {
    this.notificationService = notificationService;
  }

  getNotifications = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user!.id;
      const notifications = await this.notificationService.getNotifications(userId);
      res.status(200).json({
        notifications
      });
    } catch (error) {
      next(error);
    }
  };

  markAllRead = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user!.id;
      const { action } = req.body;
      if (action === 'mark_all_read') {
        await this.notificationService.markAllAsRead(userId);
        res.status(200).json({
          success: true
        });
      } else {
        res.status(400).json({
          message: 'Invalid action'
        });
      }
    } catch (error) {
      next(error);
    }
  };
}

export default NotificationController;
