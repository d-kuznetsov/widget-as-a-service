import { randomBytes } from 'node:crypto';
import { Invite } from '../../db/schema';
import { InviteRepository } from './invite.repository';
import { InviteCreateInput } from './invite.schema';

const INVITE_TOKEN_BYTES = 32;

function generateInviteToken(): string {
	return randomBytes(INVITE_TOKEN_BYTES).toString('hex');
}
export interface InviteService {
	create: (input: InviteCreateInput) => Promise<Invite>;
	findOne: (token: string) => Promise<Invite | null>;
}

export function createInviteService(repo: InviteRepository): InviteService {
	return {
		create: async (input: InviteCreateInput) => {
			return repo.create({
				...input,
				token: generateInviteToken(),
				expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24),
			});
		},
		findOne: async (token: string) => {
			return repo.findOne(token);
		},
	};
}

// email: string;
// tenantId: number;
// role: number;
// token: string;
// expiresAt: Date;
// createdAt?: Date | undefined;
// used?: boolean | undefined;

// email: string;
// tenantId: number;
// role: number;
