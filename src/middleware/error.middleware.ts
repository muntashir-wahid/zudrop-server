import { Request, Response, NextFunction } from 'express';
import { AppError, ValidationError } from '../utils/errors';

export const errorMiddleware = (err: any, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof ValidationError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      errors: err.errors,
    });
  }

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
  }

  console.error(err);

  res.status(500).json({
    success: false,
    message: 'Internal Server Error',
  });
};
