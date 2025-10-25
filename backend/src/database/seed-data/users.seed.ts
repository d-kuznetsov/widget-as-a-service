export interface UserSeedData {
	username: string;
	email: string;
	password: string;
	roleNames: string[];
}

export const usersSeedData: UserSeedData[] = [
	{
		username: 'admin',
		email: 'admin@example.com',
		password: process.env.ADMIN_PASSWORD || 'SecureAdminPassword123!',
		roleNames: ['admin'],
	},
	{
		username: 'john_doe',
		email: 'john.doe@example.com',
		password: 'user123',
		roleNames: ['user'],
	},
	{
		username: 'jane_moderator',
		email: 'jane.moderator@example.com',
		password: 'mod123',
		roleNames: ['moderator'],
	},
];
