import { pgTable, uuid, jsonb, timestamp, varchar, integer, foreignKey } from 'drizzle-orm/pg-core';
import { exams } from './exams';
import { users } from './users';

export const submissions = pgTable('submissions', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id),
  examId: uuid('exam_id').references(() => exams.id, { onDelete: 'cascade' }),
  answers: jsonb('answers').notNull(),
  submittedAt: timestamp('submitted_at').notNull(),
  status: varchar('status', { length: 50 }).notNull().default('submitted'),
  score: integer('score'),
  feedback: varchar('feedback', { length: 1000 }),
  questionScores: jsonb('question_scores'),
  graderId: uuid('grader_id').references(() => users.id),
  gradedAt: timestamp('graded_at'),
});

export type Submission = typeof submissions.$inferSelect;
export type NewSubmission = typeof submissions.$inferInsert;