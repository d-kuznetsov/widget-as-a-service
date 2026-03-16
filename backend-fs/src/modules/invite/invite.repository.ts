import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { Invite, invitesTable, NewInvite } from '../../db/schema';
import { DataBaseError, DomainError } from '../../shared/errors';
import {
	isPgErrorWithCause,
	PostgresErrorCode,
} from '../../shared/utils/pg-errors';

export interface InviteRepository {
	create: (invite: NewInvite) => Promise<Invite>;
	// findOne: (id: number) => Promise<Invite | null>;
	// findAll: () => Promise<Invite[] | null>;
	// update: (id: number, invite: InviteUpdateInput) => Promise<Invite | null>;
	// delete: (id: number) => Promise<Invite | null>;
}

export function createInviteRepository(db: NodePgDatabase): InviteRepository {
	return {
		create: async (input: NewInvite) => {
			try {
				const [invite] = await db
					.insert(invitesTable)
					.values(input)
					.returning();
				return invite;
			} catch (error) {
				if (
					isPgErrorWithCause(error) &&
					error.cause?.code === PostgresErrorCode.FOREIGN_KEY_VIOLATION
				) {
					if (error.cause?.detail?.includes('tenantId')) {
						throw DomainError.tenantNotFound({
							message: 'Tenant not found',
						});
					}
					if (error.cause?.detail?.includes('role')) {
						throw DomainError.roleNotFound({
							message: 'Role not found',
						});
					}
				}
				throw new DataBaseError({ cause: error as Error });
			}
		},
	};
}
