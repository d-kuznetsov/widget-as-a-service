import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

// @ts-expect-error - process.env is not defined in the global scope
const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
	throw new Error('DATABASE_URL environment variable is required');
}
export default defineConfig({
	out: './drizzle',
	schema: './src/db/schema.ts',
	dialect: 'postgresql',
	dbCredentials: {
		url: databaseUrl,
	},
});
