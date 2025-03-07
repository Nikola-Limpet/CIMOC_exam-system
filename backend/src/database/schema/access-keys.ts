import { pgTable, uuid, varchar, timestamp, boolean, foreignKey } from 'drizzle-orm/pg-core';
import { exams } from './exams';
import { users } from './users';

export const accessKeys = pgTable('access_keys', {
  id: uuid('id').primaryKey().defaultRandom(),
  key: varchar('key', { length: 50 }).notNull().unique(),
  examId: uuid('exam_id').references(() => exams.id, { onDelete: 'cascade' }),
  issuedTo: uuid('issued_to').references(() => users.id),
  issuedBy: uuid('issued_by').references(() => users.id),
  expiresAt: timestamp('expires_at'),
  revoked: boolean('revoked').default(false),
  createdAt: timestamp('created_at').defaultNow(),
});

export type AccessKey = typeof accessKeys.$inferSelect;
export type NewAccessKey = typeof accessKeys.$inferInsert;