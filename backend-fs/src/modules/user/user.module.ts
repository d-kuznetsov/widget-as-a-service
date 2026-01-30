import { FastifyInstance } from 'fastify';
import userRoutes from './user.routes';

export async function userModule(fastify: FastifyInstance) {
	fastify.register(userRoutes, { prefix: '/users' });
}
