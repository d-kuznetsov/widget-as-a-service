import { eq } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { refreshTokensTable } from '../../db/schema';

export interface AuthRepository {
	saveRefreshToken: (input: {
		userId: number;
		token: string;
		expiresAt: Date;
	}) => Promise<void>;
	findRefreshToken: (
		token: string
	) => Promise<{ userId: number; expiresAt: Date } | null>;
	revokeRefreshToken: (token: string) => Promise<void>;
	revokeAllUserTokens: (userId: number) => Promise<void>;
}

export function createAuthRepository(db: NodePgDatabase): AuthRepository {
	return {
		saveRefreshToken: async (input) => {
			await db.insert(refreshTokensTable).values(input);
		},
		findRefreshToken: async (token) => {
			const [row] = await db
				.select({
					userId: refreshTokensTable.userId,
					expiresAt: refreshTokensTable.expiresAt,
				})
				.from(refreshTokensTable)
				.where(eq(refreshTokensTable.token, token))
				.limit(1);
			if (!row) return null;
			return { userId: row.userId, expiresAt: row.expiresAt };
		},
		revokeRefreshToken: async (token) => {
			await db
				.delete(refreshTokensTable)
				.where(eq(refreshTokensTable.token, token));
		},
		revokeAllUserTokens: async (userId) => {
			await db
				.delete(refreshTokensTable)
				.where(eq(refreshTokensTable.userId, userId));
		},
	};
}
