import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
import { FastifyInstance } from 'fastify';
import { createUserRepository } from './user.repository';
import {
	createUserResponseSchema,
	updateUserResponseSchema,
	userCreateSchema,
	userFindOneParamsSchema,
	userFindOneResponseSchema,
	userUpdateSchema,
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
		handler: async (request) => {
			const user = await service.findOne(request.params.id);
			return user;
		},
	});

	fastify.withTypeProvider<TypeBoxTypeProvider>().put('/:id', {
		schema: {
			params: userFindOneParamsSchema,
			body: userUpdateSchema,
			response: {
				200: updateUserResponseSchema,
			},
		},
		handler: async (request) => {
			const user = await service.update(request.params.id, request.body);
			return user;
		},
	});

	fastify.withTypeProvider<TypeBoxTypeProvider>().delete('/:id', {
		schema: {
			params: userFindOneParamsSchema,
		},
		handler: async (request, reply) => {
			await service.delete(request.params.id);
			reply.code(204);
			return;
		},
	});
}
