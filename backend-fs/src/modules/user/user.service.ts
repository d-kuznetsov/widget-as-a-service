import { User } from '../../db/schema';
import { DomainError } from '../../shared/errors';
import { hashPassword } from '../../shared/utils/password';
import { InviteService } from '../invite/invite.service';
import { UserRepository } from './user.repository';
import { UserCreateInput, UserUpdateInput } from './user.schema';

export interface UserService {
	create: (input: UserCreateInput) => Promise<User>;
	findOne: (id: number) => Promise<User>;
	findByEmail: (email: string) => Promise<User>;
	update: (id: number, input: UserUpdateInput) => Promise<User>;
	delete: (id: number) => Promise<User>;
}

export function createUserService(
	repo: UserRepository,
	inviteService: InviteService
): UserService {
	return {
		create: async (input: UserCreateInput) => {
			const { password, token, ...rest } = input;
			const invite = await inviteService.findByToken(token);
			if (!invite) {
				throw DomainError.inviteNotFound();
			}
			if (invite.expiresAt < new Date()) {
				throw DomainError.inviteExpired();
			}
			if (invite.used) {
				throw DomainError.inviteAlreadyUsed();
			}
			const newUser = {
				...rest,
				passwordHash: await hashPassword(password),
			};
			return await repo.create(newUser, invite.tenantId, invite.roleId);
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
	};
}
