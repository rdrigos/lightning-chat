import * as schemas from '@/infrastructure/database/drizzle/drizzle.schema';
import { EnvironmentService } from '@/infrastructure/environment/environment.service';
import { Provider } from '@nestjs/common';
import { drizzle, NodePgDatabase } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

export const DRIZZLE = Symbol('DRIZZLE');

export type DrizzleDB = NodePgDatabase<typeof schemas>;

export const DrizzleProvider: Provider = {
  provide: DRIZZLE,
  inject: [EnvironmentService],
  useFactory: (env: EnvironmentService): DrizzleDB => {
    const pool = new Pool({
      connectionString: env.get('DATABASE_URL'),
      max: env.get('DATABASE_POOL_MAX'),
      idleTimeoutMillis: env.get('DATABASE_IDLE_TIMEOUT'),
    });

    return drizzle({
      client: pool,
      schema: schemas,
    });
  },
};
