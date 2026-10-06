import { Request, Response, NextFunction } from 'express';
import { getRedisClient } from '../lib/redis';
import config from '../config';
import logger from '../lib/logger';
import { AppError } from '../errors/AppError';

export const rateLimiter = (
  limit = config.RATE_LIMIT_MAX,
  windowMs = config.RATE_LIMIT_WINDOW_MS
) => {
  const redis = getRedisClient(config.REDIS_URI);

  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    // Identify client by user id if logged in, else IP address
    const identifier = req.user?.id || req.ip || 'unknown';
    const key = `ratelimit:${identifier}`;
    const now = Date.now();
    const windowStart = now - windowMs;

    try {
      const pipeline = redis.pipeline();
      // Remove elements older than window
      pipeline.zremrangebyscore(key, 0, windowStart);
      // Add current request timestamp
      pipeline.zadd(key, now, now.toString());
      // Count total elements in window
      pipeline.zcard(key);
      // Set expiration of key to clean up idle keys
      pipeline.pexpire(key, windowMs);

      const execResult = await pipeline.exec();

      if (!execResult) {
        throw new Error('Redis pipeline failed');
      }

      // Card count is the third result, return element index 1 (resolved value)
      // Redis pipeline exec returns array of [Error | null, result]
      const countResult = execResult[2];
      const requestCount = typeof countResult[1] === 'number' ? countResult[1] : 1;

      res.setHeader('X-RateLimit-Limit', limit);
      res.setHeader('X-RateLimit-Remaining', Math.max(0, limit - requestCount));
      res.setHeader('X-RateLimit-Reset', new Date(now + windowMs).toISOString());

      if (requestCount > limit) {
        logger.warn({ identifier, count: requestCount, limit }, 'Rate limit exceeded');
        return next(new AppError('Too many requests, please try again later.', 429, 'RATE_LIMIT_EXCEEDED'));
      }

      next();
    } catch (error) {
      // Fail-open strategy: If redis fails, log it and let request proceed so user experience is not disrupted.
      logger.error({ error, identifier }, 'Rate limiter Redis failure. Fail-open triggered.');
      next();
    }
  };
};

export default rateLimiter;
