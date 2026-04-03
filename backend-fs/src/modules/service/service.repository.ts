import { eq } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { Service, servicesTable } from '../../db/schema';
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
	};
}
