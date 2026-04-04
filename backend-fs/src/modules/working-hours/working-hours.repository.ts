import { and, eq } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { WorkingHour, workingHoursTable } from '../../db/schema';
import { DataBaseError, DomainError } from '../../shared/errors';
import {
	isPgErrorWithCause,
	PostgresErrorCode,
} from '../../shared/utils/pg-errors';
import {
	WorkingHoursCreateInput,
	WorkingHoursUpdateInput,
} from './working-hours.schema';

export interface WorkingHoursRepository {
	create: (
		tenantId: number,
		input: WorkingHoursCreateInput
	) => Promise<WorkingHour>;
	findOneByTenant: (
		tenantId: number,
		id: number
	) => Promise<WorkingHour | null>;
	findAll: () => Promise<WorkingHour[]>;
	findAllByTenant: (tenantId: number) => Promise<WorkingHour[]>;
	updateForTenant: (
		tenantId: number,
		id: number,
		input: WorkingHoursUpdateInput
	) => Promise<WorkingHour | null>;
	deleteForTenant: (
		tenantId: number,
		id: number
	) => Promise<WorkingHour | null>;
}

export function createWorkingHoursRepository(
	db: NodePgDatabase
): WorkingHoursRepository {
	const mapWorkingHoursForeignKeyViolation = (error: unknown) => {
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
		throw DomainError.badRequest({ message: 'Invalid reference' });
	};

	const mapWorkingHoursUniqueViolation = (error: unknown) => {
		if (
			!isPgErrorWithCause(error) ||
			error.cause?.code !== PostgresErrorCode.UNIQUE_VIOLATION
		) {
			return;
		}
		const detail = error.cause.detail ?? '';
		if (detail.includes('specialist_id') && detail.includes('day_of_week')) {
			throw DomainError.badRequest({
				message: 'Working hours already exist for this specialist on this day',
			});
		}
	};

	return {
		create: async (tenantId: number, input: WorkingHoursCreateInput) => {
			try {
				const [row] = await db
					.insert(workingHoursTable)
					.values({ tenantId, ...input })
					.returning();
				return row;
			} catch (error) {
				mapWorkingHoursUniqueViolation(error);
				mapWorkingHoursForeignKeyViolation(error);
				throw new DataBaseError({ cause: error as Error });
			}
		},
		findOneByTenant: async (tenantId: number, id: number) => {
			try {
				const [row] = await db
					.select()
					.from(workingHoursTable)
					.where(
						and(
							eq(workingHoursTable.id, id),
							eq(workingHoursTable.tenantId, tenantId)
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
				return await db.select().from(workingHoursTable);
			} catch (error) {
				throw new DataBaseError({ cause: error as Error });
			}
		},
		findAllByTenant: async (tenantId: number) => {
			try {
				return await db
					.select()
					.from(workingHoursTable)
					.where(eq(workingHoursTable.tenantId, tenantId));
			} catch (error) {
				throw new DataBaseError({ cause: error as Error });
			}
		},
		updateForTenant: async (
			tenantId: number,
			id: number,
			input: WorkingHoursUpdateInput
		) => {
			try {
				const [updated] = await db
					.update(workingHoursTable)
					.set(input)
					.where(
						and(
							eq(workingHoursTable.id, id),
							eq(workingHoursTable.tenantId, tenantId)
						)
					)
					.returning();
				return updated ?? null;
			} catch (error) {
				mapWorkingHoursUniqueViolation(error);
				mapWorkingHoursForeignKeyViolation(error);
				throw new DataBaseError({ cause: error as Error });
			}
		},
		deleteForTenant: async (tenantId: number, id: number) => {
			try {
				const [deleted] = await db
					.delete(workingHoursTable)
					.where(
						and(
							eq(workingHoursTable.id, id),
							eq(workingHoursTable.tenantId, tenantId)
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
