import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
import { FastifyInstance } from 'fastify';
import { Type } from 'typebox';
import { Roles } from '../../shared/utils/roles';
import {
	specialistBaseParamsSchema,
	specialistCreateSchema,
	specialistParamsSchema,
	specialistResponseSchema,
	specialistUpdateSchema,
} from './specialist.schema';
import { SpecialistService } from './specialist.service';

export interface SpecialistRouterOptions {
	service: SpecialistService;
}

export async function initSpecialistRouter(
	fastify: FastifyInstance,
	options: SpecialistRouterOptions
) {
	const { service } = options;

	fastify.withTypeProvider<TypeBoxTypeProvider>().post('/', {
		schema: {
			params: specialistBaseParamsSchema,
			body: specialistCreateSchema,
			response: {
				201: specialistResponseSchema,
				403: Type.Object({ message: Type.String() }),
			},
		},
		onRequest: [fastify.authenticate([Roles.TENANT_ADMIN, Roles.SUPER_ADMIN])],
		handler: async (request, reply) => {
			const specialist = await service.create({
				...request.body,
				tenantId: request.params.tenantId,
			});
			reply.code(201);
			return specialist;
		},
	});

	fastify.withTypeProvider<TypeBoxTypeProvider>().get('/', {
		schema: {
			params: specialistBaseParamsSchema,
			response: {
				200: Type.Array(specialistResponseSchema),
				403: Type.Object({ message: Type.String() }),
			},
		},
		onRequest: [fastify.authenticate([Roles.TENANT_ADMIN, Roles.SUPER_ADMIN])],
		handler: async (request) => {
			return service.findAll(request.params.tenantId);
		},
	});

	fastify.withTypeProvider<TypeBoxTypeProvider>().get('/:id', {
		schema: {
			params: specialistParamsSchema,
			response: {
				200: specialistResponseSchema,
				403: Type.Object({ message: Type.String() }),
			},
		},
		onRequest: [fastify.authenticate([Roles.TENANT_ADMIN, Roles.SUPER_ADMIN])],
		handler: async (request) => {
			return service.findOne(request.params.id);
		},
	});

	fastify.withTypeProvider<TypeBoxTypeProvider>().put('/:id', {
		schema: {
			params: specialistParamsSchema,
			body: specialistUpdateSchema,
			response: {
				200: specialistResponseSchema,
				403: Type.Object({ message: Type.String() }),
			},
		},
		onRequest: [fastify.authenticate([Roles.TENANT_ADMIN, Roles.SUPER_ADMIN])],
		handler: async (request) => {
			return service.update(request.params.id, request.body);
		},
	});

	fastify.withTypeProvider<TypeBoxTypeProvider>().delete('/:id', {
		schema: {
			params: specialistParamsSchema,
			response: {
				204: Type.Null(),
				403: Type.Object({ message: Type.String() }),
			},
		},
		onRequest: [fastify.authenticate([Roles.TENANT_ADMIN, Roles.SUPER_ADMIN])],
		handler: async (request, reply) => {
			await service.delete(request.params.id);
			reply.code(204);
		},
	});
}

export default initSpecialistRouter;
