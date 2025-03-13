import { drizzle } from 'drizzle-orm/node-postgres';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { Pool } from 'pg';
import * as dotenv from 'dotenv';
import { join } from 'path';

// Load environment variables
dotenv.config();

const runMigration = async () => {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL environment variable is not defined');
  }

  console.log('Running migrations...');

  // Create a PostgreSQL connection pool
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false, // Required for Neon PostgreSQL
    },
  });

  // Create Drizzle instance
  const db = drizzle(pool);

  // Change this line to point to the correct directory
  await migrate(db, { migrationsFolder: join(__dirname, '../../drizzle') });

  console.log('Migrations completed successfully');

  // Close the pool
  await pool.end();
};

runMigration().catch((err) => {
  console.error('Migration failed:', err);
  process.exit(1);
});