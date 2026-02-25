import { Tenant } from '../../db/schema';
import { ServiceError } from '../../shared/errors';
import { TenantRepository } from './tenant.repository';
import { TenantCreateInput, TenantUpdateInput } from './tenant.schema';

export interface TenantService {
	create: (input: TenantCreateInput) => Promise<Tenant>;
	findOne: (id: number) => Promise<Tenant>;
	findAll: () => Promise<Tenant[]>;
	update: (id: number, input: TenantUpdateInput) => Promise<Tenant>;
	delete: (id: number) => Promise<Tenant>;
}

export function createTenantService(repo: TenantRepository): TenantService {
	return {
		create: async (input: TenantCreateInput) => {
			return repo.create(input);
		},
		findOne: async (id: number) => {
			const tenant = await repo.findOne(id);
			if (!tenant) {
				throw ServiceError.createTenantNotFound();
			}
			return tenant;
		},
		findAll: async () => {
			return repo.findAll();
		},
		update: async (id: number, input: TenantUpdateInput) => {
			const tenant = await repo.update(id, input);
			if (!tenant) {
				throw ServiceError.createTenantNotFound();
			}
			return tenant;
		},
		delete: async (id: number) => {
			const tenant = await repo.delete(id);
			if (!tenant) {
				throw ServiceError.createTenantNotFound();
			}
			return tenant;
		},
	};
}
