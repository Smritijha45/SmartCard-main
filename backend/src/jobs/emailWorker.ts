import { Worker } from 'bullmq';
import nodemailer from 'nodemailer';
import { getRedisClient } from '../lib/redis';
import config from '../config';
import logger from '../lib/logger';

let worker: Worker | null = null;

export function initEmailWorker(): Worker {
  const redisClient = getRedisClient(config.REDIS_URI);

  const transporter = nodemailer.createTransport({
    host: config.SMTP_HOST,
    port: config.SMTP_PORT,
    auth: config.SMTP_USER && config.SMTP_PASS ? {
      user: config.SMTP_USER,
      pass: config.SMTP_PASS
    } : undefined
  });

  worker = new Worker('email-queue', async (job) => {
    logger.info({ jobId: job.id, jobName: job.name }, 'Processing background email job');

    if (job.name === 'send-otp') {
      const { email, code } = job.data;

      const mailOptions = {
        from: config.SMTP_FROM_EMAIL,
        to: email,
        subject: 'SmartCard Verification Passcode',
        html: `
          <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 12px;">
            <h2 style="color: #2563eb; margin-top: 0;">SmartCard SaaS</h2>
            <p>You requested a verification passcode to access your account.</p>
            <div style="background-color: #f3f4f6; padding: 16px; border-radius: 8px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 4px; color: #111827; margin: 24px 0;">
              ${code}
            </div>
            <p style="font-size: 14px; color: #4b5563;">This code is valid for 5 minutes. If you did not request this, please ignore this email.</p>
          </div>
        `
      };

      await transporter.sendMail(mailOptions);
      logger.info({ email, jobId: job.id }, 'OTP email successfully dispatched via transporter');
    }
  }, {
    connection: redisClient
  });

  worker.on('completed', (job) => {
    logger.info({ jobId: job?.id }, 'Background email job successfully completed');
  });

  worker.on('failed', (job, err) => {
    logger.error({ jobId: job?.id, err }, 'Background email job failed');
  });

  logger.info('BullMQ Email Worker initialized');
  return worker;
}

export function getEmailWorker(): Worker {
  if (!worker) {
    throw new Error('Email worker is not initialized yet');
  }
  return worker;
}
export default initEmailWorker;
