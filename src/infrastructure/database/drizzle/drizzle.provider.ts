import * as schema from '@/infrastructure/database/drizzle/drizzle.schema';
import { EnvironmentService } from '@/infrastructure/environment/environment.service';
import { Provider } from '@nestjs/common';
import { drizzle, NodePgDatabase } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

export const DRIZZLE = Symbol('DRIZZLE');

export type DrizzleDB = NodePgDatabase<typeof schema>;

export const DrizzleProvider: Provider = {
  provide: DRIZZLE,
  inject: [EnvironmentService],
  useFactory: (env: EnvironmentService): DrizzleDB => {
    const client = new Pool({
      connectionString: env.get('DATABASE_URL'),
    });

    return drizzle({
      client,
      schema,
    });
  },
};
