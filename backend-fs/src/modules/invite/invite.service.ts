import { randomBytes } from 'node:crypto';
import { Invite } from '../../db/schema';
import { DomainError } from '../../shared/errors';
import { type Role, Roles } from '../../shared/utils/roles';
import { InviteRepository } from './invite.repository';
import { InviteCreateInput } from './invite.schema';

export type InviteDeleteActor = {
	role: Role;
	tenantId: number | null;
};

const INVITE_TOKEN_BYTES = 32;
const INVITE_EXPIRES_HOURS = 24;

function generateInviteToken(): string {
	return randomBytes(INVITE_TOKEN_BYTES).toString('hex');
}
export interface InviteService {
	create: (input: Required<InviteCreateInput>) => Promise<Invite>;
	findByToken: (token: string) => Promise<Invite | null>;
	delete: (id: number, actor: InviteDeleteActor) => Promise<Invite>;
}

export function createInviteService(repo: InviteRepository): InviteService {
	return {
		create: async (input: Required<InviteCreateInput>) => {
			return repo.create({
				...input,
				token: generateInviteToken(),
				expiresAt: new Date(Date.now() + 1000 * 60 * 60 * INVITE_EXPIRES_HOURS),
			});
		},
		findByToken: async (token: string) => {
			return repo.findByToken(token);
		},
		delete: async (id: number, actor: InviteDeleteActor) => {
			if (actor.role === Roles.TENANT_ADMIN) {
				const invite = await repo.delete(id, actor.tenantId as number);
				if (!invite) {
					throw DomainError.inviteNotFound();
				}
				return invite;
			}
			if (actor.role === Roles.SUPER_ADMIN) {
				const invite = await repo.delete(id);
				if (!invite) {
					throw DomainError.inviteNotFound();
				}
				return invite;
			}
			throw DomainError.badRequest({
				message: 'Cannot delete invite with this role',
			});
		},
	};
}
