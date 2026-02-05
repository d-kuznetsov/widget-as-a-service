import { User } from '../../db/schema';
import { NotFoundError } from '../../shared/errors';
import { UserRepository } from './user.repository';
import { UserCreateInput, UserUpdateInput } from './user.schema';

export interface UserService {
	create: (input: UserCreateInput) => Promise<User>;
	findOne: (id: number) => Promise<User>;
	update: (id: number, input: UserUpdateInput) => Promise<User>;
	delete: (id: number) => Promise<User>;
}

export function createUserService(repo: UserRepository): UserService {
	return {
		create: async (input: UserCreateInput) => {
			const newUser = {
				...input,
				passwordHash: input.password,
			};
			return repo.create(newUser);
		},
		findOne: async (id: number) => {
			const user = await repo.findOne(id);
			if (!user) {
				throw new NotFoundError({ message: 'User not found' });
			}
			return user;
		},
		update: async (id: number, input: UserUpdateInput) => {
			const user = await repo.update(id, input);
			if (!user) {
				throw new NotFoundError({ message: 'User not found' });
			}
			return user;
		},
		delete: async (id: number) => {
			const user = await repo.delete(id);
			if (!user) {
				throw new NotFoundError({ message: 'User not found' });
			}
			return user;
		},
	};
}
