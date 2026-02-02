import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
import { FastifyInstance } from 'fastify';
import { userSchema } from './user.schema';

export default async function userController(fastify: FastifyInstance) {
	fastify.withTypeProvider<TypeBoxTypeProvider>().post('/', {
		schema: {
			body: userSchema,
			response: {
				201: userSchema,
			},
		},
		handler: async (request, reply) => {
			reply.code(201);
			return request.body;
		},
	});
}
