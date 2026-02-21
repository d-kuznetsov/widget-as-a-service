import {
	foreignKey,
	integer,
	pgTable,
	timestamp,
	unique,
	varchar,
} from 'drizzle-orm/pg-core';

const timestamps = {
	createdAt: timestamp('created_at').defaultNow().notNull(),
	updatedAt: timestamp('updated_at').defaultNow().notNull(),
};

export const usersTable = pgTable('users', {
	id: integer().primaryKey().generatedAlwaysAsIdentity(),
	email: varchar('email', { length: 255 }).notNull().unique(),
	passwordHash: varchar('password_hash', { length: 255 }).notNull(),
	firstName: varchar('first_name', { length: 255 }).notNull(),
	lastName: varchar('last_name', { length: 255 }).notNull(),
	phone: varchar('phone', { length: 20 }).unique(),
	timezone: varchar('timezone', { length: 50 })
		.notNull()
		.default('Europe/Berlin'),
	locale: varchar('locale', { length: 10 }).notNull().default('de-DE'),
	status: varchar('status', { length: 20 }).notNull().default('active'),
	lastLoginAt: timestamp('last_login_at'),
	...timestamps,
});

export type NewUser = typeof usersTable.$inferInsert;
export type User = typeof usersTable.$inferSelect;

export const rolesTable = pgTable('roles', {
	id: integer().primaryKey().generatedAlwaysAsIdentity(),
	name: varchar('name', { length: 255 }).notNull().unique(),
	description: varchar('description', { length: 255 }),
	...timestamps,
});

export const userRolesTable = pgTable(
	'user_roles',
	{
		id: integer().primaryKey().generatedAlwaysAsIdentity(),
		userId: integer()
			.notNull()
			.references(() => usersTable.id, { onDelete: 'cascade' }),
		roleId: integer()
			.notNull()
			.references(() => rolesTable.id, { onDelete: 'cascade' }),
		...timestamps,
	},
	(table) => [unique().on(table.userId, table.roleId)]
);

export const refreshTokensTable = pgTable(
	'refresh_tokens',
	{
		id: integer().primaryKey().generatedAlwaysAsIdentity(),
		userId: integer()
			.notNull()
			.references(() => usersTable.id, { onDelete: 'cascade' }),
		token: varchar('token_hash', { length: 1024 }).notNull(),
		expiresAt: timestamp('expires_at').notNull(),
		revokedAt: timestamp('revoked_at'),
		replacedBy: integer('replaced_by'),
		createdAt: timestamps.createdAt,
	},
	(table) => [
		foreignKey({
			columns: [table.replacedBy],
			foreignColumns: [table.id],
		}).onDelete('cascade'),
	]
);

export type NewRefreshToken = typeof refreshTokensTable.$inferInsert;
export type RefreshToken = typeof refreshTokensTable.$inferSelect;

export const tenantsTable = pgTable('tenants', {
	id: integer().primaryKey().generatedAlwaysAsIdentity(),
	name: varchar('name', { length: 255 }).notNull(),
	address: varchar('address', { length: 255 }),
	timezone: varchar('timezone', { length: 50 }).notNull().default('UTC'),
	...timestamps,
});

export type NewTenant = typeof tenantsTable.$inferInsert;
export type Tenant = typeof tenantsTable.$inferSelect;
