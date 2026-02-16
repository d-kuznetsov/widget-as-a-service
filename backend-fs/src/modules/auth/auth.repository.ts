import { eq } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import {
	NewRefreshToken,
	RefreshToken,
	refreshTokensTable,
} from '../../db/schema';
import { RepositoryError } from '../../shared/errors';

export interface AuthRepository {
	createRefreshToken: (input: NewRefreshToken) => Promise<number>;
	findByRefreshTokenHash: (tokenHash: string) => Promise<RefreshToken | null>;
	rotateRefreshToken: (
		oldTokenId: number,
		newTokenInput: NewRefreshToken
	) => Promise<RefreshToken>;
	revokeRefreshToken: (token: string) => Promise<void>;
	revokeAllUserTokens: (userId: number) => Promise<void>;
}

export function createAuthRepository(db: NodePgDatabase): AuthRepository {
	return {
		createRefreshToken: async (input: NewRefreshToken) => {
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
		findByRefreshTokenHash: async (tokenHash) => {
			try {
				const [token] = await db
					.select()
					.from(refreshTokensTable)
					.where(eq(refreshTokensTable.token, tokenHash))
					.limit(1);
				return token ?? null;
			} catch (error) {
				throw new RepositoryError({ cause: error as Error });
			}
		},
		rotateRefreshToken: async (
			oldTokenId: number,
			newTokenInput: NewRefreshToken
		) => {
			try {
				return db.transaction(async (tx) => {
					const [newToken] = await tx
						.insert(refreshTokensTable)
						.values(newTokenInput)
						.returning();
					await tx
						.update(refreshTokensTable)
						.set({
							replacedBy: newToken.id,
							revokedAt: new Date(),
						})
						.where(eq(refreshTokensTable.id, oldTokenId));
					return newToken;
				});
			} catch (error) {
				throw new RepositoryError({ cause: error as Error });
			}
		},
		revokeRefreshToken: async (token) => {
			try {
				await db
					.update(refreshTokensTable)
					.set({ revokedAt: new Date() })
					.where(eq(refreshTokensTable.token, token));
			} catch (error) {
				throw new RepositoryError({ cause: error as Error });
			}
		},
		revokeAllUserTokens: async (userId) => {
			try {
				await db
					.update(refreshTokensTable)
					.set({ revokedAt: new Date() })
					.where(eq(refreshTokensTable.userId, userId));
			} catch (error) {
				throw new RepositoryError({ cause: error as Error });
			}
		},
	};
}
