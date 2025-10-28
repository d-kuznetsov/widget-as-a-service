export interface SeedConfig {
	roles: boolean;
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
	console.log('env', env);

	switch (env) {
		case 'production':
			return {
				roles: true,
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
				roles: true,
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
				roles: true,
				users: true,
				tenants: true,
				services: false,
				specialists: false,
				workingHours: false,
				appointments: false,
				exceptions: false,

				clearBeforeSeed: false,
			};
	}
};
