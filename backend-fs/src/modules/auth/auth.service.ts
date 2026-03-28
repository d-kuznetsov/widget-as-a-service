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
import { LoginResponse, RegisterInput } from './auth.schema';

const REFRESH_TOKEN_MS = 7 * 24 * 60 * 60 * 1000;
const REFRESH_TOKEN_BYTES = 32;

export interface AuthServiceDeps {
	userService: UserService;
	inviteService: InviteService;
	authRepo: AuthRepository;
	generateAccessToken: (opts: GenerateAccessTokenOptions) => Promise<string>;
}

export interface AuthService {
	login: (
		email: string,
		password: string,
		tenantSlug: string
	) => Promise<LoginResponse>;
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
			token: hashToken(refreshToken),
			expiresAt,
		});
		return { accessToken, refreshToken };
	}

	return {
		login: async (email, password, tenantSlug) => {
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
				const tenantRole = await userService.getUserTenantContext(
					user.id,
					tenantSlug
				);
				if (tenantRole === null) throw DomainError.invalidCredentials();
				role = tenantRole.roleName as Role;
				tenantId = tenantRole.tenantId;
			}
			return issueLoginResponse(user, role, tenantId);
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
			const roleName = await userService.getRoleNameById(invite.roleId);
			if (!roleName) {
				throw DomainError.roleNotFound();
			}
			return issueLoginResponse(user, roleName as Role, invite.tenantId);
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
			const accessToken = await generateAccessToken({
				userId: newTokenRecord.userId,
				role: refreshedUser.isSuperAdmin ? Roles.SUPER_ADMIN : Roles.CLIENT,
				tenantId: null,
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
