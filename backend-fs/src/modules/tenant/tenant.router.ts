import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
import { FastifyInstance } from 'fastify';
import {
	tenantCreateSchema,
	tenantParamsSchema,
	tenantResponseSchema,
	tenantUpdateSchema,
} from './tenant.schema';
import { TenantService } from './tenant.service';

export interface TenantRouterOptions {
	service: TenantService;
}

export async function initTenantRouter(
	fastify: FastifyInstance,
	options: TenantRouterOptions
) {
	const { service } = options;

	fastify.withTypeProvider<TypeBoxTypeProvider>().post('/', {
		schema: {
			body: tenantCreateSchema,
			response: {
				201: tenantResponseSchema,
			},
		},
		handler: async (request, reply) => {
			const tenant = await service.create(request.body);
			reply.code(201);
			return tenant;
		},
	});
	fastify.withTypeProvider<TypeBoxTypeProvider>().get('/:id', {
		schema: {
			params: tenantParamsSchema,
			response: {
				200: tenantResponseSchema,
			},
		},
		handler: async (request) => {
			const tenant = await service.findOne(request.params.id);
			return tenant;
		},
	});
	fastify.withTypeProvider<TypeBoxTypeProvider>().put('/:id', {
		schema: {
			params: tenantParamsSchema,
			body: tenantUpdateSchema,
			response: {
				200: tenantResponseSchema,
			},
		},
		handler: async (request) => {
			const tenant = await service.update(request.params.id, request.body);
			return tenant;
		},
	});
	fastify.withTypeProvider<TypeBoxTypeProvider>().delete('/:id', {
		schema: {
			params: tenantParamsSchema,
		},
		handler: async (request, reply) => {
			await service.delete(request.params.id);
			reply.code(204);
			return;
		},
	});
}
