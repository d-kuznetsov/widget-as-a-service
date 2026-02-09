import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
import { FastifyInstance } from 'fastify';
import { Role } from '../../shared/utils/roles';
import {
	userCreateSchema,
	userParamsSchema,
	userResponseSchema,
	userUpdateRolesSchema,
	userUpdateSchema,
} from './user.schema';
import { UserService } from './user.service';

export interface UserRouterOptions {
	service: UserService;
}

export async function initUserRouter(
	fastify: FastifyInstance,
	options: UserRouterOptions
) {
	const { service } = options;

	fastify.withTypeProvider<TypeBoxTypeProvider>().post('/', {
		schema: {
			body: userCreateSchema,
			response: {
				201: userResponseSchema,
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
			params: userParamsSchema,
			response: {
				200: userResponseSchema,
			},
		},
		handler: async (request) => {
			const user = await service.findOne(request.params.id);
			return user;
		},
	});

	fastify.withTypeProvider<TypeBoxTypeProvider>().put('/:id', {
		schema: {
			params: userParamsSchema,
			body: userUpdateSchema,
			response: {
				200: userResponseSchema,
			},
		},
		handler: async (request) => {
			const user = await service.update(request.params.id, request.body);
			return user;
		},
	});

	fastify.withTypeProvider<TypeBoxTypeProvider>().delete('/:id', {
		schema: {
			params: userParamsSchema,
		},
		handler: async (request, reply) => {
			await service.delete(request.params.id);
			reply.code(204);
			return;
		},
	});
	fastify.withTypeProvider<TypeBoxTypeProvider>().put('/:id/roles', {
		schema: {
			params: userParamsSchema,
			body: userUpdateRolesSchema,
		},
		handler: async (request, reply) => {
			await service.updateRoles(
				request.params.id,
				request.body.roles as Role[]
			);
			reply.code(204);
			return;
		},
	});
}
