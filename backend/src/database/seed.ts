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
      INSERT INTO exams (id, title, description, created_by)
      VALUES ('${mathExamId}', 'Mathematics Exam', 'A comprehensive test of math skills', '${adminId}')
      ON CONFLICT DO NOTHING;
    `);

    await pool.query(`
      INSERT INTO exams (id, title, description, created_by)
      VALUES ('${scienceExamId}', 'Science Quiz', 'Test your knowledge of basic science concepts', '${adminId}')
      ON CONFLICT DO NOTHING;
    `);
    console.log('Exams created');

    // Create time blocks
    const now = new Date();
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
    const oneHourLater = new Date(now.getTime() + 60 * 60 * 1000);
    const twoDaysLater = new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000);
    const threeDaysLater = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);

    // Current active time block for math exam
    await pool.query(`
      INSERT INTO time_blocks (id, exam_id, start_time, end_time)
      VALUES ('${uuidv4()}', '${mathExamId}', '${oneHourAgo.toISOString()}', '${oneHourLater.toISOString()}')
      ON CONFLICT DO NOTHING;
    `);

    // Future time block for science exam
    await pool.query(`
      INSERT INTO time_blocks (id, exam_id, start_time, end_time)
      VALUES ('${uuidv4()}', '${scienceExamId}', '${twoDaysLater.toISOString()}', '${threeDaysLater.toISOString()}')
      ON CONFLICT DO NOTHING;
    `);
    console.log('Time blocks created');

    // Create math exam questions with MCQ options
    const mathQuestions = [
      {
        id: uuidv4(),
        description: 'What is 2 + 2?',
        options: JSON.stringify([
          { id: '1', text: '3' },
          { id: '2', text: '4' },
          { id: '3', text: '5' },
          { id: '4', text: '6' }
        ]),
        correctOption: '2'
      },
      {
        id: uuidv4(),
        description: 'Solve for x: 3x - 6 = 9',
        options: JSON.stringify([
          { id: '1', text: '3' },
          { id: '2', text: '5' },
          { id: '3', text: '6' },
          { id: '4', text: '15' }
        ]),
        correctOption: '2'
      },
      {
        id: uuidv4(),
        description: 'What is the area of a rectangle with length 5 and width 3?',
        options: JSON.stringify([
          { id: '1', text: '8' },
          { id: '2', text: '15' },
          { id: '3', text: '16' },
          { id: '4', text: '18' }
        ]),
        correctOption: '2'
      }
    ];

    for (const question of mathQuestions) {
      await pool.query(`
        INSERT INTO questions (id, exam_id, description, options, correct_option)
        VALUES ('${question.id}', '${mathExamId}', '${question.description}', '${question.options}', '${question.correctOption}')
        ON CONFLICT DO NOTHING;
      `);
    }

    // Create science exam questions
    const scienceQuestions = [
      {
        id: uuidv4(),
        description: 'Which planet is known as the Red Planet?',
        options: JSON.stringify([
          { id: '1', text: 'Venus' },
          { id: '2', text: 'Mars' },
          { id: '3', text: 'Jupiter' },
          { id: '4', text: 'Saturn' }
        ]),
        correctOption: '2'
      },
      {
        id: uuidv4(),
        description: 'What is the chemical symbol for water?',
        options: JSON.stringify([
          { id: '1', text: 'HO' },
          { id: '2', text: 'H2O' },
          { id: '3', text: 'CO2' },
          { id: '4', text: 'O2' }
        ]),
        correctOption: '2'
      }
    ];

    for (const question of scienceQuestions) {
      await pool.query(`
        INSERT INTO questions (id, exam_id, description, options, correct_option)
        VALUES ('${question.id}', '${scienceExamId}', '${question.description}', '${question.options}', '${question.correctOption}')
        ON CONFLICT DO NOTHING;
      `);
    }
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

    // Create submissions for the math exam
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
