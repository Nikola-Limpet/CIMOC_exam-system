import { sql } from 'drizzle-orm';

export async function up(db) {
  // Add usage_count column to access_keys table if it doesn't exist
  await db.execute(
    sql`ALTER TABLE access_keys ADD COLUMN IF NOT EXISTS usage_count integer NOT NULL DEFAULT 0;`
  );

  // Add usage_limit column to access_keys table if it doesn't exist
  await db.execute(
    sql`ALTER TABLE access_keys ADD COLUMN IF NOT EXISTS usage_limit integer;`
  );
}

export async function down(db) {
  // Remove the columns if needed
  await db.execute(
    sql`ALTER TABLE access_keys DROP COLUMN IF EXISTS usage_count;`
  );

  await db.execute(
    sql`ALTER TABLE access_keys DROP COLUMN IF EXISTS usage_limit;`
  );
}
