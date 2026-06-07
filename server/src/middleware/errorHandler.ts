import { Request, Response, NextFunction } from 'express';
import { config } from '../config.js';

export class AppError extends Error {
  constructor(public statusCode: number, message: string) {
    super(message);
    this.name = 'AppError';
  }
}

export function errorHandler(err: Error, _req: Request, res: Response, _next: NextFunction): void {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({ error: err.message });
    return;
  }

  console.error('Unhandled error:', err);

  res.status(500).json({
    error: config.nodeEnv === 'production' ? 'Internal server error' : err.message,
  });
}

export function notFoundHandler(_req: Request, res: Response): void {
  res.status(404).json({ error: 'Route not found' });
}
