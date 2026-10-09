import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const configSchema = z.object({
  PORT: z.string().transform((val) => parseInt(val, 10)).default('5000'),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  FRONTEND_URL: z.string().default(process.env.FRONTEND_URL || 'http://localhost:3000'),
  MONGO_URI: z.string().default(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/smartcard-saas'),
  REDIS_URI: z.string().default(process.env.REDIS_URI || 'redis://127.0.0.1:6379'),
  JWT_ACCESS_SECRET: z.string().min(8).default(process.env.JWT_ACCESS_SECRET || 'smartcard_jwt_access_secret_super_secure_key_123'),
  JWT_REFRESH_SECRET: z.string().min(8).default(process.env.JWT_REFRESH_SECRET || 'smartcard_jwt_refresh_secret_super_secure_key_123'),
  JWT_ACCESS_EXPIRY: z.string().default('15m'),
  JWT_REFRESH_EXPIRY: z.string().default('7d'),
  
  // Razorpay Configuration
  RAZORPAY_KEY_ID: z.string().default(process.env.RAZORPAY_KEY_ID || 'rzp_test_placeholder_key'),
  RAZORPAY_KEY_SECRET: z.string().default(process.env.RAZORPAY_KEY_SECRET || 'rzp_test_placeholder_secret'),
  RAZORPAY_WEBHOOK_SECRET: z.string().default(process.env.RAZORPAY_WEBHOOK_SECRET || 'rzp_webhook_secret_12345'),

  // Cloudinary & Storage
  CLOUDINARY_CLOUD_NAME: z.string().default('smartcard_demo'),
  CLOUDINARY_API_KEY: z.string().default('1234567890'),
  CLOUDINARY_API_SECRET: z.string().default('abcdefghijklmnopqrstuvwxyz'),

  // Rate Limiting
  RATE_LIMIT_MAX: z.string().transform((val) => parseInt(val, 10)).default('100'),
  RATE_LIMIT_WINDOW_MS: z.string().transform((val) => parseInt(val, 10)).default('900000'),

  // Email & Notifications
  SMTP_HOST: z.string().default('localhost'),
  SMTP_PORT: z.string().transform((val) => parseInt(val, 10)).default('2525'),
  SMTP_USER: z.string().optional(),
  SMTP_PASS: z.string().optional(),
  SMTP_FROM_EMAIL: z.string().email().default('noreply@smartcard.app'),
  WHATSAPP_WEBHOOK_URL: z.string().optional(),
});

const parsed = configSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('❌ Invalid environment configuration:');
  console.error(JSON.stringify(parsed.error.format(), null, 2));
  process.exit(1);
}

export const config = Object.freeze(parsed.data);
export default config;
export type Config = typeof config;
