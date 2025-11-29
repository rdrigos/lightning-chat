import { pgTable, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';
import { v7 as uuidV7 } from 'uuid';
import { userTable } from './user.schema';

export const sessionTable = pgTable('sessions', {
  id: uuid('id')
    .primaryKey()
    .$defaultFn(() => uuidV7()),
  userId: uuid('user_id')
    .notNull()
    .references(() => userTable.id),
  token: varchar('token').notNull(),
  expiresAt: timestamp('expires_at').notNull(),
  ipAddress: varchar('ip_address'),
  userAgent: varchar('user_agent'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export type DrizzleSession = typeof sessionTable.$inferSelect;

export type DrizzleSessionInsert = typeof sessionTable.$inferInsert;
