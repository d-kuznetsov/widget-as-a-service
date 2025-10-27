export interface UserSeedData {
	username: string;
	email: string;
	password: string;
	roleNames: string[];
}

export const usersSeedData: UserSeedData[] = [
	{
		username: 'super_admin',
		email: 'superadmin@example.com',
		password: process.env.ADMIN_PASSWORD || 'SecureAdminPassword123!',
		roleNames: ['super_admin'],
	},
	{
		username: 'tenant_admin',
		email: 'tenantadmin@example.com',
		password: 'tenant123',
		roleNames: ['tenant_admin'],
	},
	{
		username: 'dr_smith',
		email: 'dr.smith@example.com',
		password: 'specialist123',
		roleNames: ['specialist'],
	},
	{
		username: 'dr_johnson',
		email: 'dr.johnson@example.com',
		password: 'specialist456',
		roleNames: ['specialist'],
	},
	{
		username: 'john_doe',
		email: 'john.doe@example.com',
		password: 'user123',
		roleNames: ['client'],
	},
	{
		username: 'alice_smith',
		email: 'alice.smith@example.com',
		password: 'alice123',
		roleNames: ['client'],
	},
	{
		username: 'bob_wilson',
		email: 'bob.wilson@example.com',
		password: 'bob123',
		roleNames: ['client'],
	},
	{
		username: 'carol_davis',
		email: 'carol.davis@example.com',
		password: 'carol123',
		roleNames: ['client'],
	},
	{
		username: 'david_brown',
		email: 'david.brown@example.com',
		password: 'david123',
		roleNames: ['client'],
	},
	{
		username: 'emma_jones',
		email: 'emma.jones@example.com',
		password: 'emma123',
		roleNames: ['client'],
	},
	{
		username: 'frank_miller',
		email: 'frank.miller@example.com',
		password: 'frank123',
		roleNames: ['client'],
	},
	{
		username: 'grace_taylor',
		email: 'grace.taylor@example.com',
		password: 'grace123',
		roleNames: ['client'],
	},
	{
		username: 'henry_anderson',
		email: 'henry.anderson@example.com',
		password: 'henry123',
		roleNames: ['client'],
	},
	{
		username: 'iris_thomas',
		email: 'iris.thomas@example.com',
		password: 'iris123',
		roleNames: ['client'],
	},
	{
		username: 'jack_garcia',
		email: 'jack.garcia@example.com',
		password: 'jack123',
		roleNames: ['client'],
	},
	{
		username: 'karen_martinez',
		email: 'karen.martinez@example.com',
		password: 'karen123',
		roleNames: ['client'],
	},
	{
		username: 'leo_rodriguez',
		email: 'leo.rodriguez@example.com',
		password: 'leo123',
		roleNames: ['client'],
	},
	{
		username: 'mary_lee',
		email: 'mary.lee@example.com',
		password: 'mary123',
		roleNames: ['client'],
	},
	{
		username: 'nick_perez',
		email: 'nick.perez@example.com',
		password: 'nick123',
		roleNames: ['client'],
	},
	{
		username: 'olivia_white',
		email: 'olivia.white@example.com',
		password: 'olivia123',
		roleNames: ['client'],
	},
	{
		username: 'paul_harris',
		email: 'paul.harris@example.com',
		password: 'paul123',
		roleNames: ['client'],
	},
	{
		username: 'quinn_clark',
		email: 'quinn.clark@example.com',
		password: 'quinn123',
		roleNames: ['client'],
	},
];
