import express, { Application, NextFunction, Request, Response } from 'express';
import cors from 'cors';
import morgan from 'morgan';

import { AppError } from './utils/errors';
import { errorMiddleware } from './middleware/error.middleware';
import routes from './routes';

const app: Application = express();

// Middleware
app.use(
  cors({
    origin: ['http://localhost:5173', 'https://zudrop.vercel.app'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }),
);
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api', routes);

// Health check
app.get('/api/health', (_req: Request, res: Response) => {
  res.status(200).json({ status: 'ok', message: 'Hello from ZuDrop Server' });
});

// Catch-all for undefined routes
app.use((req: Request, _res: Response, next: NextFunction) => {
  next(new AppError(`Route ${req.originalUrl} not found`, 404));
});

// Error handler (must be last)
app.use(errorMiddleware);

export default app;
