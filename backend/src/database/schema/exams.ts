import { pgTable, uuid, text, timestamp, integer, pgEnum } from 'drizzle-orm/pg-core';
import { users } from './users';

export const examStatusEnum = pgEnum('exam_status', ['draft', 'published', 'archived']);

export const exams = pgTable('exams', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: text('title').notNull(),
  description: text('description'),
  createdBy: uuid('created_by').references(() => users.id).notNull(), // Reference to user ID
  duration: integer('duration'), // Overall exam duration in minutes (optional)
  availableFrom: timestamp('available_from'), // When the exam becomes available
  availableTo: timestamp('available_to'), // When the exam expires
  status: examStatusEnum('status').default('draft'),
  totalQuestions: integer('total_questions').default(0),
  participants: integer('participants').default(0),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Types for TypeScript
export type Exam = typeof exams.$inferSelect;
export type NewExam = typeof exams.$inferInsert;