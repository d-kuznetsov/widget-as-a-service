import { Appointment } from '../../db/schema';
import { DomainError } from '../../shared/errors';
import type { ServiceRepository } from '../service/service.repository';
import type { SpecialistRepository } from '../specialist/specialist.repository';
import {
	AppointmentCreateFields,
	AppointmentRepository,
} from './appointment.repository';
import { AppointmentCreateInput } from './appointment.schema';

const CONFIRMATION_TOKEN_TTL_MS = 24 * 60 * 60 * 1000;
const MANAGE_TOKEN_TTL_MS = 30 * 24 * 60 * 60 * 1000;

export interface AppointmentServiceDeps {
	repo: AppointmentRepository;
	specialistRepo: SpecialistRepository;
	serviceRepo: ServiceRepository;
}

export interface AppointmentService {
	create: (
		tenantId: number,
		input: AppointmentCreateInput
	) => Promise<Appointment>;
}

export function createAppointmentService(
	deps: AppointmentServiceDeps
): AppointmentService {
	const { repo, specialistRepo, serviceRepo } = deps;

	const assertSpecialistInTenant = async (
		tenantId: number,
		specialistId: number
	) => {
		const specialist = await specialistRepo.findOne(specialistId);
		if (!specialist || specialist.tenantId !== tenantId) {
			throw DomainError.specialistNotFound();
		}
	};

	const assertServiceInTenant = async (tenantId: number, serviceId: number) => {
		const service = await serviceRepo.findOne(serviceId);
		if (!service || service.tenantId !== tenantId) {
			throw DomainError.serviceNotFound();
		}
	};

	return {
		create: async (tenantId: number, input: AppointmentCreateInput) => {
			await assertSpecialistInTenant(tenantId, input.specialistId);
			await assertServiceInTenant(tenantId, input.serviceId);
			const now = Date.now();
			const payload: AppointmentCreateFields = {
				specialistId: input.specialistId,
				serviceId: input.serviceId,
				customerName: input.customerName,
				customerEmail: input.customerEmail,
				customerPhone: input.customerPhone ?? null,
				date: input.date,
				startTime: input.startTime,
				endTime: input.endTime,
				status: 'pending',
				confirmationTokenHash: null,
				confirmationTokenExpiresAt: new Date(now + CONFIRMATION_TOKEN_TTL_MS),
				manageTokenHash: null,
				manageTokenExpiresAt: new Date(now + MANAGE_TOKEN_TTL_MS),
			};
			return repo.create(tenantId, payload);
		},
	};
}
