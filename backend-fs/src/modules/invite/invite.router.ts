import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
import { FastifyInstance } from 'fastify';
import { Type } from 'typebox';
import { Roles } from '../../shared/utils/roles';
import {
	inviteCreateParamsSchema,
	inviteCreateSchema,
	inviteDeleteParamsSchema,
	inviteResponseSchema,
} from './invite.schema';
import { InviteService } from './invite.service';

export interface InviteRouerOptions {
	service: InviteService;
}

export async function initInviteRouter(
	fastify: FastifyInstance,
	options: InviteRouerOptions
) {
	const { service } = options;

	fastify.withTypeProvider<TypeBoxTypeProvider>().post('/', {
		schema: {
			params: inviteCreateParamsSchema,
			body: inviteCreateSchema,
			response: {
				201: inviteResponseSchema,
				403: Type.Object({ message: Type.String() }),
			},
		},
		onRequest: [fastify.authenticate([Roles.TENANT_ADMIN, Roles.SUPER_ADMIN])],
		handler: async (request, reply) => {
			const invite = await service.create({
				email: request.body.email,
				roleId: request.body.roleId,
				tenantId: request.params.tenantId,
				specialistId: request.body.specialistId,
			});
			reply.code(201);
			return invite;
		},
	});

	fastify.withTypeProvider<TypeBoxTypeProvider>().delete('/:id', {
		schema: {
			params: inviteDeleteParamsSchema,
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

export default initInviteRouter;
