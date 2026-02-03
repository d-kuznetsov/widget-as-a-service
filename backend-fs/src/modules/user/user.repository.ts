import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { NewUser, User, usersTable } from '../../db/schema';
import { ConflictError, DatabaseError } from '../../shared/errors';
import {
	isPgErrorWithCause,
	PostgresErrorCode,
} from '../../shared/utils/pg-errors';

export interface UserRepository {
	createUser: (dto: NewUser) => Promise<User>;
}

export function createUserRepository(db: NodePgDatabase): UserRepository {
	return {
		createUser: async (newUser: NewUser) => {
			try {
				const result = await db.insert(usersTable).values(newUser).returning();
				return result[0];
			} catch (error) {
				if (
					isPgErrorWithCause(error) &&
					error.cause?.code === PostgresErrorCode.UNIQUE_VIOLATION
				) {
					if (error.cause?.detail?.includes('email')) {
						throw new ConflictError('Email already exists');
					}
					throw new ConflictError();
				}
				throw new DatabaseError();
			}
		},
	};
}
