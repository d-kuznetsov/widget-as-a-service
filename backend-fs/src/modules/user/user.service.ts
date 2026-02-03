import { User } from '../../db/schema';
import { UserRepository } from './user.repository';
import { UserCreateDto } from './user.schema';

export interface UserService {
	createUser: (dto: UserCreateDto) => Promise<User>;
}

export function createUserService(repo: UserRepository) {
	return {
		createUser: async (dto: UserCreateDto) => {
			const newUser = {
				...dto,
				passwordHash: dto.password,
			};
			return repo.createUser(newUser);
		},
	};
}
