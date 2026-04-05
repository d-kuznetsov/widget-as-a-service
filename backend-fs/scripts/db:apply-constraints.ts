import '@dotenvx/dotenvx/config';
import { sql } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/node-postgres';

async function applyDatabaseConstraints() {
	const databaseUrl = process.env.DATABASE_URL;
	if (!databaseUrl) {
		throw new Error('DATABASE_URL environment variable is required');
	}

	const db = drizzle(databaseUrl);
	try {
		console.log('Applying custom PostgreSQL constraints...');

		await db.execute(sql`CREATE EXTENSION IF NOT EXISTS btree_gist;`);

		await db.execute(sql`
      DO $$ 
      BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'timerange') THEN
          CREATE TYPE timerange AS RANGE (subtype = time);
        END IF;
      END;
      $$;
    `);

		await db.execute(sql`
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM pg_constraint 
          WHERE conname = 'no_overlapping_exceptions'
        ) THEN
          ALTER TABLE "exceptions"
          ADD CONSTRAINT "no_overlapping_exceptions"
          EXCLUDE USING gist (
            "specialist_id" WITH =,
            "date" WITH =,
            timerange("start_time", "end_time") WITH &&
          );
        END IF;
      END;
      $$;
    `);

		await db.execute(sql`
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM pg_constraint
          WHERE conname = 'no_overlapping_appointments'
        ) THEN
          ALTER TABLE "appointments"
          ADD CONSTRAINT "no_overlapping_appointments"
          EXCLUDE USING gist (
            "specialist_id" WITH =,
            "date" WITH =,
            timerange("start_time", "end_time") WITH &&
          )
          WHERE ("status" <> 'canceled');
        END IF;
      END;
      $$;
    `);

		console.log('✅ Exclusion constraints applied successfully!');
		process.exit(0);
	} catch (error) {
		console.error('❌ Failed to apply custom SQL:', error);
		process.exit(1);
	}
}

applyDatabaseConstraints();
