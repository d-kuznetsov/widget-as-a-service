import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
import { FastifyInstance } from 'fastify';
import { Type } from 'typebox';
import { Roles } from '../../shared/utils/roles';
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
		onRequest: [fastify.authenticate([Roles.SUPER_ADMIN])],
		handler: async (request, reply) => {
			const tenant = await service.create(request.body);
			reply.code(201);
			return tenant;
		},
	});
	fastify.withTypeProvider<TypeBoxTypeProvider>().get('/:tenantId', {
		schema: {
			params: tenantParamsSchema,
			response: {
				200: tenantResponseSchema,
			},
		},
		onRequest: [fastify.authenticate([Roles.TENANT_ADMIN, Roles.SUPER_ADMIN])],
		handler: async (request) => {
			const tenant = await service.findOne(request.params.tenantId);
			return tenant;
		},
	});
	fastify.withTypeProvider<TypeBoxTypeProvider>().put('/:tenantId', {
		schema: {
			params: tenantParamsSchema,
			body: tenantUpdateSchema,
			response: {
				200: tenantResponseSchema,
				403: Type.Object({ message: Type.String() }),
			},
		},
		onRequest: [fastify.authenticate([Roles.TENANT_ADMIN, Roles.SUPER_ADMIN])],
		handler: async (request) => {
			const tenant = await service.update(
				request.params.tenantId,
				request.body
			);
			return tenant;
		},
	});
	fastify.withTypeProvider<TypeBoxTypeProvider>().delete('/:tenantId', {
		schema: {
			params: tenantParamsSchema,
		},
		onRequest: [fastify.authenticate([Roles.SUPER_ADMIN])],
		handler: async (request, reply) => {
			await service.delete(request.params.tenantId);
			reply.code(204);
			return;
		},
	});
}
