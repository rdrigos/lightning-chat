import { pgTable, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';
import { v7 as uuidV7 } from 'uuid';

export const userTable = pgTable('users', {
  id: uuid('id')
    .primaryKey()
    .$defaultFn(() => uuidV7()),
  name: varchar('name').notNull(),
  email: varchar('email').notNull().unique(),
  password: varchar('password').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export type DrizzleUser = typeof userTable.$inferSelect;

export type DrizzleUserInsert = typeof userTable.$inferInsert;
