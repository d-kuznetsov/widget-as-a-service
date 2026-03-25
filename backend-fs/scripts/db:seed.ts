import '@dotenvx/dotenvx/config';
import { eq } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/node-postgres';

import { rolesTable, usersTable } from '../src/db/schema';
import { hashPassword } from '../src/shared/utils/password';
import { Roles } from '../src/shared/utils/roles';

type Db = ReturnType<typeof drizzle>;

async function ensureRoles(db: Db) {
	const roles = Object.values(Roles).map((name) => ({
		name,
		description: `${name.replace('_', ' ')} role`,
	}));

	await db.insert(rolesTable).values(roles).onConflictDoNothing();
	console.log(`Seeded roles: ${roles.map((role) => role.name).join(', ')}`);
}

async function ensureSuperAdminUser(db: Db) {
	const email = process.env.SUPER_ADMIN_EMAIL?.trim();
	if (!email) {
		throw new Error('SUPER_ADMIN_EMAIL environment variable is required');
	}

	const [existing] = await db
		.select()
		.from(usersTable)
		.where(eq(usersTable.email, email))
		.limit(1);

	if (!existing) {
		const password = process.env.SUPER_ADMIN_PASSWORD?.trim();
		if (!password) {
			throw new Error(
				'SUPER_ADMIN_PASSWORD environment variable is required to create the super admin user'
			);
		}
		const passwordHash = await hashPassword(password);
		await db.insert(usersTable).values({
			email,
			passwordHash,
			firstName: 'Super',
			lastName: 'Admin',
			isSuperAdmin: true,
		});
		console.log(`Created super admin user: ${email}`);
		return;
	}

	if (!existing.isSuperAdmin) {
		await db
			.update(usersTable)
			.set({ isSuperAdmin: true })
			.where(eq(usersTable.id, existing.id));
		console.log(`Granted super admin to existing user: ${email}`);
		return;
	}

	console.log(`Super admin user already exists: ${email}`);
}

async function seed() {
	const databaseUrl = process.env.DATABASE_URL;
	if (!databaseUrl) {
		throw new Error('DATABASE_URL environment variable is required');
	}

	const db = drizzle(databaseUrl);
	await ensureRoles(db);
	await ensureSuperAdminUser(db);
}

seed()
	.then(() => process.exit(0))
	.catch((error) => {
		console.error('Seeding failed:', error);
		process.exit(1);
	});
