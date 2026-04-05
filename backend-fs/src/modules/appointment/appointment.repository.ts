import { and, eq } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import {
	Appointment,
	appointmentsTable,
	NewAppointment,
} from '../../db/schema';
import { DataBaseError, DomainError } from '../../shared/errors';
import {
	isPgErrorWithCause,
	PostgresErrorCode,
} from '../../shared/utils/pg-errors';

export type AppointmentCreateFields = Required<
	Omit<NewAppointment, 'id' | 'tenantId' | 'createdAt' | 'updatedAt'>
>;
export type AppointmentUpdateFields = Partial<
	Omit<Appointment, 'id' | 'createdAt'>
>;

export interface AppointmentRepository {
	create: (
		tenantId: number,
		input: AppointmentCreateFields
	) => Promise<Appointment>;
	findOneByTenant: (
		tenantId: number,
		id: number
	) => Promise<Appointment | null>;
	findAll: () => Promise<Appointment[]>;
	findAllByTenant: (tenantId: number) => Promise<Appointment[]>;
	updateForTenant: (
		tenantId: number,
		id: number,
		input: AppointmentUpdateFields
	) => Promise<Appointment | null>;
	deleteForTenant: (
		tenantId: number,
		id: number
	) => Promise<Appointment | null>;
}

export function createAppointmentRepository(
	db: NodePgDatabase
): AppointmentRepository {
	const mapAppointmentForeignKeyViolation = (error: unknown) => {
		if (
			!isPgErrorWithCause(error) ||
			error.cause?.code !== PostgresErrorCode.FOREIGN_KEY_VIOLATION
		) {
			return;
		}
		const detail = error.cause.detail ?? '';
		if (detail.includes('tenant_id')) {
			throw DomainError.tenantNotFound();
		}
		if (detail.includes('specialist_id')) {
			throw DomainError.specialistNotFound();
		}
		if (detail.includes('service_id')) {
			throw DomainError.serviceNotFound();
		}
		throw DomainError.badRequest({ message: 'Invalid reference' });
	};

	const mapAppointmentExclusionViolation = (error: unknown) => {
		if (!isPgErrorWithCause(error)) return;
		const { code, constraint } = error.cause ?? {};
		if (
			code === PostgresErrorCode.EXCLUSION_VIOLATION &&
			constraint === 'no_overlapping_appointments'
		) {
			throw DomainError.appointmentOverlapsExisting();
		}
	};

	const mapAppointmentCheckViolation = (error: unknown) => {
		if (!isPgErrorWithCause(error)) return;
		const { code, constraint } = error.cause ?? {};
		if (
			code !== PostgresErrorCode.CHECK_VIOLATION ||
			constraint !== 'appointments_start_before_end'
		) {
			return;
		}
		throw DomainError.badRequest({
			message: 'Start time must be before end time',
		});
	};

	return {
		create: async (tenantId: number, input: AppointmentCreateFields) => {
			try {
				const [row] = await db
					.insert(appointmentsTable)
					.values({ tenantId, ...input })
					.returning();
				return row;
			} catch (error) {
				mapAppointmentExclusionViolation(error);
				mapAppointmentForeignKeyViolation(error);
				mapAppointmentCheckViolation(error);
				throw new DataBaseError({ cause: error as Error });
			}
		},
		findOneByTenant: async (tenantId: number, id: number) => {
			try {
				const [row] = await db
					.select()
					.from(appointmentsTable)
					.where(
						and(
							eq(appointmentsTable.id, id),
							eq(appointmentsTable.tenantId, tenantId)
						)
					)
					.limit(1);
				return row ?? null;
			} catch (error) {
				throw new DataBaseError({ cause: error as Error });
			}
		},
		findAll: async () => {
			try {
				return await db.select().from(appointmentsTable);
			} catch (error) {
				throw new DataBaseError({ cause: error as Error });
			}
		},
		findAllByTenant: async (tenantId: number) => {
			try {
				return await db
					.select()
					.from(appointmentsTable)
					.where(eq(appointmentsTable.tenantId, tenantId));
			} catch (error) {
				throw new DataBaseError({ cause: error as Error });
			}
		},
		updateForTenant: async (
			tenantId: number,
			id: number,
			input: AppointmentUpdateFields
		) => {
			try {
				const [updated] = await db
					.update(appointmentsTable)
					.set(input)
					.where(
						and(
							eq(appointmentsTable.id, id),
							eq(appointmentsTable.tenantId, tenantId)
						)
					)
					.returning();
				return updated ?? null;
			} catch (error) {
				mapAppointmentExclusionViolation(error);
				mapAppointmentForeignKeyViolation(error);
				mapAppointmentCheckViolation(error);
				throw new DataBaseError({ cause: error as Error });
			}
		},
		deleteForTenant: async (tenantId: number, id: number) => {
			try {
				const [deleted] = await db
					.delete(appointmentsTable)
					.where(
						and(
							eq(appointmentsTable.id, id),
							eq(appointmentsTable.tenantId, tenantId)
						)
					)
					.returning();
				return deleted ?? null;
			} catch (error) {
				throw new DataBaseError({ cause: error as Error });
			}
		},
	};
}
