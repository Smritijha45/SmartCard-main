import crypto from 'crypto';
import { BillingService } from '../src/modules/billing/service';
import UserModel from '../src/modules/users/model';
import { PaymentTransactionModel } from '../src/modules/billing/transactionModel';
import { PaymentWebhookEventModel } from '../src/modules/billing/webhookModel';
import { verifyRazorpayPaymentSignature } from '../src/modules/billing/razorpayClient';
import { ConflictError } from '../src/errors/AppError';
import config from '../src/config';

jest.mock('../src/modules/users/model');
jest.mock('../src/modules/billing/transactionModel');
jest.mock('../src/modules/billing/webhookModel');
jest.mock('../src/modules/billing/subscriptionModel');

const mockCreateOrder = jest.fn();
jest.mock('../src/modules/billing/razorpayClient', () => {
  const actual = jest.requireActual('../src/modules/billing/razorpayClient');
  return {
    ...actual,
    getRazorpayClient: () => ({
      orders: {
        create: (...args: any[]) => mockCreateOrder(...args),
      },
    }),
  };
});

describe('₹20 24-Hour Introductory Professional Pass Test Suite', () => {
  let billingService: BillingService;

  beforeEach(() => {
    jest.clearAllMocks();
    billingService = new BillingService();
  });

  describe('Introductory Order Creation (₹20 INR / 2000 Paise)', () => {
    it('should create a Razorpay order for exactly 2000 paise (₹20 INR)', async () => {
      const mockUser = {
        _id: '507f1f77bcf86cd799439011',
        id: '507f1f77bcf86cd799439011',
        name: 'Pass User',
        email: 'passuser@smartcard.app',
        subscription: { is24hPass: false },
      };

      (UserModel.findById as jest.Mock).mockResolvedValue(mockUser);
      (PaymentTransactionModel.create as jest.Mock).mockResolvedValue({ _id: 'tx_1' });
      mockCreateOrder.mockResolvedValue({
        id: 'order_NRV001Intro',
        amount: 2000,
        currency: 'INR',
        status: 'created',
      });

      const result = await billingService.createIntroductoryOrder(mockUser.id);

      expect(result).toBeDefined();
      expect(result.amount).toBe(2000);
      expect(result.currency).toBe('INR');
      expect(result.orderId).toBe('order_NRV001Intro');
    });

    it('should reject 24h pass order creation if user already has an active 24h pass', async () => {
      const futureDate = new Date(Date.now() + 12 * 60 * 60 * 1000);
      const mockUser = {
        _id: '507f1f77bcf86cd799439011',
        id: '507f1f77bcf86cd799439011',
        subscription: {
          is24hPass: true,
          passExpiryDate: futureDate,
        },
      };

      (UserModel.findById as jest.Mock).mockResolvedValue(mockUser);

      await expect(
        billingService.createIntroductoryOrder(mockUser.id)
      ).rejects.toThrow(ConflictError);
    });
  });

  describe('Cryptographic Signature Verification & Activation', () => {
    it('should accurately verify valid HMAC SHA256 payment signature and reject invalid ones', () => {
      const orderId = 'order_NRV001Intro';
      const paymentId = 'pay_NRV001Test';
      
      const validSignature = crypto
        .createHmac('sha256', config.RAZORPAY_KEY_SECRET)
        .update(`${orderId}|${paymentId}`)
        .digest('hex');

      const isSignatureValid = verifyRazorpayPaymentSignature({
        orderId,
        paymentId,
        signature: validSignature,
      });
      expect(isSignatureValid).toBe(true);

      const isForgedValid = verifyRazorpayPaymentSignature({
        orderId,
        paymentId,
        signature: 'invalid_forged_signature_123',
      });
      expect(isForgedValid).toBe(false);
    });

    it('should successfully activate 24-hour Professional pass upon verified payment', async () => {
      const orderId = 'order_NRV001Intro';
      const paymentId = 'pay_NRV001Test';
      
      const validSignature = crypto
        .createHmac('sha256', config.RAZORPAY_KEY_SECRET)
        .update(`${orderId}|${paymentId}`)
        .digest('hex');

      const mockUser: any = {
        _id: '507f1f77bcf86cd799439011',
        id: '507f1f77bcf86cd799439011',
        name: 'Pass User',
        email: 'passuser@smartcard.app',
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
        _id: 'tx_123',
        orderId,
        amount: 20,
        currency: 'INR',
        status: 'created',
        save: jest.fn().mockResolvedValue(true),
      };

      (UserModel.findById as jest.Mock).mockResolvedValue(mockUser);
      (PaymentTransactionModel.findOne as jest.Mock).mockResolvedValue(mockTx);

      const result = await billingService.verifyIntroductoryPayment(mockUser.id, {
        orderId,
        paymentId,
        signature: validSignature,
      });

      expect(result).toBeDefined();
      expect(result.subscription.plan).toBe('professional');
      expect(result.subscription.is24hPass).toBe(true);
      expect(mockUser.subscriptionPlan).toBe('professional');
      expect(mockUser.subscription.passExpiryDate).toBeDefined();
      
      const diffHours = (new Date(mockUser.subscription.passExpiryDate).getTime() - Date.now()) / (1000 * 60 * 60);
      expect(diffHours).toBeGreaterThan(23.9);
      expect(diffHours).toBeLessThanOrEqual(24.1);
      expect(mockUser.save).toHaveBeenCalled();
    });
  });

  describe('Webhook Idempotency & Replay Protection', () => {
    it('should process webhook event idempotently and prevent duplicate entitlement extension', async () => {
      const eventId = 'evt_razorpay_001_idempotent';
      const orderId = 'order_NRV001Intro';
      const paymentId = 'pay_NRV001Test';

      const webhookPayload = {
        event_id: eventId,
        event: 'order.paid',
        payload: {
          order: { entity: { id: orderId, amount: 2000, currency: 'INR' } },
          payment: { entity: { id: paymentId, order_id: orderId, amount: 2000, status: 'captured' } },
        },
      };

      const rawBody = JSON.stringify(webhookPayload);
      const signature = crypto
        .createHmac('sha256', config.RAZORPAY_WEBHOOK_SECRET)
        .update(rawBody)
        .digest('hex');

      const mockWebhookRecord: any = {
        eventId,
        status: 'received',
        save: jest.fn().mockResolvedValue(true),
      };

      // First call: Not processed yet
      (PaymentWebhookEventModel.findOne as jest.Mock).mockResolvedValue(null);
      (PaymentWebhookEventModel.create as jest.Mock).mockResolvedValue(mockWebhookRecord);
      (PaymentTransactionModel.findOne as jest.Mock).mockResolvedValue(null);

      const firstCallResult = await billingService.processWebhook(rawBody, signature);
      expect(firstCallResult.received).toBe(true);

      // Second call with processed event in DB: idempotent skip!
      (PaymentWebhookEventModel.findOne as jest.Mock).mockResolvedValue({
        eventId,
        status: 'processed',
      });

      const duplicateCallResult = await billingService.processWebhook(rawBody, signature);
      expect(duplicateCallResult.received).toBe(true);
      expect(duplicateCallResult.idempotent).toBe(true);
    });
  });
});
