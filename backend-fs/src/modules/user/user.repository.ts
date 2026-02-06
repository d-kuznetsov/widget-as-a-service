import { eq } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import {
	NewUser,
	rolesTable,
	User,
	userRolesTable,
	usersTable,
} from '../../db/schema';
import { AppError, ConflictError, DatabaseError } from '../../shared/errors';
import {
	isPgErrorWithCause,
	PostgresErrorCode,
} from '../../shared/utils/pg-errors';
import { Roles } from '../../shared/utils/roles';
import { UserUpdateInput } from './user.schema';

export interface UserRepository {
	create: (newUser: NewUser) => Promise<User>;
	findOne: (id: number) => Promise<User | null>;
	update: (id: number, input: UserUpdateInput) => Promise<User | null>;
	delete: (id: number) => Promise<User | null>;
}

export function createUserRepository(db: NodePgDatabase): UserRepository {
	return {
		create: async (newUser: NewUser) => {
			try {
				return await db.transaction(async (tx) => {
					const [user] = await tx
						.insert(usersTable)
						.values(newUser)
						.returning();
					const [clientRole] = await tx
						.select()
						.from(rolesTable)
						.where(eq(rolesTable.name, Roles.CLIENT))
						.limit(1);
					if (!clientRole) {
						throw new DatabaseError({
							message: `Role "${Roles.CLIENT}" not found. Ensure roles are seeded.`,
						});
					}
					await tx
						.insert(userRolesTable)
						.values({ userId: user.id, roleId: clientRole.id });
					return user;
				});
			} catch (error) {
				if (error instanceof AppError) throw error;
				if (
					isPgErrorWithCause(error) &&
					error.cause?.code === PostgresErrorCode.UNIQUE_VIOLATION
				) {
					if (error.cause?.detail?.includes('email')) {
						throw new ConflictError({ message: 'Email already exists' });
					}
					throw new ConflictError({ cause: error as Error });
				}
				throw new DatabaseError({ cause: error as Error });
			}
		},
		findOne: async (id: number) => {
			try {
				const [user] = await db
					.select()
					.from(usersTable)
					.where(eq(usersTable.id, id))
					.limit(1);
				return user ?? null;
			} catch (error) {
				throw new DatabaseError({ cause: error as Error });
			}
		},
		update: async (id: number, input: UserUpdateInput) => {
			try {
				const [user] = await db
					.update(usersTable)
					.set(input)
					.where(eq(usersTable.id, id))
					.returning();
				return user ?? null;
			} catch (error) {
				throw new DatabaseError({ cause: error as Error });
			}
		},
		delete: async (id: number) => {
			try {
				const [user] = await db
					.delete(usersTable)
					.where(eq(usersTable.id, id))
					.returning();
				return user ?? null;
			} catch (error) {
				throw new DatabaseError({ cause: error as Error });
			}
		},
	};
}
