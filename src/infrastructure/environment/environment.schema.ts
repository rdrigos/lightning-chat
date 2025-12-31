import { z } from 'zod';

export const schema = z.object({
  PORT: z.coerce.number().min(80).max(65535),
  DATABASE_URL: z.url(),
  DATABASE_POOL_MAX: z.coerce.number().min(5).max(25).default(10),
  DATABASE_IDLE_TIMEOUT: z.coerce.number().min(5000).max(60000).default(30000),
  JWT_TOKEN_ISSUER: z.string().min(8).max(32),
  JWT_TOKEN_SECRET: z.string().min(16).max(32),
});

export type Environment = z.infer<typeof schema>;
