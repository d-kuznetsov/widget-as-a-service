import { User } from '../../db/schema';
import { GenerateTokenOptions } from '../../plugins/auth.plugin';
import { ServiceError } from '../../shared/errors';
import { verifyPassword } from '../../shared/utils/password';
import { hashToken } from '../../shared/utils/token';
import { UserService } from '../user/user.service';
import { AuthRepository } from './auth.repository';
import { SignInResponse } from './auth.schema';

const REFRESH_TOKEN_MS = 7 * 24 * 60 * 60 * 1000;

export interface AuthServiceDeps {
	userService: UserService;
	authRepo: AuthRepository;
	generateToken: (options: GenerateTokenOptions) => Promise<string>;
}

export interface AuthService {
	signIn: (email: string, password: string) => Promise<SignInResponse>;
	refreshToken: (token: string) => Promise<SignInResponse>;
	signOut: (token: string) => Promise<void>;
	signOutAll: (userId: number) => Promise<void>;
}

export function createAuthService(deps: AuthServiceDeps): AuthService {
	const { userService, authRepo, generateToken } = deps;

	return {
		signIn: async (email, password) => {
			let user: User;
			try {
				user = await userService.findByEmail(email);
			} catch {
				throw ServiceError.createInvalidCredentials();
			}
			const ok = await verifyPassword(password, user.passwordHash);
			if (!ok) throw ServiceError.createInvalidCredentials();

			const accessToken = await generateToken({
				type: 'access',
				payload: { id: user.id, roles: ['user'] },
			});
			const refreshToken = await generateToken({
				type: 'refresh',
				userId: user.id,
			});
			const expiresAt = new Date(Date.now() + REFRESH_TOKEN_MS);
			await authRepo.createRefreshToken({
				userId: user.id,
				token: hashToken(refreshToken),
				expiresAt,
			});
			return { accessToken, refreshToken };
		},

		refreshToken: async (oldToken) => {
			const oldTokenHash = hashToken(oldToken);
			const oldTokenRecord =
				await authRepo.findByRefreshTokenHash(oldTokenHash);
			if (!oldTokenRecord || oldTokenRecord.expiresAt < new Date()) {
				throw ServiceError.createInvalidCredentials();
			}
			if (oldTokenRecord.revokedAt) {
				throw ServiceError.createRevokedTokenReuse();
			}
			const newRefreshToken = await generateToken({
				type: 'refresh',
				userId: oldTokenRecord.userId,
			});
			const newTokenRecord = await authRepo.rotateRefreshToken(
				oldTokenRecord.id,
				{
					userId: oldTokenRecord.userId,
					token: hashToken(newRefreshToken),
					expiresAt: new Date(Date.now() + REFRESH_TOKEN_MS),
				}
			);
			const accessToken = await generateToken({
				type: 'access',
				payload: { id: newTokenRecord.userId, roles: ['user'] },
			});
			return { accessToken, refreshToken: newRefreshToken };
		},

		signOut: async (token) => {
			await authRepo.revokeRefreshToken(hashToken(token));
		},

		signOutAll: async (userId) => {
			await authRepo.revokeAllUserTokens(userId);
		},
	};
}
