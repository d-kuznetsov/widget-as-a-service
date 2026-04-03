import { randomBytes } from 'node:crypto';
import { Invite } from '../../db/schema';
import { DomainError } from '../../shared/errors';
import type { SpecialistRepository } from '../specialist/specialist.repository';
import { InviteRepository } from './invite.repository';
import { InviteCreateInput } from './invite.schema';

const INVITE_TOKEN_BYTES = 32;
const INVITE_EXPIRES_HOURS = 24;

function generateInviteToken(): string {
	return randomBytes(INVITE_TOKEN_BYTES).toString('hex');
}

type InviteCreateParams = InviteCreateInput & { tenantId: number };

export interface InviteServiceDeps {
	repo: InviteRepository;
	specialistRepo: SpecialistRepository;
}

export interface InviteService {
	create: (input: InviteCreateParams) => Promise<Invite>;
	findByToken: (token: string) => Promise<Invite | null>;
	delete: (id: number) => Promise<Invite>;
}

export function createInviteService(deps: InviteServiceDeps): InviteService {
	const { repo, specialistRepo } = deps;
	return {
		create: async (input: InviteCreateParams) => {
			if (input.specialistId != null) {
				const specialist = await specialistRepo.findOne(input.specialistId);
				if (!specialist) {
					throw DomainError.specialistNotFound();
				}
				if (specialist.tenantId !== input.tenantId) {
					throw DomainError.badRequest({
						message: 'Specialist does not belong to this tenant',
					});
				}
			}
			return repo.create({
				...input,
				token: generateInviteToken(),
				expiresAt: new Date(Date.now() + 1000 * 60 * 60 * INVITE_EXPIRES_HOURS),
			});
		},
		findByToken: async (token: string) => {
			return repo.findByToken(token);
		},
		delete: async (id: number) => {
			const invite = await repo.delete(id);
			if (!invite) {
				throw DomainError.inviteNotFound();
			}
			return invite;
		},
	};
}
