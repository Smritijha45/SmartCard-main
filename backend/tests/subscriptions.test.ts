import crypto from 'crypto';
import { BillingService } from '../src/modules/billing/service';
import UserModel from '../src/modules/users/model';
import { PaymentTransactionModel } from '../src/modules/billing/transactionModel';
import { SubscriptionModel } from '../src/modules/billing/subscriptionModel';
import config from '../src/config';

jest.mock('../src/modules/users/model');
jest.mock('../src/modules/billing/transactionModel');
jest.mock('../src/modules/billing/subscriptionModel');
jest.mock('../src/modules/billing/webhookModel');

const mockCreateOrder = jest.fn();
jest.mock('../src/modules/billing/razorpayClient', () => ({
  getRazorpayClient: () => ({
    orders: {
      create: (...args: any[]) => mockCreateOrder(...args),
    },
  }),
  verifyRazorpayPaymentSignature: () => true,
  verifyRazorpayWebhookSignature: () => true,
}));

describe('Monthly Recurring Subscriptions Test Suite', () => {
  let billingService: BillingService;

  beforeEach(() => {
    jest.clearAllMocks();
    billingService = new BillingService();
  });

  describe('Monthly Subscription Order Creation', () => {
    it('should create order for Professional plan at ₹199 (19900 paise)', async () => {
      const mockUser = {
        _id: '507f1f77bcf86cd799439011',
        id: '507f1f77bcf86cd799439011',
        name: 'Pro User',
        email: 'pro@smartcard.app',
      };

      (UserModel.findById as jest.Mock).mockResolvedValue(mockUser);
      (PaymentTransactionModel.create as jest.Mock).mockResolvedValue({ _id: 'tx_sub_1' });
      mockCreateOrder.mockResolvedValue({
        id: 'order_NRV001Pro',
        amount: 19900,
        currency: 'INR',
        status: 'created',
      });

      const result = await billingService.createSubscriptionOrder(mockUser.id, 'professional');

      expect(result.amount).toBe(19900);
      expect(result.currency).toBe('INR');
      expect(result.plan).toBe('professional');
      expect(result.orderId).toBe('order_NRV001Pro');
    });

    it('should create order for Team & Enterprise plan at ₹799 (79900 paise)', async () => {
      const mockUser = {
        _id: '507f1f77bcf86cd799439022',
        id: '507f1f77bcf86cd799439022',
        name: 'Enterprise User',
        email: 'enterprise@smartcard.app',
      };

      (UserModel.findById as jest.Mock).mockResolvedValue(mockUser);
      (PaymentTransactionModel.create as jest.Mock).mockResolvedValue({ _id: 'tx_sub_2' });
      mockCreateOrder.mockResolvedValue({
        id: 'order_NRV002Enterprise',
        amount: 79900,
        currency: 'INR',
        status: 'created',
      });

      const result = await billingService.createSubscriptionOrder(mockUser.id, 'enterprise');

      expect(result.amount).toBe(79900);
      expect(result.currency).toBe('INR');
      expect(result.plan).toBe('enterprise');
      expect(result.orderId).toBe('order_NRV002Enterprise');
    });
  });

  describe('Subscription Verification & Activation', () => {
    it('should verify signature and activate monthly recurring subscription', async () => {
      const orderId = 'order_NRV001Pro';
      const paymentId = 'pay_NRV001ProPay';
      const validSignature = crypto
        .createHmac('sha256', config.RAZORPAY_KEY_SECRET)
        .update(`${orderId}|${paymentId}`)
        .digest('hex');

      const mockUser: any = {
        _id: '507f1f77bcf86cd799439011',
        id: '507f1f77bcf86cd799439011',
        name: 'Pro User',
        email: 'pro@smartcard.app',
        subscriptionPlan: 'starter',
        subscription: {
          plan: 'starter',
          status: 'active',
          is24hPass: false,
          paymentHistory: [],
        },
        save: jest.fn().mockResolvedValue(true),
      };

      const mockTx: any = {
        _id: 'tx_pro_1',
        orderId,
        amount: 199,
        currency: 'INR',
        status: 'created',
        save: jest.fn().mockResolvedValue(true),
      };

      (UserModel.findById as jest.Mock).mockResolvedValue(mockUser);
      (PaymentTransactionModel.findOne as jest.Mock).mockResolvedValue(mockTx);
      (SubscriptionModel.findOneAndUpdate as jest.Mock).mockResolvedValue({
        _id: 'sub_rec_1',
        plan: 'professional',
        status: 'active',
      });

      const result = await billingService.verifySubscriptionPayment(mockUser.id, {
        plan: 'professional',
        orderId,
        paymentId,
        signature: validSignature,
      });

      expect(result.subscription.plan).toBe('professional');
      expect(result.subscription.status).toBe('active');
      expect(mockUser.subscriptionPlan).toBe('professional');
      expect(mockUser.subscription.is24hPass).toBe(false);
      expect(mockUser.save).toHaveBeenCalled();
    });
  });

  describe('Subscription Cancellation', () => {
    it('should cancel subscription at period end and preserve active access until period end', async () => {
      const futurePeriodEnd = new Date(Date.now() + 20 * 24 * 60 * 60 * 1000);
      const mockUser: any = {
        _id: '507f1f77bcf86cd799439011',
        id: '507f1f77bcf86cd799439011',
        subscriptionPlan: 'professional',
        subscription: {
          plan: 'professional',
          status: 'active',
          cancelAtPeriodEnd: false,
          currentPeriodEnd: futurePeriodEnd,
        },
        save: jest.fn().mockResolvedValue(true),
      };

      (UserModel.findById as jest.Mock).mockResolvedValue(mockUser);
      (SubscriptionModel.findOneAndUpdate as jest.Mock).mockResolvedValue({
        status: 'active',
        cancelAtPeriodEnd: true,
      });

      const result = await billingService.cancelSubscription(mockUser.id);

      expect(result.cancelAtPeriodEnd).toBe(true);
      expect(mockUser.subscription.cancelAtPeriodEnd).toBe(true);
      expect(mockUser.save).toHaveBeenCalled();
    });
  });
});
