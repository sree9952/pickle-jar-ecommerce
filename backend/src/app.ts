import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import routes from './routes';
import { errorHandler } from './middlewares/error.middleware';
import { apiRateLimiter } from './middlewares/rateLimiter.middleware';
import { env } from './config/env.config';

const app: Application = express();

// Security Middlewares
app.use(helmet());
app.use(
  cors({
    origin: [env.CLIENT_URL, 'http://localhost:4200'],
    credentials: true,
  })
);
app.use(compression());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging
if (env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// Rate Limiter
app.use('/api', apiRateLimiter);

// Health Check
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'UP',
    timestamp: new Date().toISOString(),
    service: 'Pickle & Jar E-commerce API',
  });
});

// API Routes
app.use('/api', routes);

// 404 Handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: `Cannot ${req.method} ${req.url}`,
  });
});

// Centralized Error Handling Middleware
app.use(errorHandler);

export default app;
