import { InferInsertModel, InferSelectModel } from 'drizzle-orm';
import { integer, pgTable, smallint, text, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';

// table
export const users = pgTable('users', {
  id: uuid('id').primaryKey(),
  username: varchar('username', { length: 255 }).unique(),
  email: varchar('email', { length: 255 }).unique(),
  password: varchar('password', { length: 255 }),
  refreshToken: text('refresh_token'),
  dateLastLogin: timestamp('date_last_login'),
  dateLastChangePassword: timestamp('date_last_change_password'),
  dateLastFailedLogin: timestamp('date_last_failed_login'),
  dateLockoutExpiration: timestamp('date_lockout_expiration'),
  failedLoginAttempts: integer('failed_login_attempts').default(0),
  isAccountLocked: smallint('is_account_locked').default(0),
  isActive: smallint('is_active').default(1),
});

// Types for selecting and inserting data
export type User = InferSelectModel<typeof users>;
export type NewUser = InferInsertModel<typeof users>;
