import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
import { FastifyInstance } from 'fastify';
import { Type } from 'typebox';
import { Roles } from '../../shared/utils/roles';
import {
	workingHoursBaseParamsSchema,
	workingHoursCreateSchema,
	workingHoursParamsSchema,
	workingHoursResponseSchema,
	workingHoursUpdateSchema,
} from './working-hours.schema';
import { WorkingHoursService } from './working-hours.service';

export interface WorkingHoursRouterOptions {
	service: WorkingHoursService;
}

export async function initWorkingHoursRouter(
	fastify: FastifyInstance,
	options: WorkingHoursRouterOptions
) {
	const { service } = options;

	fastify.withTypeProvider<TypeBoxTypeProvider>().post('/', {
		schema: {
			params: workingHoursBaseParamsSchema,
			body: workingHoursCreateSchema,
			response: {
				201: workingHoursResponseSchema,
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
			params: workingHoursBaseParamsSchema,
			response: {
				200: Type.Array(workingHoursResponseSchema),
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
			params: workingHoursParamsSchema,
			response: {
				200: workingHoursResponseSchema,
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
			params: workingHoursParamsSchema,
			body: workingHoursUpdateSchema,
			response: {
				200: workingHoursResponseSchema,
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
			params: workingHoursParamsSchema,
		},
		onRequest: [fastify.authenticate([Roles.TENANT_ADMIN, Roles.SUPER_ADMIN])],
		handler: async (request, reply) => {
			await service.delete(request.params.tenantId, request.params.id);
			reply.code(204);
		},
	});
}
