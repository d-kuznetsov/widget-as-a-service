export interface SeedConfig {
	roles: boolean;
	users: boolean;
	clearBeforeSeed: boolean;
}

export const getSeedConfig = (): SeedConfig => {
	const env = process.env.NODE_ENV || 'development';

	switch (env) {
		case 'production':
			return {
				roles: true,
				users: false, // Don't seed users in production
				clearBeforeSeed: false,
			};
		case 'test':
			return {
				roles: true,
				users: true,
				clearBeforeSeed: true, // Always clear in test
			};
		default:
			return {
				roles: true,
				users: true,
				clearBeforeSeed: false,
			};
	}
};
