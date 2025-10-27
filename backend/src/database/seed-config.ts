export interface SeedConfig {
	roles: boolean;
	users: boolean;
	services: boolean;
	specialists: boolean;
	workingHours: boolean;
	appointments: boolean;
	clearBeforeSeed: boolean;
}

export const getSeedConfig = (): SeedConfig => {
	const env = process.env.NODE_ENV || 'development';

	switch (env) {
		case 'production':
			return {
				roles: true,
				users: false, // Don't seed users in production
				services: true,
				specialists: true,
				workingHours: true,
				appointments: false, // Don't seed appointments in production
				clearBeforeSeed: false,
			};
		case 'test':
			return {
				roles: true,
				users: true,
				services: true,
				specialists: true,
				workingHours: true,
				appointments: true,
				clearBeforeSeed: true, // Always clear in test
			};
		default:
			return {
				roles: true,
				users: true,
				services: true,
				specialists: true,
				workingHours: true,
				appointments: true,
				clearBeforeSeed: false,
			};
	}
};
