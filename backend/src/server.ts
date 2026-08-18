import app from './app';
import { env } from './config/env.config';
import logger from './utils/logger';
import prisma from './config/database';

const PORT = env.PORT || 5000;

const server = app.listen(PORT, () => {
  logger.info(`🚀 Server running in ${env.NODE_ENV} mode on port ${PORT}`);
  logger.info(`🔗 API Health Check: http://localhost:${PORT}/health`);
});

// Graceful Shutdown
const shutdown = async (signal: string) => {
  logger.info(`Received ${signal}. Shutting down gracefully...`);
  server.close(async () => {
    logger.info('HTTP server closed.');
    await prisma.$disconnect();
    logger.info('Prisma disconnected. Exiting process.');
    process.exit(0);
  });
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
