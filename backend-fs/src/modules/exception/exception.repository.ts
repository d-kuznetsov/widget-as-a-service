import { and, eq } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { Exception, exceptionsTable } from '../../db/schema';
import { DataBaseError, DomainError } from '../../shared/errors';
import {
	isPgErrorWithCause,
	PostgresErrorCode,
} from '../../shared/utils/pg-errors';
import { ExceptionCreateInput, ExceptionUpdateInput } from './exception.schema';

export interface ExceptionRepository {
	create: (tenantId: number, input: ExceptionCreateInput) => Promise<Exception>;
	findOneByTenant: (tenantId: number, id: number) => Promise<Exception | null>;
	findAll: () => Promise<Exception[]>;
	findAllByTenant: (tenantId: number) => Promise<Exception[]>;
	updateForTenant: (
		tenantId: number,
		id: number,
		input: ExceptionUpdateInput
	) => Promise<Exception | null>;
	deleteForTenant: (tenantId: number, id: number) => Promise<Exception | null>;
}

export function createExceptionRepository(
	db: NodePgDatabase
): ExceptionRepository {
	const mapExceptionForeignKeyViolation = (error: unknown) => {
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

	const mapExceptionUniqueViolation = (error: unknown) => {
		if (
			!isPgErrorWithCause(error) ||
			error.cause?.code !== PostgresErrorCode.UNIQUE_VIOLATION
		) {
			return;
		}
		const detail = error.cause.detail ?? '';
		if (detail.includes('specialist_id') && detail.includes('date')) {
			throw DomainError.badRequest({
				message: 'An exception already exists for this specialist on this date',
			});
		}
	};

	const mapExceptionExclusionViolation = (error: unknown) => {
		if (!isPgErrorWithCause(error)) return;
		const { code, constraint } = error.cause ?? {};
		if (
			code === PostgresErrorCode.EXCLUSION_VIOLATION &&
			constraint === 'no_overlapping_exceptions'
		) {
			throw DomainError.exceptionOverlapsExisting();
		}
	};

	const mapExceptionCheckViolation = (error: unknown) => {
		if (!isPgErrorWithCause(error)) return;
		const { code, constraint } = error.cause ?? {};
		if (
			code !== PostgresErrorCode.CHECK_VIOLATION ||
			constraint !== 'exceptions_start_before_end'
		) {
			return;
		}
		throw DomainError.badRequest({
			message: 'Start time must be before end time',
		});
	};

	return {
		create: async (tenantId: number, input: ExceptionCreateInput) => {
			try {
				const [row] = await db
					.insert(exceptionsTable)
					.values({ tenantId, ...input })
					.returning();
				return row;
			} catch (error) {
				mapExceptionExclusionViolation(error);
				mapExceptionUniqueViolation(error);
				mapExceptionForeignKeyViolation(error);
				mapExceptionCheckViolation(error);
				throw new DataBaseError({ cause: error as Error });
			}
		},
		findOneByTenant: async (tenantId: number, id: number) => {
			try {
				const [row] = await db
					.select()
					.from(exceptionsTable)
					.where(
						and(
							eq(exceptionsTable.id, id),
							eq(exceptionsTable.tenantId, tenantId)
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
				return await db.select().from(exceptionsTable);
			} catch (error) {
				throw new DataBaseError({ cause: error as Error });
			}
		},
		findAllByTenant: async (tenantId: number) => {
			try {
				return await db
					.select()
					.from(exceptionsTable)
					.where(eq(exceptionsTable.tenantId, tenantId));
			} catch (error) {
				throw new DataBaseError({ cause: error as Error });
			}
		},
		updateForTenant: async (
			tenantId: number,
			id: number,
			input: ExceptionUpdateInput
		) => {
			try {
				const [updated] = await db
					.update(exceptionsTable)
					.set(input)
					.where(
						and(
							eq(exceptionsTable.id, id),
							eq(exceptionsTable.tenantId, tenantId)
						)
					)
					.returning();
				return updated ?? null;
			} catch (error) {
				mapExceptionExclusionViolation(error);
				mapExceptionUniqueViolation(error);
				mapExceptionForeignKeyViolation(error);
				mapExceptionCheckViolation(error);
				throw new DataBaseError({ cause: error as Error });
			}
		},
		deleteForTenant: async (tenantId: number, id: number) => {
			try {
				const [deleted] = await db
					.delete(exceptionsTable)
					.where(
						and(
							eq(exceptionsTable.id, id),
							eq(exceptionsTable.tenantId, tenantId)
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
