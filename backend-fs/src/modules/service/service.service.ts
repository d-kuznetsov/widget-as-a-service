import { Service } from '../../db/schema';
import { DomainError } from '../../shared/errors';
import { ServiceRepository } from './service.repository';
import { ServiceCreateInput, ServiceUpdateInput } from './service.schema';

export interface ServiceService {
	create: (tenantId: number, input: ServiceCreateInput) => Promise<Service>;
	findOne: (id: number) => Promise<Service>;
	findAll: (tenantId: number) => Promise<Service[]>;
	update: (id: number, input: ServiceUpdateInput) => Promise<Service>;
	delete: (id: number) => Promise<Service>;
}

export function createServiceService(repo: ServiceRepository): ServiceService {
	return {
		create: async (tenantId: number, input: ServiceCreateInput) => {
			return repo.create(tenantId, input);
		},
		findOne: async (id: number) => {
			const service = await repo.findOne(id);
			if (!service) {
				throw DomainError.serviceNotFound();
			}
			return service;
		},
		findAll: async (tenantId: number) => {
			return repo.findAllByTenant(tenantId);
		},
		update: async (id: number, input: ServiceUpdateInput) => {
			const service = await repo.update(id, input);
			if (!service) {
				throw DomainError.serviceNotFound();
			}
			return service;
		},
		delete: async (id: number) => {
			const service = await repo.delete(id);
			if (!service) {
				throw DomainError.serviceNotFound();
			}
			return service;
		},
	};
}
