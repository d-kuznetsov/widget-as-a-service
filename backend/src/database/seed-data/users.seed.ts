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
		password: 'admin123',
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
	{
		username: 'test_user',
		email: 'test@example.com',
		password: 'test123',
		roleNames: ['user', 'guest'], // Multiple roles example
	},
];
