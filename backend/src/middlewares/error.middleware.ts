import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/apiError';
import logger from '../utils/logger';

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';
  let errors = err.errors || [];

  if (err.name === 'PrismaClientKnownRequestError') {
    // Unique constraint violation in Prisma
    if (err.code === 'P2002') {
      statusCode = 409;
      const target = (err.meta?.target as string[]) || ['Field'];
      message = `${target.join(', ')} already exists`;
    } else if (err.code === 'P2025') {
      statusCode = 404;
      message = 'Requested record not found in database';
    }
  }

  if (statusCode >= 500) {
    logger.error(`[${req.method}] ${req.url} - ${err.stack || err.message}`);
  } else {
    logger.warn(`[${req.method}] ${req.url} - ${statusCode} ${message}`);
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(errors.length > 0 && { errors }),
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};
