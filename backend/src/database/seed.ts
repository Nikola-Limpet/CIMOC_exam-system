import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import { ConfigService } from '@nestjs/config';
import * as dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';
import { hash } from 'bcryptjs';

// Load environment variables
dotenv.config();

export async function seedDatabase() {
  const configService = new ConfigService();
  const connectionString = configService.get<string>('DATABASE_URL');

  console.log('Starting database seeding...');

  const pool = new Pool({
    connectionString,
  });

  const db = drizzle(pool);

  try {
    // Create admin user
    const adminId = uuidv4();
    const adminPassword = await hash('admin123', 10);
    await pool.query(`
      INSERT INTO users (id, name, email, password, roles)
      VALUES ('${adminId}', 'Admin User', 'admin@example.com', '${adminPassword}', '["admin"]')
      ON CONFLICT (email) DO NOTHING;
    `);
    console.log('Admin user created');

    // Create regular users
    const studentIds = [];
    for (let i = 1; i <= 5; i++) {
      const studentId = uuidv4();
      const studentPassword = await hash(`student${i}`, 10);
      await pool.query(`
        INSERT INTO users (id, name, email, password, roles)
        VALUES ('${studentId}', 'Student ${i}', 'student${i}@example.com', '${studentPassword}', '["user"]')
        ON CONFLICT (email) DO NOTHING;
      `);
      studentIds.push(studentId);
    }
    console.log('Student users created');

    // Create exams
    const mathExamId = uuidv4();
    const scienceExamId = uuidv4();

    await pool.query(`
      INSERT INTO exams (id, title, description, created_by, status, duration)
      VALUES ('${mathExamId}', 'Mathematics Exam', 'A comprehensive test of math skills', '${adminId}', 'published', 60)
      ON CONFLICT DO NOTHING;
    `);

    await pool.query(`
      INSERT INTO exams (id, title, description, created_by, status, duration)
      VALUES ('${scienceExamId}', 'Science Quiz', 'Test your knowledge of basic science concepts', '${adminId}', 'draft', 45)
      ON CONFLICT DO NOTHING;
    `);
    console.log('Exams created');

    // Create time blocks - Update to match new schema
    const now = new Date();
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
    const oneHourLater = new Date(now.getTime() + 60 * 60 * 1000);
    const twoDaysLater = new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000);
    const threeDaysLater = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);

    // Current active time block for math exam
    await pool.query(`
      INSERT INTO time_blocks (id, exam_id, start_time, end_time, duration)
      VALUES ('${uuidv4()}', '${mathExamId}', '${oneHourAgo.toISOString()}', '${oneHourLater.toISOString()}', 60)
      ON CONFLICT DO NOTHING;
    `);

    // Also update availableFrom and availableTo in the exams table for the math exam
    await pool.query(`
      UPDATE exams 
      SET available_from = '${oneHourAgo.toISOString()}', available_to = '${oneHourLater.toISOString()}'
      WHERE id = '${mathExamId}';
    `);

    // Future time block for science exam
    await pool.query(`
      INSERT INTO time_blocks (id, exam_id, start_time, end_time, duration)
      VALUES ('${uuidv4()}', '${scienceExamId}', '${twoDaysLater.toISOString()}', '${threeDaysLater.toISOString()}', 45)
      ON CONFLICT DO NOTHING;
    `);

    // Also update availableFrom and availableTo in the exams table for the science exam
    await pool.query(`
      UPDATE exams 
      SET available_from = '${twoDaysLater.toISOString()}', available_to = '${threeDaysLater.toISOString()}'
      WHERE id = '${scienceExamId}';
    `);

    console.log('Time blocks created');

    // Create math exam questions - Updated to match schema
    const mathQuestions = [
      {
        id: uuidv4(),
        text: 'What is 2 + 2?',
        type: 'single_choice',
        options: JSON.stringify([
          { id: '1', text: '3', isCorrect: false },
          { id: '2', text: '4', isCorrect: true },
          { id: '3', text: '5', isCorrect: false },
          { id: '4', text: '6', isCorrect: false }
        ]),
        correctAnswer: '2'
      },
      {
        id: uuidv4(),
        text: 'Solve for x: 3x - 6 = 9',
        type: 'single_choice',
        options: JSON.stringify([
          { id: '1', text: '3', isCorrect: false },
          { id: '2', text: '5', isCorrect: true },
          { id: '3', text: '6', isCorrect: false },
          { id: '4', text: '15', isCorrect: false }
        ]),
        correctAnswer: '2'
      },
      {
        id: uuidv4(),
        text: 'What is the area of a rectangle with length 5 and width 3?',
        type: 'single_choice',
        options: JSON.stringify([
          { id: '1', text: '8', isCorrect: false },
          { id: '2', text: '15', isCorrect: true },
          { id: '3', text: '16', isCorrect: false },
          { id: '4', text: '18', isCorrect: false }
        ]),
        correctAnswer: '2'
      }
    ];

    for (const question of mathQuestions) {
      await pool.query(`
        INSERT INTO questions (id, exam_id, text, type, options, correct_answer, marks)
        VALUES ('${question.id}', '${mathExamId}', '${question.text}', '${question.type}', '${question.options}', '${question.correctAnswer}', 1)
        ON CONFLICT DO NOTHING;
      `);
    }

    // Update total questions count for math exam
    await pool.query(`
      UPDATE exams 
      SET total_questions = ${mathQuestions.length}
      WHERE id = '${mathExamId}';
    `);

    // Create science exam questions - Updated to match schema
    const scienceQuestions = [
      {
        id: uuidv4(),
        text: 'Which planet is known as the Red Planet?',
        type: 'single_choice',
        options: JSON.stringify([
          { id: '1', text: 'Venus', isCorrect: false },
          { id: '2', text: 'Mars', isCorrect: true },
          { id: '3', text: 'Jupiter', isCorrect: false },
          { id: '4', text: 'Saturn', isCorrect: false }
        ]),
        correctAnswer: '2'
      },
      {
        id: uuidv4(),
        text: 'What is the chemical symbol for water?',
        type: 'single_choice',
        options: JSON.stringify([
          { id: '1', text: 'HO', isCorrect: false },
          { id: '2', text: 'H2O', isCorrect: true },
          { id: '3', text: 'CO2', isCorrect: false },
          { id: '4', text: 'O2', isCorrect: false }
        ]),
        correctAnswer: '2'
      }
    ];

    for (const question of scienceQuestions) {
      await pool.query(`
        INSERT INTO questions (id, exam_id, text, type, options, correct_answer, marks)
        VALUES ('${question.id}', '${scienceExamId}', '${question.text}', '${question.type}', '${question.options}', '${question.correctAnswer}', 1)
        ON CONFLICT DO NOTHING;
      `);
    }

    // Update total questions count for science exam
    await pool.query(`
      UPDATE exams 
      SET total_questions = ${scienceQuestions.length}
      WHERE id = '${scienceExamId}';
    `);

    console.log('Exam questions created');

    // Create access keys
    for (let i = 1; i <= 10; i++) {
      const mathKey = `MATH${i.toString().padStart(3, '0')}`;
      const scienceKey = `SCIENCE${i.toString().padStart(3, '0')}`;

      await pool.query(`
        INSERT INTO access_keys (id, exam_id, key)
        VALUES ('${uuidv4()}', '${mathExamId}', '${mathKey}')
        ON CONFLICT DO NOTHING;
      `);

      await pool.query(`
        INSERT INTO access_keys (id, exam_id, key)
        VALUES ('${uuidv4()}', '${scienceExamId}', '${scienceKey}')
        ON CONFLICT DO NOTHING;
      `);
    }
    console.log('Access keys created');

    // Create submissions for the math exam - Make sure this matches the submissions table structure
    // Student 1 submission (correct answers)
    const submission1Id = uuidv4();
    await pool.query(`
      INSERT INTO submissions (id, user_id, exam_id, answers, submitted_at, status)
      VALUES (
        '${submission1Id}',
        '${studentIds[0]}',
        '${mathExamId}',
        '{"${mathQuestions[0].id}":"2", "${mathQuestions[1].id}":"2", "${mathQuestions[2].id}":"2"}',
        '${new Date().toISOString()}',
        'submitted'
      )
      ON CONFLICT DO NOTHING;
    `);

    // Student 2 submission (some wrong answers)
    const submission2Id = uuidv4();
    await pool.query(`
      INSERT INTO submissions (id, user_id, exam_id, answers, submitted_at, status)
      VALUES (
        '${submission2Id}',
        '${studentIds[1]}',
        '${mathExamId}',
        '{"${mathQuestions[0].id}":"2", "${mathQuestions[1].id}":"1", "${mathQuestions[2].id}":"3"}',
        '${new Date().toISOString()}',
        'submitted'
      )
      ON CONFLICT DO NOTHING;
    `);

    // Student 3 submission (already graded)
    const submission3Id = uuidv4();
    await pool.query(`
      INSERT INTO submissions (id, user_id, exam_id, answers, submitted_at, status, score, feedback, grader_id, graded_at)
      VALUES (
        '${submission3Id}',
        '${studentIds[2]}',
        '${mathExamId}',
        '{"${mathQuestions[0].id}":"2", "${mathQuestions[1].id}":"2", "${mathQuestions[2].id}":"1"}',
        '${new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()}',
        'graded',
        66,
        'Good attempt, but check your work on the area calculation',
        '${adminId}',
        '${new Date().toISOString()}'
      )
      ON CONFLICT DO NOTHING;
    `);

    // Update participants count in the exams table
    await pool.query(`
      UPDATE exams 
      SET participants = 3
      WHERE id = '${mathExamId}';
    `);

    console.log('Submissions created');

    console.log('Database seeding completed successfully');
  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  } finally {
    await pool.end();
  }
}

// Run seeding directly if this file is executed directly
if (require.main === module) {
  seedDatabase()
    .then(() => {
      console.log('Seeding script completed successfully');
      process.exit(0);
    })
    .catch((err) => {
      console.error('Seeding failed:', err);
      process.exit(1);
    });
}
