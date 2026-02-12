import { User } from '../../db/schema';
import { ServiceError } from '../../shared/errors';
import { verifyPassword } from '../../shared/utils/password';
import { UserService } from '../user/user.service';
import { AuthRepository } from './auth.repository';
import { SignInResponse } from './auth.schema';

const REFRESH_TOKEN_MS = 7 * 24 * 60 * 60 * 1000;

export interface AuthServiceDeps {
	userService: UserService;
	authRepo: AuthRepository;
	generateAccessToken: (payload: {
		id: number;
		firstName: string;
		lastName: string;
	}) => Promise<string>;
	generateRefreshToken: (userId: number) => Promise<string>;
}

export interface AuthService {
	signIn: (email: string, password: string) => Promise<SignInResponse>;
	refreshToken: (token: string) => Promise<SignInResponse>;
	signOut: (token: string) => Promise<void>;
	signOutAll: (userId: number) => Promise<void>;
}

export function createAuthService(deps: AuthServiceDeps): AuthService {
	const { userService, authRepo, generateAccessToken, generateRefreshToken } =
		deps;

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

			const accessToken = await generateAccessToken({
				id: user.id,
				firstName: user.firstName,
				lastName: user.lastName,
			});
			const refreshToken = await generateRefreshToken(user.id);
			const expiresAt = new Date(Date.now() + REFRESH_TOKEN_MS);
			await authRepo.saveRefreshToken({
				userId: user.id,
				token: refreshToken,
				expiresAt,
			});
			return { accessToken, refreshToken };
		},

		refreshToken: async (token) => {
			const data = await authRepo.findRefreshToken(token);
			if (!data || data.expiresAt < new Date()) {
				throw ServiceError.createInvalidCredentials();
			}
			const user = await userService.findOne(data.userId);
			await authRepo.revokeRefreshToken(token);
			const accessToken = await generateAccessToken({
				id: user.id,
				firstName: user.firstName,
				lastName: user.lastName,
			});
			const newRefreshToken = await generateRefreshToken(user.id);
			const expiresAt = new Date(Date.now() + REFRESH_TOKEN_MS);
			await authRepo.saveRefreshToken({
				userId: user.id,
				token: newRefreshToken,
				expiresAt,
			});
			return { accessToken, refreshToken: newRefreshToken };
		},

		signOut: async (token) => {
			await authRepo.revokeRefreshToken(token);
		},

		signOutAll: async (userId) => {
			await authRepo.revokeAllUserTokens(userId);
		},
	};
}
