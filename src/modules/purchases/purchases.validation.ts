import { z } from 'zod';

export const createPurchaseSchema = {
  body: z.object({
    dropId: z.cuid(),

    username: z
      .string()
      .min(3, 'Username must be at least 3 characters')
      .max(100, 'Username must be at most 100 characters'),
  }),
};

export type CreatePurchaseBody = z.infer<typeof createPurchaseSchema.body>;
