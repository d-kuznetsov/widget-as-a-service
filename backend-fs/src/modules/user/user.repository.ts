import { eq } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { NewUser, User, usersTable } from '../../db/schema';
import { ConflictError, DatabaseError } from '../../shared/errors';
import {
	isPgErrorWithCause,
	PostgresErrorCode,
} from '../../shared/utils/pg-errors';

export interface UserRepository {
	create: (newUser: NewUser) => Promise<User>;
	findOne: (id: number) => Promise<User | null>;
	update: (id: number, updates: Partial<User>) => Promise<User | null>;
}

export function createUserRepository(db: NodePgDatabase): UserRepository {
	return {
		create: async (newUser: NewUser) => {
			try {
				const result = await db.insert(usersTable).values(newUser).returning();
				return result[0];
			} catch (error) {
				if (
					isPgErrorWithCause(error) &&
					error.cause?.code === PostgresErrorCode.UNIQUE_VIOLATION
				) {
					if (error.cause?.detail?.includes('email')) {
						throw new ConflictError({ message: 'Email already exists' });
					}
					throw new ConflictError();
				}
				throw new DatabaseError({ cause: error as Error });
			}
		},
		findOne: async (id: number) => {
			try {
				const result = await db
					.select()
					.from(usersTable)
					.where(eq(usersTable.id, id))
					.limit(1);
				return result[0] ?? null;
			} catch (error) {
				throw new DatabaseError({ cause: error as Error });
			}
		},
		update: async (id: number, updates: Partial<User>) => {
			try {
				const result = await db
					.update(usersTable)
					.set(updates)
					.where(eq(usersTable.id, id))
					.returning();
				return result[0] ?? null;
			} catch (error) {
				throw new DatabaseError({ cause: error as Error });
			}
		},
	};
}
