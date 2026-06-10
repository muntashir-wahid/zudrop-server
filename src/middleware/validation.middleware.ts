import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';
import { AppError, ValidationError } from '../utils/errors';

type ValidationSchema = {
  body?: ZodSchema<any>;
  query?: ZodSchema<any>;
  params?: ZodSchema<any>;
};

export const validate =
  (schema: ValidationSchema) => async (req: Request, _res: Response, next: NextFunction) => {
    try {
      // Validate each part independently
      if (schema.body) {
        req.body = await schema.body.parseAsync(req.body);
      }

      if (schema.query) {
        const parsed = await schema.query.parseAsync(req.query);
        Object.defineProperty(req, 'query', {
          value: parsed,
          writable: true,
          configurable: true,
          enumerable: true,
        });
      }

      if (schema.params) {
        req.params = await schema.params.parseAsync(req.params);
      }

      return next();
    } catch (error) {
      if (error instanceof ZodError) {
        console.log('Zod error');
        const formattedErrors = error.issues.map((e) => ({
          field: e.path.join('.'),
          message: e.message,
        }));

        return next(new ValidationError(formattedErrors));
      }

      return next(new AppError('Validation failed', 400));
    }
  };
