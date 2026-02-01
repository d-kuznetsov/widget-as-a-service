import { FastifyInstance } from 'fastify';
import userController from './user.controller';

export async function userModule(fastify: FastifyInstance) {
	fastify.register(userController, { prefix: '/users' });
}
