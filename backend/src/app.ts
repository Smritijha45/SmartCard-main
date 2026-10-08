import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { authRoutes } from './modules/auth/routes';
import { userRoutes } from './modules/users/routes';
import { cardRoutes } from './modules/cards/routes';
import { companyRoutes } from './modules/company/routes';
import { analyticsRoutes } from './modules/analytics/routes';
import { notificationRoutes } from './modules/notifications/routes';
import leadsRoutes from './modules/leads/routes';
import aiRoutes from './modules/ai/routes';
import { errorHandler } from './middlewares/errorHandler';
import { NotFoundError } from './errors/AppError';
import { getRedisClient } from './lib/redis';
import config from './config';
import mongoose from 'mongoose';

const app = express();

// Security and utility Middlewares
app.use(helmet());

const clientUrl = process.env.CLIENT_URL || 'http://localhost:3000';
const allowedOrigins = [clientUrl, 'http://localhost:3000', 'http://127.0.0.1:3000'].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin) || allowedOrigins.some(o => origin.startsWith(o))) {
      callback(null, true);
    } else {
      callback(null, true);
    }
  },
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Custom lightweight cookie parser middleware
app.use((req, _res, next) => {
  const cookieHeader = req.headers.cookie || '';
  const cookies: Record<string, string> = {};
  cookieHeader.split(';').forEach((cookie) => {
    const parts = cookie.split('=');
    if (parts.length === 2) {
      cookies[parts[0].trim()] = parts[1].trim();
    }
  });
  req.cookies = cookies;
  next();
});

// Health check endpoint
app.get('/health', async (_req, res, next) => {
  try {
    const dbStatus = mongoose.connection.readyState === 1 ? 'UP' : 'DOWN';
    let redisStatus = 'DOWN';

    try {
      const redis = getRedisClient(config.REDIS_URI);
      const ping = await redis.ping();
      if (ping === 'PONG') {
        redisStatus = 'UP';
      }
    } catch {
      // Redis ping failed
    }

    const statusCode = (dbStatus === 'UP' && redisStatus === 'UP') ? 200 : 503;
    res.status(statusCode).json({
      success: statusCode === 200,
      timestamp: new Date().toISOString(),
      services: {
        database: dbStatus,
        cache: redisStatus
      }
    });
  } catch (error) {
    next(error);
  }
});

// App Router routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/cards', cardRoutes);
app.use('/api/company', companyRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/leads', leadsRoutes);
app.use('/api/contacts', leadsRoutes);
app.use('/api/ai', aiRoutes);

// Fallback for unhandled routes
app.use('*', (_req, _res, next) => {
  next(new NotFoundError('The requested endpoint does not exist'));
});

// Global Error Handler
app.use(errorHandler);

export default app;
