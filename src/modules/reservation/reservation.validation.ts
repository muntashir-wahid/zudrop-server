import { z } from 'zod';

export const createDropSchema = {
  body: z.object({
    username: z.string().min(1, 'Username is required'),
  }),
};

export type CreateDropBody = z.infer<typeof createDropSchema.body>;
