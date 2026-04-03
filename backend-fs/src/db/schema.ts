import {
	boolean,
	foreignKey,
	integer,
	numeric,
	pgTable,
	text,
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
	isSuperAdmin: boolean('is_super_admin').notNull().default(false),
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

export const tenantsTable = pgTable('tenants', {
	id: integer().primaryKey().generatedAlwaysAsIdentity(),
	name: varchar('name', { length: 255 }).notNull(),
	slug: varchar('slug', { length: 100 }).notNull().unique(),
	address: varchar('address', { length: 255 }),
	timezone: varchar('timezone', { length: 50 }).notNull().default('UTC'),
	...timestamps,
});

export type NewTenant = typeof tenantsTable.$inferInsert;
export type Tenant = typeof tenantsTable.$inferSelect;

export const refreshTokensTable = pgTable(
	'refresh_tokens',
	{
		id: integer().primaryKey().generatedAlwaysAsIdentity(),
		userId: integer('user_id')
			.notNull()
			.references(() => usersTable.id, { onDelete: 'cascade' }),
		tenantId: integer('tenant_id').references(() => tenantsTable.id, {
			onDelete: 'cascade',
		}),
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

export const specialistsTable = pgTable(
	'specialists',
	{
		id: integer().primaryKey().generatedAlwaysAsIdentity(),
		tenantId: integer('tenant_id')
			.notNull()
			.references(() => tenantsTable.id, { onDelete: 'cascade' }),
		userId: integer('user_id').references(() => usersTable.id, {
			onDelete: 'cascade',
		}),
		name: varchar('name', { length: 255 }).notNull(),
		description: text('description').notNull().default(''),
		...timestamps,
	},
	(table) => [unique().on(table.tenantId, table.userId)]
);

export type NewSpecialist = typeof specialistsTable.$inferInsert;
export type Specialist = typeof specialistsTable.$inferSelect;

export const invitesTable = pgTable(
	'invites',
	{
		id: integer().primaryKey().generatedAlwaysAsIdentity(),
		tenantId: integer('tenant_id')
			.notNull()
			.references(() => tenantsTable.id, { onDelete: 'cascade' }),
		email: varchar('email', { length: 255 }).notNull(),
		token: varchar('token', { length: 255 }).notNull(),
		roleId: integer('role')
			.notNull()
			.references(() => rolesTable.id, { onDelete: 'cascade' }),
		specialistId: integer('specialist_id').references(
			() => specialistsTable.id,
			{ onDelete: 'cascade' }
		),
		expiresAt: timestamp('expires_at').notNull(),
		used: boolean('used').notNull().default(false),
		createdAt: timestamps.createdAt,
	},
	(table) => [unique().on(table.tenantId, table.email)]
);

export type NewInvite = typeof invitesTable.$inferInsert;
export type Invite = typeof invitesTable.$inferSelect;

export const tenantUserRolesTable = pgTable(
	'tenant_user_roles',
	{
		id: integer().primaryKey().generatedAlwaysAsIdentity(),
		tenantId: integer('tenant_id')
			.notNull()
			.references(() => tenantsTable.id, { onDelete: 'cascade' }),
		userId: integer('user_id')
			.notNull()
			.references(() => usersTable.id, { onDelete: 'cascade' }),
		...timestamps,
		roleId: integer('role_id')
			.notNull()
			.references(() => rolesTable.id, { onDelete: 'cascade' }),
	},
	(table) => [unique().on(table.tenantId, table.userId)]
);

export type NewTenantMember = typeof tenantUserRolesTable.$inferInsert;
export type TenantMember = typeof tenantUserRolesTable.$inferSelect;

export const servicesTable = pgTable('services', {
	id: integer().primaryKey().generatedAlwaysAsIdentity(),
	tenantId: integer('tenant_id')
		.notNull()
		.references(() => tenantsTable.id, { onDelete: 'cascade' }),
	name: varchar('name', { length: 255 }).notNull(),
	duration: integer('duration').notNull(),
	price: numeric('price').notNull(),
	...timestamps,
});

export type NewService = typeof servicesTable.$inferInsert;
export type Service = typeof servicesTable.$inferSelect;

export const serviceSpecialistsTable = pgTable(
	'service_specialists',
	{
		id: integer().primaryKey().generatedAlwaysAsIdentity(),
		tenantId: integer('tenant_id')
			.notNull()
			.references(() => tenantsTable.id, { onDelete: 'cascade' }),
		serviceId: integer('service_id')
			.notNull()
			.references(() => servicesTable.id, { onDelete: 'cascade' }),
		specialistId: integer('specialist_id')
			.notNull()
			.references(() => specialistsTable.id, { onDelete: 'cascade' }),
		...timestamps,
	},
	(table) => [unique().on(table.serviceId, table.specialistId)]
);

export type NewServiceSpecialist = typeof serviceSpecialistsTable.$inferInsert;
export type ServiceSpecialist = typeof serviceSpecialistsTable.$inferSelect;
