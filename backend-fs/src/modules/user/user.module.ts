import { FastifyInstance } from 'fastify';
import userRouter from './user.router';

export async function userModule(fastify: FastifyInstance) {
	fastify.register(userRouter, { prefix: '/users' });
}
