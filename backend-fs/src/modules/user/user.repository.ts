import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { NewUser, User, usersTable } from '../../db/schema';
import { CreateUserDto } from './user.schema';

export interface UserRepository {
	createUser: (dto: CreateUserDto) => Promise<User>;
}

export function createUserRepository(db: NodePgDatabase) {
	return {
		createUser: async (newUser: NewUser) => {
			const result = await db.insert(usersTable).values(newUser).returning();
			return result[0];
		},
	};
}
