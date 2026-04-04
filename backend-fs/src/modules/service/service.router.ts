import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
import { FastifyInstance } from 'fastify';
import { Type } from 'typebox';
import { Roles } from '../../shared/utils/roles';
import {
	assignSpecialistToServiceBodySchema,
	serviceBaseParamsSchema,
	serviceCreateSchema,
	serviceParamsSchema,
	serviceResponseSchema,
	serviceSpecialistResponseSchema,
	serviceUpdateSchema,
	unassignSpecialistFromServiceParamsSchema,
} from './service.schema';
import { ServiceService } from './service.service';

export interface ServiceRouterOptions {
	service: ServiceService;
}

export async function initServiceRouter(
	fastify: FastifyInstance,
	options: ServiceRouterOptions
) {
	const { service } = options;

	fastify.withTypeProvider<TypeBoxTypeProvider>().post('/', {
		schema: {
			params: serviceBaseParamsSchema,
			body: serviceCreateSchema,
			response: {
				201: serviceResponseSchema,
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
			params: serviceBaseParamsSchema,
			response: {
				200: Type.Array(serviceResponseSchema),
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
	fastify.withTypeProvider<TypeBoxTypeProvider>().post('/:id/specialists', {
		schema: {
			params: serviceParamsSchema,
			body: assignSpecialistToServiceBodySchema,
			response: {
				201: serviceSpecialistResponseSchema,
			},
		},
		onRequest: [fastify.authenticate([Roles.TENANT_ADMIN, Roles.SUPER_ADMIN])],
		handler: async (request, reply) => {
			const row = await service.assignSpecialistToService(
				request.params.tenantId,
				request.params.id,
				request.body.specialistId
			);
			reply.code(201);
			return row;
		},
	});
	fastify
		.withTypeProvider<TypeBoxTypeProvider>()
		.delete('/:id/specialists/:specialistId', {
			schema: {
				params: unassignSpecialistFromServiceParamsSchema,
				response: {
					200: serviceSpecialistResponseSchema,
				},
			},
			onRequest: [
				fastify.authenticate([Roles.TENANT_ADMIN, Roles.SUPER_ADMIN]),
			],
			handler: async (request) => {
				return service.unassignSpecialistFromService(
					request.params.tenantId,
					request.params.id,
					request.params.specialistId
				);
			},
		});
	fastify.withTypeProvider<TypeBoxTypeProvider>().get('/:id', {
		schema: {
			params: serviceParamsSchema,
			response: {
				200: serviceResponseSchema,
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
			return service.findOne(request.params.id);
		},
	});
	fastify.withTypeProvider<TypeBoxTypeProvider>().put('/:id', {
		schema: {
			params: serviceParamsSchema,
			body: serviceUpdateSchema,
			response: {
				200: serviceResponseSchema,
			},
		},
		onRequest: [fastify.authenticate([Roles.TENANT_ADMIN, Roles.SUPER_ADMIN])],
		handler: async (request) => {
			return service.update(request.params.id, request.body);
		},
	});
	fastify.withTypeProvider<TypeBoxTypeProvider>().delete('/:id', {
		schema: {
			params: serviceParamsSchema,
		},
		onRequest: [fastify.authenticate([Roles.TENANT_ADMIN, Roles.SUPER_ADMIN])],
		handler: async (request, reply) => {
			await service.delete(request.params.id);
			reply.code(204);
		},
	});
}
