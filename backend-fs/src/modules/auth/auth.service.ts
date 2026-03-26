import { randomBytes } from 'node:crypto';
import { User } from '../../db/schema';
import { DomainError } from '../../shared/errors';
import { verifyPassword } from '../../shared/utils/password';
import { hashToken } from '../../shared/utils/token';
import { InviteService } from '../invite/invite.service';
import { UserService } from '../user/user.service';
import { AuthRepository } from './auth.repository';
import { LoginResponse, RegisterInput } from './auth.schema';

const REFRESH_TOKEN_MS = 7 * 24 * 60 * 60 * 1000;
const REFRESH_TOKEN_BYTES = 32;

export interface AuthServiceDeps {
	userService: UserService;
	inviteService: InviteService;
	authRepo: AuthRepository;
	generateAccessToken: (
		userId: number,
		role: string,
		isSuperAdmin?: boolean
	) => Promise<string>;
}

export interface AuthService {
	login: (email: string, password: string) => Promise<LoginResponse>;
	register: (input: RegisterInput) => Promise<LoginResponse>;
	refresh: (token: string) => Promise<LoginResponse>;
	logout: (token: string) => Promise<void>;
	logoutAll: (userId: number) => Promise<void>;
}

function generateRefreshToken(): string {
	return randomBytes(REFRESH_TOKEN_BYTES).toString('hex');
}

export function createAuthService(deps: AuthServiceDeps): AuthService {
	const { userService, inviteService, authRepo, generateAccessToken } = deps;

	async function issueLoginResponse(user: User): Promise<LoginResponse> {
		const accessToken = await generateAccessToken(
			user.id,
			'user',
			user.isSuperAdmin
		);
		const refreshToken = generateRefreshToken();
		const expiresAt = new Date(Date.now() + REFRESH_TOKEN_MS);
		await authRepo.createRefreshToken({
			userId: user.id,
			token: hashToken(refreshToken),
			expiresAt,
		});
		return { accessToken, refreshToken };
	}

	return {
		login: async (email, password) => {
			let user: User;
			try {
				user = await userService.findByEmail(email);
			} catch {
				throw DomainError.invalidCredentials();
			}
			const ok = await verifyPassword(password, user.passwordHash);
			if (!ok) throw DomainError.invalidCredentials();
			return issueLoginResponse(user);
		},

		register: async (input) => {
			const { token, password, ...profile } = input;
			const invite = await inviteService.findByToken(token);
			if (!invite) {
				throw DomainError.inviteNotFound();
			}
			if (invite.expiresAt < new Date()) {
				throw DomainError.inviteExpired();
			}
			if (invite.used) {
				throw DomainError.inviteAlreadyUsed();
			}
			const user = await userService.create(
				{ ...profile, password },
				invite.tenantId,
				invite.roleId
			);
			return issueLoginResponse(user);
		},

		refresh: async (oldToken) => {
			const oldTokenHash = hashToken(oldToken);
			const oldTokenRecord =
				await authRepo.findByRefreshTokenHash(oldTokenHash);
			if (!oldTokenRecord || oldTokenRecord.expiresAt < new Date()) {
				throw DomainError.invalidCredentials();
			}
			if (oldTokenRecord.revokedAt) {
				throw DomainError.revokedTokenReuse();
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
			const refreshedUser = await userService.findOne(newTokenRecord.userId);
			const accessToken = await generateAccessToken(
				newTokenRecord.userId,
				'user',
				refreshedUser.isSuperAdmin
			);
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
