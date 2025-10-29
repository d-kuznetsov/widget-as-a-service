// src/roles/roles.service.ts
import { Injectable } from '@nestjs/common';
import { ROLES, RoleName } from './role.constants';

export interface RoleInfo {
	name: RoleName;
	description: string;
}

@Injectable()
export class RolesService {
	private readonly roleDescriptions: Record<RoleName, string> = {
		[ROLES.SUPER_ADMIN]:
			'Super administrator with full system access across all tenants',
		[ROLES.TENANT_ADMIN]:
			'Tenant administrator with full access within their tenant',
		[ROLES.SPECIALIST]:
			'Specialist with access to manage appointments and services',
		[ROLES.CLIENT]: 'Client with basic access to book appointments',
	};

	async findAll(): Promise<RoleInfo[]> {
		return Object.values(ROLES).map((name) => ({
			name,
			description: this.roleDescriptions[name],
		}));
	}

	async findByName(name: string): Promise<RoleInfo | null> {
		if (Object.values(ROLES).includes(name as RoleName)) {
			return {
				name: name as RoleName,
				description: this.roleDescriptions[name as RoleName],
			};
		}
		return null;
	}

	async validateRole(roleName: string): Promise<boolean> {
		return Object.values(ROLES).includes(roleName as RoleName);
	}

	async validateRoles(roleNames: string[]): Promise<boolean> {
		return roleNames.every((role) => this.validateRole(role));
	}
}
