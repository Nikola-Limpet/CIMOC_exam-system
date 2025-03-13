import { pgTable, uuid, text, timestamp, boolean, integer } from 'drizzle-orm/pg-core';
import { exams } from './exams';

export const accessKeys = pgTable('access_keys', {
  id: uuid('id').primaryKey().defaultRandom(),
  examId: uuid('exam_id').references(() => exams.id).notNull(),
  key: text('key').notNull(),
  issuedBy: uuid('issued_by').notNull(),
  issuedTo: uuid('issued_to'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  revoked: boolean('revoked').default(false),
  usageLimit: integer('usage_limit'),
  usageCount: integer('usage_count').default(0),
  description: text('description'),
});

export type AccessKey = typeof accessKeys.$inferSelect;
export type NewAccessKey = typeof accessKeys.$inferInsert;