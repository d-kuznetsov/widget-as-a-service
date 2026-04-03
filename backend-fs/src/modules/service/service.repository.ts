import { eq } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import {
	Service,
	ServiceSpecialist,
	serviceSpecialistsTable,
	servicesTable,
} from '../../db/schema';
import { DataBaseError, DomainError } from '../../shared/errors';
import {
	isPgErrorWithCause,
	PostgresErrorCode,
} from '../../shared/utils/pg-errors';
import { ServiceCreateInput, ServiceUpdateInput } from './service.schema';

export interface ServiceRepository {
	create: (tenantId: number, input: ServiceCreateInput) => Promise<Service>;
	findOne: (id: number) => Promise<Service | null>;
	findAll: () => Promise<Service[]>;
	findAllByTenant: (tenantId: number) => Promise<Service[]>;
	update: (id: number, input: ServiceUpdateInput) => Promise<Service | null>;
	delete: (id: number) => Promise<Service>;
	connectSpecialist: (
		tenantId: number,
		serviceId: number,
		specialistId: number
	) => Promise<ServiceSpecialist>;
}

export function createServiceRepository(db: NodePgDatabase): ServiceRepository {
	const mapServiceForeignKeyViolation = (error: unknown) => {
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
		throw DomainError.badRequest({ message: 'Invalid reference' });
	};

	const mapServiceSpecialistUniqueViolation = (error: unknown) => {
		if (
			!isPgErrorWithCause(error) ||
			error.cause?.code !== PostgresErrorCode.UNIQUE_VIOLATION
		) {
			return;
		}
		const detail = error.cause.detail ?? '';
		if (detail.includes('service_id') && detail.includes('specialist_id')) {
			throw DomainError.badRequest({
				message: 'Service is already linked to this specialist',
			});
		}
	};

	const mapServiceSpecialistForeignKeyViolation = (error: unknown) => {
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
		if (detail.includes('service_id')) {
			throw DomainError.serviceNotFound();
		}
		if (detail.includes('specialist_id')) {
			throw DomainError.specialistNotFound();
		}
		throw DomainError.badRequest({ message: 'Invalid reference' });
	};

	return {
		create: async (tenantId: number, input: ServiceCreateInput) => {
			try {
				const [row] = await db
					.insert(servicesTable)
					.values({ tenantId, ...input })
					.returning();
				return row;
			} catch (error) {
				mapServiceForeignKeyViolation(error);
				throw new DataBaseError({ cause: error as Error });
			}
		},
		findOne: async (id: number) => {
			try {
				const [row] = await db
					.select()
					.from(servicesTable)
					.where(eq(servicesTable.id, id))
					.limit(1);
				return row ?? null;
			} catch (error) {
				throw new DataBaseError({ cause: error as Error });
			}
		},
		findAll: async () => {
			try {
				return await db.select().from(servicesTable);
			} catch (error) {
				throw new DataBaseError({ cause: error as Error });
			}
		},
		findAllByTenant: async (tenantId: number) => {
			try {
				return await db
					.select()
					.from(servicesTable)
					.where(eq(servicesTable.tenantId, tenantId));
			} catch (error) {
				throw new DataBaseError({ cause: error as Error });
			}
		},
		update: async (id: number, input: ServiceUpdateInput) => {
			try {
				const [updated] = await db
					.update(servicesTable)
					.set(input)
					.where(eq(servicesTable.id, id))
					.returning();
				return updated ?? null;
			} catch (error) {
				mapServiceForeignKeyViolation(error);
				throw new DataBaseError({ cause: error as Error });
			}
		},
		delete: async (id: number) => {
			try {
				const [deleted] = await db
					.delete(servicesTable)
					.where(eq(servicesTable.id, id))
					.returning();
				return deleted ?? null;
			} catch (error) {
				throw new DataBaseError({ cause: error as Error });
			}
		},
		connectSpecialist: async (
			tenantId: number,
			serviceId: number,
			specialistId: number
		) => {
			try {
				const [row] = await db
					.insert(serviceSpecialistsTable)
					.values({ tenantId, serviceId, specialistId })
					.returning();
				return row;
			} catch (error) {
				mapServiceSpecialistUniqueViolation(error);
				mapServiceSpecialistForeignKeyViolation(error);
				throw new DataBaseError({ cause: error as Error });
			}
		},
	};
}
