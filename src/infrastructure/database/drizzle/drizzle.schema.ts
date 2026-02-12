import { relations } from 'drizzle-orm';
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

export const userRelations = relations(userTable, ({ many }) => ({
  session: many(sessionTable),
}));

export type DrizzleUser = typeof userTable.$inferSelect;

export type DrizzleUserInsert = typeof userTable.$inferInsert;

export const sessionTable = pgTable('sessions', {
  id: uuid('id')
    .primaryKey()
    .$defaultFn(() => uuidV7()),
  userId: uuid('user_id')
    .notNull()
    .references(() => userTable.id, { onDelete: 'cascade' }),
  token: varchar('token').notNull().unique(),
  expiresAt: timestamp('expires_at').notNull(),
  ipAddress: varchar('ip_address'),
  userAgent: varchar('user_agent'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const sessionRelations = relations(sessionTable, ({ one }) => ({
  user: one(userTable, {
    fields: [sessionTable.userId],
    references: [userTable.id],
  }),
}));

export type DrizzleSession = typeof sessionTable.$inferSelect;

export type DrizzleSessionInsert = typeof sessionTable.$inferInsert;
