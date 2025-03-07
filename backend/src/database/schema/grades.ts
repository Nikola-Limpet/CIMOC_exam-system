import { pgTable, uuid, integer, text, timestamp } from 'drizzle-orm/pg-core';
import { submissions } from './submissions';
import { users } from './users';

export const grades = pgTable('grades', {
  id: uuid('id').primaryKey().defaultRandom(),
  submissionId: uuid('submission_id').references(() => submissions.id).notNull(),
  gradedBy: uuid('graded_by').references(() => users.id).notNull(),
  score: integer('score').notNull(),
  feedback: text('feedback'),
  gradedAt: timestamp('graded_at').defaultNow(),
});

// Types for TypeScript
export type Grade = typeof grades.$inferSelect;
export type NewGrade = typeof grades.$inferInsert; 