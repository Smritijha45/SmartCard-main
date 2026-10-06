import Redis from 'ioredis';
import logger from './logger';

let redisClient: Redis | null = null;

export function getRedisClient(uri: string): Redis {
  if (redisClient) {
    return redisClient;
  }

  redisClient = new Redis(uri, {
    maxRetriesPerRequest: null, // Essential configuration for BullMQ
    enableReadyCheck: true,
    reconnectOnError: (err) => {
      const targetError = 'READONLY';
      if (err.message.includes(targetError)) {
        return true;
      }
      return false;
    },
    retryStrategy: (times) => {
      const delay = Math.min(times * 100, 3000);
      logger.warn(`Redis connection retry attempt ${times} in ${delay}ms`);
      return delay;
    }
  });

  redisClient.on('connect', () => {
    logger.info('Connecting to Redis...');
  });

  redisClient.on('ready', () => {
    logger.info('Redis client connected and ready');
  });

  redisClient.on('error', (error) => {
    logger.error({ error }, 'Redis client connection error');
  });

  redisClient.on('end', () => {
    logger.warn('Redis connection closed');
  });

  return redisClient;
}

export async function disconnectRedis(): Promise<void> {
  if (redisClient) {
    await redisClient.quit();
    logger.info('Redis connection quit gracefully');
    redisClient = null;
  }
}
