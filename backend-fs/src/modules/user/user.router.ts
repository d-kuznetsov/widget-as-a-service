import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
import { FastifyInstance } from 'fastify';
import { createUserRepository } from './user.repository';
import {
	createUserResponseSchema,
	userCreateSchema,
	userFindOneParamsSchema,
	userFindOneResponseSchema,
} from './user.schema';
import { createUserService } from './user.service';

export default async function userRouter(fastify: FastifyInstance) {
	const repo = createUserRepository(fastify.db);
	const service = createUserService(repo);

	fastify.withTypeProvider<TypeBoxTypeProvider>().post('/', {
		schema: {
			body: userCreateSchema,
			response: {
				201: createUserResponseSchema,
			},
		},
		handler: async (request, reply) => {
			const user = await service.create(request.body);
			reply.code(201);
			return user;
		},
	});

	fastify.withTypeProvider<TypeBoxTypeProvider>().get('/:id', {
		schema: {
			params: userFindOneParamsSchema,
			response: {
				200: userFindOneResponseSchema,
			},
		},
		handler: async (request, reply) => {
			const user = await service.findOne(request.params.id);
			return user;
		},
	});
}
