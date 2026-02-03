import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
import { FastifyInstance } from 'fastify';
import { createUserSchema } from './user.schema';

export default async function userRouter(fastify: FastifyInstance) {
	fastify.withTypeProvider<TypeBoxTypeProvider>().post('/', {
		schema: {
			body: createUserSchema,
			response: {
				201: createUserSchema,
			},
		},
		handler: async (request, reply) => {
			reply.code(201);
			return request.body;
		},
	});
}
