import { drizzle } from 'drizzle-orm/node-postgres';
import fp from 'fastify-plugin';

export default fp(async (fastify, opts) => {
	const db = drizzle(fastify.config.DATABASE_URL);
	fastify.decorate('db', db);
});

declare module 'fastify' {
	export interface FastifyInstance {
		db: ReturnType<typeof drizzle>;
	}
}
