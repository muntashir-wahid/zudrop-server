import { z } from 'zod';

export const createDropSchema = {
  body: z.object({
    name: z
      .string()
      .min(3, 'Name must be at least 3 characters')
      .max(100, 'Name must be at most 100 characters'),

    description: z.string().max(255, 'Description must be at most 255 characters').optional(),
    price: z.number().positive('Price must be a positive number'),
    availableStock: z.number().int().nonnegative('Available stock must be a non-negative integer'),
  }),
};
export type CreateDropBody = z.infer<typeof createDropSchema.body>;
