import { User } from '../../db/schema';
import {
	RepositoryError,
	RepositoryErrorCode,
	ServiceError,
} from '../../shared/errors';
import { hashPassword } from '../../shared/utils/password';
import { Role } from '../../shared/utils/roles';
import { UserRepository } from './user.repository';
import { UserCreateInput, UserUpdateInput } from './user.schema';

export interface UserService {
	create: (input: UserCreateInput) => Promise<User>;
	findOne: (id: number) => Promise<User>;
	findByEmail: (email: string) => Promise<User>;
	update: (id: number, input: UserUpdateInput) => Promise<User>;
	delete: (id: number) => Promise<User>;
	updateRoles: (userId: number, roleNames: Role[]) => Promise<void>;
}

export function createUserService(repo: UserRepository): UserService {
	return {
		create: async (input: UserCreateInput) => {
			const { password, ...rest } = input;
			const newUser = {
				...rest,
				passwordHash: await hashPassword(password),
			};
			try {
				return await repo.create(newUser);
			} catch (error) {
				if (
					(error as RepositoryError).code ===
					RepositoryErrorCode.ENTITY_ALREADY_EXISTS
				) {
					throw ServiceError.createUserAlreadyExists({ cause: error as Error });
				}
				throw error;
			}
		},
		findOne: async (id: number) => {
			const user = await repo.findOne(id);
			if (!user) {
				throw ServiceError.createUserNotFound();
			}
			return user;
		},
		findByEmail: async (email: string) => {
			const user = await repo.findByEmail(email);
			if (!user) {
				throw ServiceError.createUserNotFound();
			}
			return user;
		},
		update: async (id: number, input: UserUpdateInput) => {
			const user = await repo.update(id, input);
			if (!user) {
				throw ServiceError.createUserNotFound();
			}
			return user;
		},
		delete: async (id: number) => {
			const user = await repo.delete(id);
			if (!user) {
				throw ServiceError.createUserNotFound();
			}
			return user;
		},
		updateRoles: async (userId: number, roleNames: Role[]) => {
			try {
				await repo.updateRoles(userId, roleNames);
			} catch (error) {
				if (
					(error as RepositoryError).code ===
					RepositoryErrorCode.FOREIGN_KEY_VIOLATION
				) {
					throw ServiceError.createUserNotFound({ cause: error as Error });
				}
				throw error;
			}
		},
	};
}
