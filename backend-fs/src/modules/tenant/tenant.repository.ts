import { eq } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { Tenant, tenantsTable } from '../../db/schema';
import { RepositoryError } from '../../shared/errors';
import { TenantCreateInput, TenantUpdateInput } from './tenant.schema';

export interface TenantRepository {
	create: (tenant: TenantCreateInput) => Promise<Tenant>;
	findOne: (id: number) => Promise<Tenant | null>;
	findAll: () => Promise<Tenant[]>;
	update: (id: number, tenant: TenantUpdateInput) => Promise<Tenant | null>;
	delete: (id: number) => Promise<Tenant>;
}

export function createTenantRepository(db: NodePgDatabase): TenantRepository {
	return {
		create: async (input: TenantCreateInput) => {
			try {
				const [tenant] = await db
					.insert(tenantsTable)
					.values(input)
					.returning();
				return tenant;
			} catch (error) {
				throw new RepositoryError({ cause: error as Error });
			}
		},
		findOne: async (id: number) => {
			try {
				const [tenant] = await db
					.select()
					.from(tenantsTable)
					.where(eq(tenantsTable.id, id))
					.limit(1);
				return tenant ?? null;
			} catch (error) {
				throw new RepositoryError({ cause: error as Error });
			}
		},
		findAll: async () => {
			try {
				return await db.select().from(tenantsTable);
			} catch (error) {
				throw new RepositoryError({ cause: error as Error });
			}
		},
		update: async (id: number, tenant: TenantUpdateInput) => {
			try {
				const [updatedTenant] = await db
					.update(tenantsTable)
					.set(tenant)
					.where(eq(tenantsTable.id, id))
					.returning();
				return updatedTenant ?? null;
			} catch (error) {
				throw new RepositoryError({ cause: error as Error });
			}
		},
		delete: async (id: number) => {
			try {
				const [deletedTenant] = await db
					.delete(tenantsTable)
					.where(eq(tenantsTable.id, id))
					.returning();
				return deletedTenant ?? null;
			} catch (error) {
				throw new RepositoryError({ cause: error as Error });
			}
		},
	};
}
