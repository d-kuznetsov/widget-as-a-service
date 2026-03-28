import { User } from '../../db/schema';
import { DomainError } from '../../shared/errors';
import { hashPassword } from '../../shared/utils/password';
import { UserRepository } from './user.repository';
import { UserCreateInput, UserUpdateInput } from './user.schema';

export interface UserService {
	create: (
		input: UserCreateInput,
		tenantId: number,
		roleId: number
	) => Promise<User>;
	findOne: (id: number) => Promise<User>;
	findByEmail: (email: string) => Promise<User>;
	isMemberOfTenant: (userId: number, tenantSlug: string) => Promise<boolean>;
	update: (id: number, input: UserUpdateInput) => Promise<User>;
	delete: (id: number) => Promise<User>;
}

export function createUserService(repo: UserRepository): UserService {
	return {
		create: async (input, tenantId, roleId) => {
			const { password, ...rest } = input;
			const newUser = {
				...rest,
				passwordHash: await hashPassword(password),
			};
			return repo.create(newUser, tenantId, roleId);
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
		isMemberOfTenant: async (userId, tenantSlug) => {
			return repo.isMemberOfTenant(userId, tenantSlug);
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
	};
}
