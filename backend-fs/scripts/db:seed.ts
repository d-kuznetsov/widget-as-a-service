import '@dotenvx/dotenvx/config';
import { drizzle } from 'drizzle-orm/node-postgres';

import { rolesTable } from '../src/db/schema';
import { Roles } from '../src/shared/utils/roles';

async function seed() {
	const databaseUrl = process.env.DATABASE_URL;
	if (!databaseUrl) {
		throw new Error('DATABASE_URL environment variable is required');
	}

	const db = drizzle(databaseUrl);
	const roles = Object.values(Roles).map((name) => ({
		name,
		description: `${name.replace('_', ' ')} role`,
	}));

	await db.insert(rolesTable).values(roles).onConflictDoNothing();
	console.log(`Seeded roles: ${roles.map((role) => role.name).join(', ')}`);
}

seed()
	.then(() => process.exit(0))
	.catch((error) => {
		console.error('Seeding failed:', error);
		process.exit(1);
	});
