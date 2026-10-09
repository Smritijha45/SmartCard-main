import { Request, Response, NextFunction } from 'express';
import BillingService from './service';

export class BillingController {
  private billingService: BillingService;

  constructor(billingService = new BillingService()) {
    this.billingService = billingService;
  }

  getPlans = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data = await this.billingService.getPlans();
      res.status(200).json({
        success: true,
        data
      });
    } catch (error) {
      next(error);
    }
  };

  getSubscription = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user!.id;
      const data = await this.billingService.getSubscription(userId);
      res.status(200).json({
        success: true,
        data
      });
    } catch (error) {
      next(error);
    }
  };

  createIntroductoryOrder = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user!.id;
      const order = await this.billingService.createIntroductoryOrder(userId);
      res.status(200).json({
        success: true,
        message: 'Introductory 24-hour pass order generated',
        data: order
      });
    } catch (error) {
      next(error);
    }
  };

  verifyPayment = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user!.id;
      const verified = await this.billingService.verifyIntroductoryPayment(userId, req.body);
      res.status(200).json({
        success: true,
        message: 'Payment verified! ₹20 24-Hour Professional Pass is now active.',
        data: verified
      });
    } catch (error) {
      next(error);
    }
  };

  createSubscriptionOrder = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user!.id;
      const { plan } = req.body;
      const order = await this.billingService.createSubscriptionOrder(userId, plan);
      res.status(200).json({
        success: true,
        message: 'Subscription order created',
        data: order
      });
    } catch (error) {
      next(error);
    }
  };

  verifySubscription = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user!.id;
      const verified = await this.billingService.verifySubscriptionPayment(userId, req.body);
      res.status(200).json({
        success: true,
        message: `Payment verified! ${verified.planConfig.name} subscription is now active.`,
        data: verified
      });
    } catch (error) {
      next(error);
    }
  };

  cancelSubscription = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user!.id;
      const result = await this.billingService.cancelSubscription(userId);
      res.status(200).json({
        success: true,
        message: result.message,
        data: result
      });
    } catch (error) {
      next(error);
    }
  };

  getHistory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user!.id;
      const data = await this.billingService.getSubscription(userId);
      res.status(200).json({
        success: true,
        data: data.transactions
      });
    } catch (error) {
      next(error);
    }
  };

  webhook = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const signature = (req.headers['x-razorpay-signature'] || '') as string;
      const rawBody = (req as any).rawBody || JSON.stringify(req.body);
      const result = await this.billingService.processWebhook(rawBody, signature);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };
}
export default BillingController;
