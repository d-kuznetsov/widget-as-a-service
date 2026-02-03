import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { NewUser, User, usersTable } from '../../db/schema';
export interface UserRepository {
	createUser: (dto: NewUser) => Promise<User>;
}

export function createUserRepository(db: NodePgDatabase): UserRepository {
	return {
		createUser: async (newUser: NewUser) => {
			const result = await db.insert(usersTable).values(newUser).returning();
			return result[0];
		},
	};
}
