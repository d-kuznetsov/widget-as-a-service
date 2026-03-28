import { and, asc, eq } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import {
	NewUser,
	rolesTable,
	tenantsTable,
	tenantUserRolesTable,
	User,
	usersTable,
} from '../../db/schema';
import { DataBaseError, DomainError } from '../../shared/errors';
import {
	isPgErrorWithCause,
	PostgresErrorCode,
} from '../../shared/utils/pg-errors';
import { UserUpdateInput } from './user.schema';

export interface UserRepository {
	create: (newUser: NewUser, tenantId: number, roleId: number) => Promise<User>;
	findOne: (id: number) => Promise<User | null>;
	findByEmail: (email: string) => Promise<User | null>;
	getRoleNameForTenantSlug: (
		userId: number,
		tenantSlug: string
	) => Promise<string | null>;
	getRoleNameById: (roleId: number) => Promise<string | null>;
	update: (id: number, input: UserUpdateInput) => Promise<User | null>;
	delete: (id: number) => Promise<User | null>;
	// updateRoles: (userId: number, roleNames: Role[]) => Promise<Role[]>;
}

export function createUserRepository(db: NodePgDatabase): UserRepository {
	return {
		create: async (newUser: NewUser, tenantId: number, roleId: number) => {
			try {
				return await db.transaction(async (tx) => {
					const [user] = await tx
						.insert(usersTable)
						.values(newUser)
						.returning();

					await tx
						.insert(tenantUserRolesTable)
						.values({ userId: user.id, tenantId, roleId });
					return user;
				});
			} catch (error) {
				if (
					isPgErrorWithCause(error) &&
					error.cause?.code === PostgresErrorCode.UNIQUE_VIOLATION
				) {
					if (error.cause?.detail?.includes('email')) {
						throw DomainError.userAlreadyExists({
							message: 'Email already exists',
						});
					}
					if (error.cause?.detail?.includes('tenantId')) {
						throw DomainError.tenantNotFound({
							message: 'Tenant not found',
						});
					}
					if (error.cause?.detail?.includes('roleId')) {
						throw DomainError.roleNotFound({
							message: 'Role not found',
						});
					}
				}
				throw new DataBaseError({ cause: error as Error });
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
				throw new DataBaseError({ cause: error as Error });
			}
		},
		findByEmail: async (email: string) => {
			try {
				const [user] = await db
					.select()
					.from(usersTable)
					.where(eq(usersTable.email, email))
					.limit(1);
				return user ?? null;
			} catch (error) {
				throw new DataBaseError({ cause: error as Error });
			}
		},
		getRoleNameForTenantSlug: async (userId, tenantSlug) => {
			try {
				const [row] = await db
					.select({ name: rolesTable.name })
					.from(tenantUserRolesTable)
					.innerJoin(
						tenantsTable,
						eq(tenantsTable.id, tenantUserRolesTable.tenantId)
					)
					.innerJoin(rolesTable, eq(rolesTable.id, tenantUserRolesTable.roleId))
					.where(
						and(
							eq(tenantUserRolesTable.userId, userId),
							eq(tenantsTable.slug, tenantSlug)
						)
					)
					.orderBy(asc(rolesTable.name))
					.limit(1);
				return row?.name ?? null;
			} catch (error) {
				throw new DataBaseError({ cause: error as Error });
			}
		},
		getRoleNameById: async (roleId) => {
			try {
				const [row] = await db
					.select({ name: rolesTable.name })
					.from(rolesTable)
					.where(eq(rolesTable.id, roleId))
					.limit(1);
				return row?.name ?? null;
			} catch (error) {
				throw new DataBaseError({ cause: error as Error });
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
				throw new DataBaseError({ cause: error as Error });
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
				throw new DataBaseError({ cause: error as Error });
			}
		},
		// updateRoles: async (userId: number, roleNames: Role[]) => {
		// 	try {
		// 		return await db.transaction(async (tx) => {
		// 			await tx
		// 				.delete(userRolesTable)
		// 				.where(eq(userRolesTable.userId, userId));
		// 			if (roleNames.length === 0) return [];
		// 			const roles = await tx
		// 				.select()
		// 				.from(rolesTable)
		// 				.where(inArray(rolesTable.name, roleNames));
		// 			await tx
		// 				.insert(userRolesTable)
		// 				.values(roles.map((role) => ({ userId, roleId: role.id })));
		// 			return roles.map((r) => r.name as Role);
		// 		});
		// 	} catch (error) {
		// 		if (error instanceof AppError) throw error;
		// 		if (
		// 			isPgErrorWithCause(error) &&
		// 			error.cause?.code === PostgresErrorCode.FOREIGN_KEY_VIOLATION &&
		// 			error.cause?.detail?.includes('userId')
		// 		) {
		// 			throw DomainError.userNotFound({
		// 				message: 'User not found',
		// 			});
		// 		}
		// 		throw new DataBaseError({ cause: error as Error });
		// 	}
		// },
	};
}
