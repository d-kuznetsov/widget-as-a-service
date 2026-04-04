import { Service, ServiceSpecialist } from '../../db/schema';
import { DomainError } from '../../shared/errors';
import type { SpecialistRepository } from '../specialist/specialist.repository';
import { ServiceRepository } from './service.repository';
import { ServiceCreateInput, ServiceUpdateInput } from './service.schema';

export interface ServiceServiceDeps {
	repo: ServiceRepository;
	specialistRepo: SpecialistRepository;
}

export interface ServiceService {
	create: (tenantId: number, input: ServiceCreateInput) => Promise<Service>;
	findOne: (id: number) => Promise<Service>;
	findAll: (tenantId: number) => Promise<Service[]>;
	update: (id: number, input: ServiceUpdateInput) => Promise<Service>;
	delete: (id: number) => Promise<Service>;
	assignSpecialistToService: (
		tenantId: number,
		serviceId: number,
		specialistId: number
	) => Promise<ServiceSpecialist>;
	unassignSpecialistFromService: (
		tenantId: number,
		serviceId: number,
		specialistId: number
	) => Promise<ServiceSpecialist>;
}

export function createServiceService(deps: ServiceServiceDeps): ServiceService {
	const { repo, specialistRepo } = deps;
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
		assignSpecialistToService: async (
			tenantId: number,
			serviceId: number,
			specialistId: number
		) => {
			const service = await repo.findOne(serviceId);
			if (!service || service.tenantId !== tenantId) {
				throw DomainError.serviceNotFound();
			}
			const specialist = await specialistRepo.findOne(specialistId);
			if (!specialist || specialist.tenantId !== tenantId) {
				throw DomainError.specialistNotFound();
			}
			return repo.assignSpecialistToService(tenantId, serviceId, specialistId);
		},
		unassignSpecialistFromService: async (
			tenantId: number,
			serviceId: number,
			specialistId: number
		) => {
			// Maybe just use the repo.unassignSpecialistFromService directly?
			const service = await repo.findOne(serviceId);
			if (!service || service.tenantId !== tenantId) {
				throw DomainError.serviceNotFound();
			}
			const specialist = await specialistRepo.findOne(specialistId);
			if (!specialist || specialist.tenantId !== tenantId) {
				throw DomainError.specialistNotFound();
			}
			const removed = await repo.unassignSpecialistFromService(
				tenantId,
				serviceId,
				specialistId
			);
			if (!removed) {
				throw DomainError.badRequest({
					message: 'Specialist is not assigned to this service',
				});
			}
			return removed;
		},
	};
}
