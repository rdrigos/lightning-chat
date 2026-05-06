import { EnvironmentService } from '@/infrastructure/environment/environment.service';
import { Provider } from '@nestjs/common';
import { drizzle, NodePgDatabase } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

export const DRIZZLE = Symbol('DRIZZLE');

export const DrizzleProvider: Provider = {
  provide: DRIZZLE,
  inject: [EnvironmentService],
  useFactory: (env: EnvironmentService): NodePgDatabase => {
    const client = new Pool({
      connectionString: env.get('DATABASE_URL'),
      idleTimeoutMillis: 1000 * 60 * 2, // Two Minutes
    });

    return drizzle({
      client,
    });
  },
};
