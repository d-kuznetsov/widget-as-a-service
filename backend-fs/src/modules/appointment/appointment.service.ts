import { Appointment } from '../../db/schema';
import { DomainError } from '../../shared/errors';
import { generateRefreshToken, hashToken } from '../../shared/utils/token';
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

export interface AppointmentCreateResult {
	appointment: Appointment;
	confirmationToken: string;
	manageToken: string;
}

export interface AppointmentService {
	create: (
		tenantId: number,
		input: AppointmentCreateInput
	) => Promise<AppointmentCreateResult>;
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
			const confirmationToken = generateRefreshToken();
			const manageToken = generateRefreshToken();
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
				confirmationTokenHash: hashToken(confirmationToken),
				confirmationTokenExpiresAt: new Date(now + CONFIRMATION_TOKEN_TTL_MS),
				manageTokenHash: hashToken(manageToken),
				manageTokenExpiresAt: new Date(now + MANAGE_TOKEN_TTL_MS),
			};
			const appointment = await repo.create(tenantId, payload);
			return {
				appointment,
				confirmationToken,
				manageToken,
			};
		},
	};
}
