import { integer, pgTable, timestamp, varchar } from 'drizzle-orm/pg-core';

const timestamps = {
	created_at: timestamp().defaultNow().notNull(),
	updated_at: timestamp().defaultNow().notNull(),
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
