import { Queue } from 'bullmq';
import { getRedisClient } from './redis';
import logger from './logger';

export function createQueue(name: string, connectionUri: string): Queue {
  const redisClient = getRedisClient(connectionUri);

  const queue = new Queue(name, {
    connection: redisClient,
    defaultJobOptions: {
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 5000
      },
      removeOnComplete: true,
      removeOnFail: false
    }
  });


  queue.on('error', (error) => {
    logger.error({ queue: name, error }, 'BullMQ Queue error');
  });

  logger.info(`BullMQ Queue "${name}" initialized`);
  return queue;
}
