export enum Roles {
	SUPER_ADMIN = 'super_admin',
	TENANT_ADMIN = 'tenant_admin',
	SPECIALIST = 'specialist',
	CLIENT = 'client',
}

export type Role = (typeof Roles)[keyof typeof Roles];
