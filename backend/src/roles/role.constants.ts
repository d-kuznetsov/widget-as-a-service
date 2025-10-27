// src/roles/role.constants.ts
export const ROLES = {
	SUPER_ADMIN: 'super_admin',
	TENANT_ADMIN: 'tenant_admin',
	SPECIALIST: 'specialist',
	CLIENT: 'client',
} as const;

export type RoleName = (typeof ROLES)[keyof typeof ROLES];

// Role hierarchy for permission checking
export const ROLE_HIERARCHY: Record<RoleName, RoleName[]> = {
	[ROLES.SUPER_ADMIN]: [
		ROLES.SUPER_ADMIN,
		ROLES.TENANT_ADMIN,
		ROLES.SPECIALIST,
		ROLES.CLIENT,
	],
	[ROLES.TENANT_ADMIN]: [ROLES.TENANT_ADMIN, ROLES.SPECIALIST, ROLES.CLIENT],
	[ROLES.SPECIALIST]: [ROLES.SPECIALIST, ROLES.CLIENT],
	[ROLES.CLIENT]: [ROLES.CLIENT],
};

// Helper function to check if a role has permission for another role
export function hasRolePermission(
	userRole: RoleName,
	requiredRole: RoleName
): boolean {
	return ROLE_HIERARCHY[userRole]?.includes(requiredRole) || false;
}
