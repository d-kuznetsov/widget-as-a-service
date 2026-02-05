import { User } from '../../db/schema';
import { NotFoundError } from '../../shared/errors';
import { UserRepository } from './user.repository';
import { UserCreateDto } from './user.schema';

export interface UserService {
	create: (dto: UserCreateDto) => Promise<User>;
	findOne: (id: number) => Promise<User>;
	update: (id: number, updates: Partial<User>) => Promise<User>;
}

export function createUserService(repo: UserRepository): UserService {
	return {
		create: async (dto: UserCreateDto) => {
			const newUser = {
				...dto,
				passwordHash: dto.password,
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
		update: async (id: number, updates: Partial<User>) => {
			const user = await repo.update(id, updates);
			if (!user) {
				throw new NotFoundError({ message: 'User not found' });
			}
			return user;
		},
	};
}
