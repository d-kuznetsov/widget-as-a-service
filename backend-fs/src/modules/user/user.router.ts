import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
import { FastifyInstance } from 'fastify';
import { createUserRepository } from './user.repository';
import { createUserSchema } from './user.schema';
import { createUserService } from './user.service';

export default async function userRouter(fastify: FastifyInstance) {
	const repo = createUserRepository(fastify.db);
	const service = createUserService(repo);

	fastify.withTypeProvider<TypeBoxTypeProvider>().post('/', {
		schema: {
			body: createUserSchema,
			response: {
				//201: createUserSchema,
			},
		},
		handler: async (request, reply) => {
			const user = await service.createUser(request.body);
			reply.code(201);
			return user;
		},
	});
}
