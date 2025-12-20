import { z } from 'zod';

export const schema = z.object({
  PORT: z.coerce.number().min(80).max(65535),
});

export type Environment = z.infer<typeof schema>;
