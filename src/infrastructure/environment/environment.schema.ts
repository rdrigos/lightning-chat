import { z } from 'zod';

export const schema = z.object({
  PORT: z.coerce.number().min(80).max(65535),
  DATABASE_URL: z.url(),
  DATABASE_POOL_MAX: z.coerce.number().min(5).max(25).default(10),
  DATABASE_IDLE_TIMEOUT: z.coerce.number().min(5000).max(60000).default(30000),
});

export type Environment = z.infer<typeof schema>;
