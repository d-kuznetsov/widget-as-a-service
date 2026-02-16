import { eq } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { refreshTokensTable } from '../../db/schema';
import { RepositoryError } from '../../shared/errors';

export interface AuthRepository {
	saveRefreshToken: (input: {
		userId: number;
		token: string;
		expiresAt: Date;
	}) => Promise<number>;
	findRefreshToken: (
		token: string
	) => Promise<{ userId: number; expiresAt: Date } | null>;
	revokeRefreshToken: (token: string) => Promise<void>;
	revokeAllUserTokens: (userId: number) => Promise<void>;
}

export function createAuthRepository(db: NodePgDatabase): AuthRepository {
	return {
		saveRefreshToken: async (input) => {
			try {
				const [token] = await db
					.insert(refreshTokensTable)
					.values(input)
					.returning();
				return token?.id;
			} catch (error) {
				throw new RepositoryError({ cause: error as Error });
			}
		},
		findRefreshToken: async (hash) => {
			try {
				const [token] = await db
					.select({
						userId: refreshTokensTable.userId,
						expiresAt: refreshTokensTable.expiresAt,
					})
					.from(refreshTokensTable)
					.where(eq(refreshTokensTable.token, hash))
					.limit(1);
				return token ?? null;
			} catch (error) {
				throw new RepositoryError({ cause: error as Error });
			}
		},
		revokeRefreshToken: async (token) => {
			try {
				await db
					.delete(refreshTokensTable)
					.where(eq(refreshTokensTable.token, token));
			} catch (error) {
				throw new RepositoryError({ cause: error as Error });
			}
		},
		revokeAllUserTokens: async (userId) => {
			try {
				await db
					.delete(refreshTokensTable)
					.where(eq(refreshTokensTable.userId, userId));
			} catch (error) {
				throw new RepositoryError({ cause: error as Error });
			}
		},
	};
}
