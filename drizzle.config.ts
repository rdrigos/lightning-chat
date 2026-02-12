import { schema } from '@/infrastructure/environment/environment.schema';
import { defineConfig } from 'drizzle-kit';

const env = schema.parse(process.env);

export default defineConfig({
  dialect: 'postgresql',
  schema: 'src/infrastructure/database/drizzle/drizzle.schema.ts',
  out: 'drizzle',
  dbCredentials: {
    url: env.DATABASE_URL,
  },
});
