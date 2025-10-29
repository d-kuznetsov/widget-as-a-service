export interface SeedConfig {
	users: boolean;
	services: boolean;
	specialists: boolean;
	workingHours: boolean;
	appointments: boolean;
	exceptions: boolean;
	tenants: boolean;
	clearBeforeSeed: boolean;
}

export const getSeedConfig = (): SeedConfig => {
	const env = process.env.NODE_ENV || 'development';

	switch (env) {
		case 'production':
			return {
				users: false, // Don't seed users in production
				tenants: true,
				services: true,
				specialists: true,
				workingHours: true,
				appointments: false, // Don't seed appointments in production
				exceptions: false, // Don't seed exceptions in production
				clearBeforeSeed: false,
			};
		case 'test':
			return {
				users: true,
				tenants: true,
				services: true,
				specialists: true,
				workingHours: true,
				appointments: true,
				exceptions: true,
				clearBeforeSeed: true, // Always clear in test
			};
		default:
			return {
				users: false,
				tenants: false,
				services: false,
				specialists: false,
				workingHours: false,
				exceptions: false,
				appointments: false,
				clearBeforeSeed: true,
			};
	}
};
