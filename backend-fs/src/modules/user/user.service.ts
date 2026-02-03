import { User } from '../../db/schema';
import { UserRepository } from './user.repository';
import { CreateUserDto } from './user.schema';

export interface UserService {
	createUser: (dto: CreateUserDto) => Promise<User>;
}

export function createUserService(repo: UserRepository) {
	return {
		createUser: async (dto: CreateUserDto) => {
			const newUser = {
				...dto,
				passwordHash: dto.password,
			};
			return repo.createUser(newUser);
		},
	};
}
