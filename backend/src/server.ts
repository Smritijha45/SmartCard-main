import app from './app';
import config from './config';
import { connectDatabase, disconnectDatabase } from './lib/database';
import { getRedisClient, disconnectRedis } from './lib/redis';
import { configureCloudinary } from './lib/cloudinary';
import logger from './lib/logger';
import { Server } from 'http';

let server: Server;

async function bootstrap() {
  logger.info(`Starting server in ${config.NODE_ENV} mode...`);

  // 1. Establish Database Connection
  await connectDatabase(config.MONGO_URI);

  // 2. Initialize Redis connection pool
  getRedisClient(config.REDIS_URI);

  // 3. Configure Cloudinary
  configureCloudinary(
    config.CLOUDINARY_CLOUD_NAME,
    config.CLOUDINARY_API_KEY,
    config.CLOUDINARY_API_SECRET
  );

  // 4. Start listening
  const port = config.PORT;
  const httpServer = new Server(app);

  // Initialize Socket.io connection listener
  const { initSocket } = require('./lib/socket');
  initSocket(httpServer);

  // Initialize background workers
  const { initEmailWorker } = require('./jobs/emailWorker');
  initEmailWorker();

  server = httpServer.listen(port, () => {
    logger.info(`Server successfully listening on port ${port}`);
  });
}

// Graceful teardown
async function shutdown(signal: string) {
  logger.warn(`Received ${signal}. Starting graceful shutdown...`);

  if (server) {
    server.close(async () => {
      logger.info('HTTP server closed');

      // Close background workers
      try {
        const { getEmailWorker } = require('./jobs/emailWorker');
        await getEmailWorker().close();
        logger.info('Email worker closed successfully');
      } catch (err) {
        logger.error({ err }, 'Error closing email worker');
      }

      // Disconnect DB clients
      await disconnectDatabase();
      await disconnectRedis();

      logger.info('Graceful shutdown completed. Exiting process.');
      process.exit(0);
    });

    // Enforce timeout shutdown if handles are hanging
    setTimeout(() => {
      logger.fatal('Could not close connections in time, forcefully shutting down');
      process.exit(1);
    }, 10000);
  } else {
    process.exit(0);
  }
}

// Global Exception handlers
process.on('uncaughtException', (error) => {
  logger.fatal({ error }, 'Uncaught Exception detected! Node process terminating...');
  process.exit(1);
});

process.on('unhandledRejection', (reason) => {
  logger.fatal({ reason }, 'Unhandled Promise Rejection detected! Node process terminating...');
  process.exit(1);
});

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

bootstrap().catch((error) => {
  logger.fatal({ error }, 'Failed to start API bootstrap server');
  process.exit(1);
});
