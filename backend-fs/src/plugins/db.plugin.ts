import { drizzle, NodePgDatabase } from 'drizzle-orm/node-postgres';
import fp from 'fastify-plugin';

export default fp(async (fastify) => {
	const db = drizzle(process.env.DATABASE_URL as string);
	fastify.decorate('db', db);
});

declare module 'fastify' {
	export interface FastifyInstance {
		db: NodePgDatabase;
	}
}
