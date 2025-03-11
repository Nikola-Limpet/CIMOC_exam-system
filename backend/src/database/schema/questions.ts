import { pgTable, uuid, text, integer, pgEnum, jsonb, boolean, timestamp } from 'drizzle-orm/pg-core';
import { exams } from './exams';

// Enum for question types
export const questionTypeEnum = pgEnum('question_type', [
  'multiple_choice',
  'single_choice',
  'text'
]);

export const questions = pgTable('questions', {
  id: uuid('id').primaryKey().defaultRandom(),
  examId: uuid('exam_id').references(() => exams.id, { onDelete: 'cascade' }),
  text: text('text').notNull(),
  image: text('image'), // URL to image (optional)
  type: questionTypeEnum('type').notNull(),
  options: jsonb('options'), // Stored as JSON array of options
  correctAnswer: text('correct_answer'), // For text questions or ID of correct option
  marks: integer('marks').notNull().default(1),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Types for TypeScript
export type Question = typeof questions.$inferSelect;
export type NewQuestion = typeof questions.$inferInsert;

// Option type for frontend compatibility
export interface QuestionOption {
  id: string;
  text: string;
  isCorrect: boolean;
}
