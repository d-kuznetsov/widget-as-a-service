import { randomBytes } from 'node:crypto';
import { User } from '../../db/schema';
import { ServiceError } from '../../shared/errors';
import { verifyPassword } from '../../shared/utils/password';
import { hashToken } from '../../shared/utils/token';
import { UserService } from '../user/user.service';
import { AuthRepository } from './auth.repository';
import { LoginResponse } from './auth.schema';

const REFRESH_TOKEN_MS = 7 * 24 * 60 * 60 * 1000;
const REFRESH_TOKEN_BYTES = 32;

export interface AuthServiceDeps {
	userService: UserService;
	authRepo: AuthRepository;
	generateAccessToken: (userId: number, scope: string[]) => Promise<string>;
}

export interface AuthService {
	login: (email: string, password: string) => Promise<LoginResponse>;
	refresh: (token: string) => Promise<LoginResponse>;
	logout: (token: string) => Promise<void>;
	logoutAll: (userId: number) => Promise<void>;
}

function generateRefreshToken(): string {
	return randomBytes(REFRESH_TOKEN_BYTES).toString('hex');
}

export function createAuthService(deps: AuthServiceDeps): AuthService {
	const { userService, authRepo, generateAccessToken } = deps;

	return {
		login: async (email, password) => {
			let user: User;
			try {
				user = await userService.findByEmail(email);
			} catch {
				throw ServiceError.createInvalidCredentials();
			}
			const ok = await verifyPassword(password, user.passwordHash);
			if (!ok) throw ServiceError.createInvalidCredentials();

			const accessToken = await generateAccessToken(user.id, ['user']);
			const refreshToken = generateRefreshToken();
			const expiresAt = new Date(Date.now() + REFRESH_TOKEN_MS);
			await authRepo.createRefreshToken({
				userId: user.id,
				token: hashToken(refreshToken),
				expiresAt,
			});
			return { accessToken, refreshToken };
		},

		refresh: async (oldToken) => {
			const oldTokenHash = hashToken(oldToken);
			const oldTokenRecord =
				await authRepo.findByRefreshTokenHash(oldTokenHash);
			if (!oldTokenRecord || oldTokenRecord.expiresAt < new Date()) {
				throw ServiceError.createInvalidCredentials();
			}
			if (oldTokenRecord.revokedAt) {
				throw ServiceError.createRevokedTokenReuse();
			}
			const newRefreshToken = generateRefreshToken();
			const newTokenRecord = await authRepo.rotateRefreshToken(
				oldTokenRecord.id,
				{
					userId: oldTokenRecord.userId,
					token: hashToken(newRefreshToken),
					expiresAt: new Date(Date.now() + REFRESH_TOKEN_MS),
				}
			);
			const accessToken = await generateAccessToken(newTokenRecord.userId, [
				'user',
			]);
			return { accessToken, refreshToken: newRefreshToken };
		},

		logout: async (token) => {
			await authRepo.revokeRefreshToken(hashToken(token));
		},

		logoutAll: async (userId) => {
			await authRepo.revokeAllUserTokens(userId);
		},
	};
}
