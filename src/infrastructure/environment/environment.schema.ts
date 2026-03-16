import { z } from 'zod';

export const schema = z.object({
  HOST: z.string().min(6).default('0.0.0.0'),
  PORT: z.coerce.number().min(80).max(65535),
});

export type Environment = z.infer<typeof schema>;
