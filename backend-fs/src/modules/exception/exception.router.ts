import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
import { FastifyInstance } from 'fastify';
import { Type } from 'typebox';
import { Roles } from '../../shared/utils/roles';
import {
	exceptionBaseParamsSchema,
	exceptionCreateSchema,
	exceptionParamsSchema,
	exceptionResponseSchema,
	exceptionUpdateSchema,
} from './exception.schema';
import { ExceptionService } from './exception.service';

export interface ExceptionRouterOptions {
	service: ExceptionService;
}

export async function initExceptionRouter(
	fastify: FastifyInstance,
	options: ExceptionRouterOptions
) {
	const { service } = options;

	fastify.withTypeProvider<TypeBoxTypeProvider>().post('/', {
		schema: {
			params: exceptionBaseParamsSchema,
			body: exceptionCreateSchema,
			response: {
				201: exceptionResponseSchema,
			},
		},
		onRequest: [fastify.authenticate([Roles.TENANT_ADMIN, Roles.SUPER_ADMIN])],
		handler: async (request, reply) => {
			const created = await service.create(
				request.params.tenantId,
				request.body
			);
			reply.code(201);
			return created;
		},
	});
	fastify.withTypeProvider<TypeBoxTypeProvider>().get('/', {
		schema: {
			params: exceptionBaseParamsSchema,
			response: {
				200: Type.Array(exceptionResponseSchema),
			},
		},
		onRequest: [
			fastify.authenticate([
				Roles.TENANT_ADMIN,
				Roles.SUPER_ADMIN,
				Roles.SPECIALIST,
			]),
		],
		handler: (request) => {
			return service.findAll(request.params.tenantId);
		},
	});
	fastify.withTypeProvider<TypeBoxTypeProvider>().get('/:id', {
		schema: {
			params: exceptionParamsSchema,
			response: {
				200: exceptionResponseSchema,
			},
		},
		onRequest: [
			fastify.authenticate([
				Roles.TENANT_ADMIN,
				Roles.SUPER_ADMIN,
				Roles.SPECIALIST,
			]),
		],
		handler: (request) => {
			return service.findOne(request.params.tenantId, request.params.id);
		},
	});
	fastify.withTypeProvider<TypeBoxTypeProvider>().put('/:id', {
		schema: {
			params: exceptionParamsSchema,
			body: exceptionUpdateSchema,
			response: {
				200: exceptionResponseSchema,
			},
		},
		onRequest: [fastify.authenticate([Roles.TENANT_ADMIN, Roles.SUPER_ADMIN])],
		handler: async (request) => {
			return service.update(
				request.params.tenantId,
				request.params.id,
				request.body
			);
		},
	});
	fastify.withTypeProvider<TypeBoxTypeProvider>().delete('/:id', {
		schema: {
			params: exceptionParamsSchema,
		},
		onRequest: [fastify.authenticate([Roles.TENANT_ADMIN, Roles.SUPER_ADMIN])],
		handler: async (request, reply) => {
			await service.delete(request.params.tenantId, request.params.id);
			reply.code(204);
		},
	});
}
