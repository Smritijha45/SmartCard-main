import { Request, Response, NextFunction } from 'express';
import AnalyticsService from './service';

export class AnalyticsController {
  private analyticsService: AnalyticsService;

  constructor(analyticsService = new AnalyticsService()) {
    this.analyticsService = analyticsService;
  }

  track = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { cardId, eventType, referrer, buttonId } = req.body;
      const clientDetails = {
        ip: req.ip,
        userAgent: req.headers['user-agent'],
        referrer: referrer || req.headers.referer,
        buttonId
      };

      // Execute asynchronously, don't await!
      // This allows immediate response to the tracker client
      this.analyticsService.track(cardId, eventType, clientDetails);

      res.status(202).json({
        success: true,
        message: 'Event accepted for processing'
      });
    } catch (error) {
      next(error);
    }
  };

  getStats = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const actorId = req.user!.id;
      const cardId = req.query.cardId as string;
      const rangeDays = parseInt(req.query.rangeDays as string || '7', 10);

      const stats = await this.analyticsService.getCardAnalytics(cardId, actorId, rangeDays);

      res.status(200).json({
        success: true,
        data: stats
      });
    } catch (error) {
      next(error);
    }
  };
}
export default AnalyticsController;
