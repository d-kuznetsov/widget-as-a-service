import { eq } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { Invite, invitesTable, NewInvite } from '../../db/schema';
import { DataBaseError, DomainError } from '../../shared/errors';
import {
	isPgErrorWithCause,
	PostgresErrorCode,
} from '../../shared/utils/pg-errors';

export interface InviteRepository {
	create: (invite: NewInvite) => Promise<Invite>;
	findByToken: (token: string) => Promise<Invite | null>;
	delete: (id: number) => Promise<Invite | null>;
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
				if (
					isPgErrorWithCause(error) &&
					error.cause?.code === PostgresErrorCode.UNIQUE_VIOLATION
				) {
					throw DomainError.inviteAlreadyExists({
						message: 'Invite already exists',
					});
				}
				throw new DataBaseError({ cause: error as Error });
			}
		},
		findByToken: async (token: string) => {
			try {
				const [invite] = await db
					.select()
					.from(invitesTable)
					.where(eq(invitesTable.token, token));
				return invite ?? null;
			} catch (error) {
				throw new DataBaseError({ cause: error as Error });
			}
		},
		delete: async (id: number) => {
			try {
				const [invite] = await db
					.delete(invitesTable)
					.where(eq(invitesTable.id, id))
					.returning();
				return invite ?? null;
			} catch (error) {
				throw new DataBaseError({ cause: error as Error });
			}
		},
	};
}
