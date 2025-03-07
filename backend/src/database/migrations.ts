import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { ConfigService } from '@nestjs/config';
import * as dotenv from 'dotenv';
import * as schema from './schema';
import { sql } from 'drizzle-orm';

// Load environment variables
dotenv.config();

export async function runMigrations() {
  const configService = new ConfigService();
  const connectionString = configService.get<string>('DATABASE_URL');

  console.log('Starting database migrations...');

  const pool = new Pool({
    connectionString,
  });

  const db = drizzle(pool);

  try {
    // First try the migration approach
    console.log('Attempting to run migrations from files...');
    await migrate(db, { migrationsFolder: 'drizzle' });
    console.log('Migrations completed successfully');
  } catch (error) {
    console.error('Error running migrations:', error.message);

    // Fallback to direct schema push if migrations fail
    console.log('Falling back to direct schema push...');
    try {
      // Create schema if it doesn't exist
      await db.execute(sql`CREATE SCHEMA IF NOT EXISTS public`);

      // Push schema directly to database (this will create/alter tables)
      await pushSchema(db, pool);

      console.log('Schema push completed successfully');
    } catch (pushError) {
      console.error('Schema push also failed:', pushError);
      throw pushError;
    }
  } finally {
    await pool.end();
  }
}

async function pushSchema(db: any, pool: Pool) {
  // Create users table
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      roles JSONB NOT NULL DEFAULT '["user"]',
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    );
  `);

  // Create exams table
  await pool.query(`
    CREATE TABLE IF NOT EXISTS exams (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      title VARCHAR(255) NOT NULL,
      description TEXT,
      created_by UUID REFERENCES users(id),
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    );
  `);

  // Create questions table
  await pool.query(`
    CREATE TABLE IF NOT EXISTS questions (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      exam_id UUID NOT NULL REFERENCES exams(id) ON DELETE CASCADE,
      description TEXT NOT NULL,
      image_url VARCHAR(1000),
      options JSONB NOT NULL,
      correct_option VARCHAR(255) NOT NULL,
      is_active BOOLEAN DEFAULT TRUE
    );
  `);

  // Create time_blocks table if it doesn't exist
  await pool.query(`
    CREATE TABLE IF NOT EXISTS time_blocks (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      exam_id UUID NOT NULL REFERENCES exams(id) ON DELETE CASCADE,
      start_time TIMESTAMP NOT NULL,
      end_time TIMESTAMP NOT NULL
    );
  `);

  // Create access_keys table if it doesn't exist
  await pool.query(`
    CREATE TABLE IF NOT EXISTS access_keys (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      exam_id UUID NOT NULL REFERENCES exams(id) ON DELETE CASCADE,
      key VARCHAR(255) NOT NULL UNIQUE,
      revoked BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMP DEFAULT NOW()
    );
  `);

  // Create submissions table if it doesn't exist
  await pool.query(`
    CREATE TABLE IF NOT EXISTS submissions (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID REFERENCES users(id),
      exam_id UUID REFERENCES exams(id) ON DELETE CASCADE,
      answers JSONB NOT NULL,
      submitted_at TIMESTAMP NOT NULL,
      status VARCHAR(50) NOT NULL DEFAULT 'submitted',
      score INTEGER,
      feedback VARCHAR(1000),
      question_scores JSONB,
      grader_id UUID REFERENCES users(id),
      graded_at TIMESTAMP
    );
  `);
}

// Run migrations directly if this file is executed directly
if (require.main === module) {
  runMigrations()
    .then(() => {
      console.log('Migration script completed successfully');
      process.exit(0);
    })
    .catch((err) => {
      console.error('Migration failed:', err);
      process.exit(1);
    });
}
