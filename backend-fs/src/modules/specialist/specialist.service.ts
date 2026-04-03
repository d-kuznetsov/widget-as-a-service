import { Specialist } from '../../db/schema';
import { DomainError } from '../../shared/errors';
import { SpecialistRepository } from './specialist.repository';
import {
	SpecialistCreateInput,
	SpecialistUpdateInput,
} from './specialist.schema';

export type SpecialistCreateParams = SpecialistCreateInput & {
	tenantId: number;
};

export interface SpecialistService {
	create: (input: SpecialistCreateParams) => Promise<Specialist>;
	findOne: (id: number) => Promise<Specialist>;
	findAll: (tenantId: number) => Promise<Specialist[]>;
	update: (id: number, input: SpecialistUpdateInput) => Promise<Specialist>;
	delete: (id: number) => Promise<Specialist>;
}

export function createSpecialistService(
	repo: SpecialistRepository
): SpecialistService {
	return {
		create: async (input: SpecialistCreateParams) => {
			const { tenantId, ...body } = input;
			return repo.create({ ...body, tenantId });
		},
		findOne: async (id: number) => {
			const specialist = await repo.findOne(id);
			if (!specialist) {
				throw DomainError.specialistNotFound();
			}
			return specialist;
		},
		findAll: async (tenantId: number) => {
			return repo.findAllByTenant(tenantId);
		},
		update: async (id: number, input: SpecialistUpdateInput) => {
			const specialist = await repo.update(id, input);
			if (!specialist) {
				throw DomainError.specialistNotFound();
			}
			return specialist;
		},
		delete: async (id: number) => {
			const specialist = await repo.delete(id);
			if (!specialist) {
				throw DomainError.specialistNotFound();
			}
			return specialist;
		},
	};
}
