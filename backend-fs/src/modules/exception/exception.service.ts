import { Exception } from '../../db/schema';
import { DomainError } from '../../shared/errors';
import type { SpecialistRepository } from '../specialist/specialist.repository';
import { ExceptionRepository } from './exception.repository';
import { ExceptionCreateInput, ExceptionUpdateInput } from './exception.schema';

export interface ExceptionServiceDeps {
	repo: ExceptionRepository;
	specialistRepo: SpecialistRepository;
}

export interface ExceptionService {
	create: (tenantId: number, input: ExceptionCreateInput) => Promise<Exception>;
	findOne: (tenantId: number, id: number) => Promise<Exception>;
	findAll: (tenantId: number) => Promise<Exception[]>;
	update: (
		tenantId: number,
		id: number,
		input: ExceptionUpdateInput
	) => Promise<Exception>;
	delete: (tenantId: number, id: number) => Promise<Exception>;
}

export function createExceptionService(
	deps: ExceptionServiceDeps
): ExceptionService {
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
		create: async (tenantId: number, input: ExceptionCreateInput) => {
			await assertSpecialistInTenant(tenantId, input.specialistId);
			return repo.create(tenantId, input);
		},
		findOne: async (tenantId: number, id: number) => {
			const row = await repo.findOneByTenant(tenantId, id);
			if (!row) {
				throw DomainError.exceptionNotFound();
			}
			return row;
		},
		findAll: async (tenantId: number) => {
			return repo.findAllByTenant(tenantId);
		},
		update: async (
			tenantId: number,
			id: number,
			input: ExceptionUpdateInput
		) => {
			const updated = await repo.updateForTenant(tenantId, id, input);
			if (!updated) {
				throw DomainError.exceptionNotFound();
			}
			return updated;
		},
		delete: async (tenantId: number, id: number) => {
			const deleted = await repo.deleteForTenant(tenantId, id);
			if (!deleted) {
				throw DomainError.exceptionNotFound();
			}
			return deleted;
		},
	};
}
