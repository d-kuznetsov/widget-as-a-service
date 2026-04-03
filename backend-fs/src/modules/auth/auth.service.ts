import { randomBytes } from 'node:crypto';
import { User } from '../../db/schema';
import type { GenerateAccessTokenOptions } from '../../plugins/auth.plugin';
import { DomainError } from '../../shared/errors';
import { verifyPassword } from '../../shared/utils/password';
import { type Role, Roles } from '../../shared/utils/roles';
import { hashToken } from '../../shared/utils/token';
import { InviteService } from '../invite/invite.service';
import { UserService } from '../user/user.service';
import { AuthRepository } from './auth.repository';
import { LoginInput, LoginResponse, RegisterInput } from './auth.schema';

const REFRESH_TOKEN_MS = 7 * 24 * 60 * 60 * 1000;
const REFRESH_TOKEN_BYTES = 32;

export interface AuthServiceDeps {
	userService: UserService;
	inviteService: InviteService;
	authRepo: AuthRepository;
	generateAccessToken: (opts: GenerateAccessTokenOptions) => Promise<string>;
}

export interface AuthService {
	login: (input: LoginInput) => Promise<LoginResponse>;
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

	async function issueLoginResponse(
		user: User,
		role: Role,
		tenantId: number | null
	): Promise<LoginResponse> {
		const accessToken = await generateAccessToken({
			userId: user.id,
			role,
			tenantId,
		});
		const refreshToken = generateRefreshToken();
		const expiresAt = new Date(Date.now() + REFRESH_TOKEN_MS);
		await authRepo.createRefreshToken({
			userId: user.id,
			tenantId,
			token: hashToken(refreshToken),
			expiresAt,
		});
		return { accessToken, refreshToken };
	}

	return {
		login: async (input) => {
			const { email, password, slug } = input;
			let user: User;
			try {
				user = await userService.findByEmail(email);
			} catch {
				throw DomainError.invalidCredentials();
			}
			const ok = await verifyPassword(password, user.passwordHash);
			if (!ok) throw DomainError.invalidCredentials();
			let role: Role;
			let tenantId: number | null;
			if (user.isSuperAdmin) {
				role = Roles.SUPER_ADMIN;
				tenantId = null;
			} else {
				const userTenantCtx = await userService.getUserTenantContext(
					user.id,
					slug
				);
				if (userTenantCtx === null) throw DomainError.invalidCredentials();
				role = userTenantCtx.roleName as Role;
				tenantId = userTenantCtx.tenantId;
			}
			return issueLoginResponse(user, role, tenantId);
		},

		register: async (input) => {
			const { token, password, ...profile } = input;
			const invite = await inviteService.findByToken(token);
			if (!invite) {
				throw DomainError.inviteNotFound();
			}
			if (invite.email !== profile.email) {
				throw DomainError.invalidCredentials();
			}
			if (invite.expiresAt < new Date()) {
				throw DomainError.inviteExpired();
			}
			const roleName = await userService.getRoleNameById(invite.roleId);
			if (!roleName) {
				throw DomainError.roleNotFound();
			}
			const user = await userService.create(
				{ ...profile, password },
				invite.tenantId,
				invite.roleId,
				invite.specialistId
			);

			return issueLoginResponse(user, roleName as Role, invite.tenantId);
		},

		refresh: async (currentToken) => {
			const currentTokenHash = hashToken(currentToken);
			const currentTokenRecord =
				await authRepo.findByRefreshTokenHash(currentTokenHash);
			if (!currentTokenRecord || currentTokenRecord.expiresAt < new Date()) {
				throw DomainError.invalidCredentials();
			}
			if (currentTokenRecord.revokedAt) {
				throw DomainError.revokedTokenReuse();
			}
			const newRefreshToken = generateRefreshToken();
			const newTokenRecord = await authRepo.rotateRefreshToken(
				currentTokenRecord.id,
				{
					userId: currentTokenRecord.userId,
					tenantId: currentTokenRecord.tenantId,
					token: hashToken(newRefreshToken),
					expiresAt: new Date(Date.now() + REFRESH_TOKEN_MS),
				}
			);
			const user = await userService.findOne(newTokenRecord.userId);
			let role: Role;
			let tenantId: number | null;
			if (user.isSuperAdmin) {
				role = Roles.SUPER_ADMIN;
				tenantId = null;
			} else {
				if (newTokenRecord.tenantId === null) {
					throw DomainError.invalidCredentials();
				}
				const roleName = await userService.getUserRoleInTenant(
					newTokenRecord.userId,
					newTokenRecord.tenantId
				);
				if (!roleName) {
					throw DomainError.invalidCredentials();
				}
				role = roleName as Role;
				tenantId = newTokenRecord.tenantId;
			}
			const accessToken = await generateAccessToken({
				userId: newTokenRecord.userId,
				role,
				tenantId,
			});
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
