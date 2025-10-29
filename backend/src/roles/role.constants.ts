export const ROLES = {
	SUPER_ADMIN: 'super_admin',
	TENANT_ADMIN: 'tenant_admin',
	SPECIALIST: 'specialist',
	CLIENT: 'client',
} as const;

export type RoleName = (typeof ROLES)[keyof typeof ROLES];
