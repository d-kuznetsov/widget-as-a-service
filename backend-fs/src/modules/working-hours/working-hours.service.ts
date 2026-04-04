import { WorkingHour } from '../../db/schema';
import { DomainError } from '../../shared/errors';
import type { SpecialistRepository } from '../specialist/specialist.repository';
import { WorkingHoursRepository } from './working-hours.repository';
import {
	WorkingHoursCreateInput,
	WorkingHoursUpdateInput,
} from './working-hours.schema';

export interface WorkingHoursServiceDeps {
	repo: WorkingHoursRepository;
	specialistRepo: SpecialistRepository;
}

export interface WorkingHoursService {
	create: (
		tenantId: number,
		input: WorkingHoursCreateInput
	) => Promise<WorkingHour>;
	findOne: (tenantId: number, id: number) => Promise<WorkingHour>;
	findAll: (tenantId: number) => Promise<WorkingHour[]>;
	update: (
		tenantId: number,
		id: number,
		input: WorkingHoursUpdateInput
	) => Promise<WorkingHour>;
	delete: (tenantId: number, id: number) => Promise<WorkingHour>;
}

export function createWorkingHoursService(
	deps: WorkingHoursServiceDeps
): WorkingHoursService {
	const { repo, specialistRepo } = deps;

	const assertSpecialistInTenant = async (
		tenantId: number,
		specialistId: number
	) => {
		const specialist = await specialistRepo.findOne(specialistId);
		if (!specialist || specialist.tenantId !== tenantId) {
			throw DomainError.specialistNotFound();
		}
	};

	return {
		create: async (tenantId: number, input: WorkingHoursCreateInput) => {
			await assertSpecialistInTenant(tenantId, input.specialistId);
			return repo.create(tenantId, input);
		},
		findOne: async (tenantId: number, id: number) => {
			const row = await repo.findOneByTenant(tenantId, id);
			if (!row) {
				throw DomainError.workingHoursNotFound();
			}
			return row;
		},
		findAll: async (tenantId: number) => {
			return repo.findAllByTenant(tenantId);
		},
		update: async (
			tenantId: number,
			id: number,
			input: WorkingHoursUpdateInput
		) => {
			const updated = await repo.updateForTenant(tenantId, id, input);
			if (!updated) {
				throw DomainError.workingHoursNotFound();
			}
			return updated;
		},
		delete: async (tenantId: number, id: number) => {
			const deleted = await repo.deleteForTenant(tenantId, id);
			if (!deleted) {
				throw DomainError.workingHoursNotFound();
			}
			return deleted;
		},
	};
}
