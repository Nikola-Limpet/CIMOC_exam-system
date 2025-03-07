import { pgTable, uuid, text, varchar, json, boolean } from 'drizzle-orm/pg-core';
import { exams } from './exams';

export const questions = pgTable('questions', {
  id: uuid('id').primaryKey().defaultRandom(),
  examId: uuid('exam_id').references(() => exams.id, { onDelete: 'cascade' }).notNull(),
  description: text('description').notNull(),
  imageUrl: varchar('image_url', { length: 1000 }),
  options: json('options').notNull(), // Array of options with their IDs and text
  correctOption: varchar('correct_option', { length: 255 }).notNull(), // ID of the correct option
  isActive: boolean('is_active').default(true),
});

// Types for TypeScript
export type Question = typeof questions.$inferSelect;
export type NewQuestion = typeof questions.$inferInsert;
