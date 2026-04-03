import { eq } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { NewSpecialist, Specialist, specialistsTable } from '../../db/schema';
import { DataBaseError, DomainError } from '../../shared/errors';
import {
	isPgErrorWithCause,
	PostgresErrorCode,
} from '../../shared/utils/pg-errors';
import { SpecialistUpdateInput } from './specialist.schema';

export interface SpecialistRepository {
	create: (input: NewSpecialist) => Promise<Specialist>;
	findOne: (id: number) => Promise<Specialist | null>;
	findAll: () => Promise<Specialist[]>;
	findAllByTenant: (tenantId: number) => Promise<Specialist[]>;
	update: (
		id: number,
		input: SpecialistUpdateInput
	) => Promise<Specialist | null>;
	delete: (id: number) => Promise<Specialist>;
}

export function createSpecialistRepository(
	db: NodePgDatabase
): SpecialistRepository {
	const mapSpecialistUniqueViolation = (error: unknown) => {
		if (
			!isPgErrorWithCause(error) ||
			error.cause?.code !== PostgresErrorCode.UNIQUE_VIOLATION
		) {
			return;
		}
		const detail = error.cause.detail ?? '';
		if (detail.includes('tenant_id, user_id')) {
			throw DomainError.specialistUserAlreadyLinked();
		}
		if (detail.includes('name')) {
			throw DomainError.specialistNameAlreadyExists();
		}
	};

	const mapSpecialistForeignKeyViolation = (error: unknown) => {
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
		if (detail.includes('user_id')) {
			throw DomainError.userNotFound();
		}
		throw DomainError.badRequest({ message: 'Invalid reference' });
	};

	return {
		create: async (input: NewSpecialist) => {
			try {
				const [specialist] = await db
					.insert(specialistsTable)
					.values(input)
					.returning();
				return specialist;
			} catch (error) {
				mapSpecialistForeignKeyViolation(error);
				mapSpecialistUniqueViolation(error);
				throw new DataBaseError({ cause: error as Error });
			}
		},
		findOne: async (id: number) => {
			try {
				const [specialist] = await db
					.select()
					.from(specialistsTable)
					.where(eq(specialistsTable.id, id))
					.limit(1);
				return specialist ?? null;
			} catch (error) {
				throw new DataBaseError({ cause: error as Error });
			}
		},
		findAll: async () => {
			try {
				return await db.select().from(specialistsTable);
			} catch (error) {
				throw new DataBaseError({ cause: error as Error });
			}
		},
		findAllByTenant: async (tenantId: number) => {
			try {
				return await db
					.select()
					.from(specialistsTable)
					.where(eq(specialistsTable.tenantId, tenantId));
			} catch (error) {
				throw new DataBaseError({ cause: error as Error });
			}
		},
		update: async (id: number, input: SpecialistUpdateInput) => {
			try {
				const [updated] = await db
					.update(specialistsTable)
					.set(input)
					.where(eq(specialistsTable.id, id))
					.returning();
				return updated ?? null;
			} catch (error) {
				mapSpecialistForeignKeyViolation(error);
				mapSpecialistUniqueViolation(error);
				throw new DataBaseError({ cause: error as Error });
			}
		},
		delete: async (id: number) => {
			try {
				const [deleted] = await db
					.delete(specialistsTable)
					.where(eq(specialistsTable.id, id))
					.returning();
				return deleted ?? null;
			} catch (error) {
				throw new DataBaseError({ cause: error as Error });
			}
		},
	};
}
