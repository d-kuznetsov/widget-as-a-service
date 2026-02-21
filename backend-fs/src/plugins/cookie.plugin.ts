import cookie from '@fastify/cookie';
import fp from 'fastify-plugin';

export default fp(async (fastify) => {
	fastify.register(cookie);
});

// When using .decorate you have to specify added properties for Typescript
declare module 'fastify' {
	export interface FastifyRequest {}
}
