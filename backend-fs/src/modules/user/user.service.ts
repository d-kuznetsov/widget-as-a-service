import { User } from '../../db/schema';
import { DomainError } from '../../shared/errors';
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
			return await repo.create(newUser);
		},
		findOne: async (id: number) => {
			const user = await repo.findOne(id);
			if (!user) {
				throw DomainError.userNotFound();
			}
			return user;
		},
		findByEmail: async (email: string) => {
			const user = await repo.findByEmail(email);
			if (!user) {
				throw DomainError.userNotFound();
			}
			return user;
		},
		update: async (id: number, input: UserUpdateInput) => {
			const user = await repo.update(id, input);
			if (!user) {
				throw DomainError.userNotFound();
			}
			return user;
		},
		delete: async (id: number) => {
			const user = await repo.delete(id);
			if (!user) {
				throw DomainError.userNotFound();
			}
			return user;
		},
		updateRoles: async (userId: number, roleNames: Role[]) => {
			await repo.updateRoles(userId, roleNames);
		},
	};
}
