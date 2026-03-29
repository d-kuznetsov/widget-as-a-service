import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
import { FastifyInstance } from 'fastify';
import { DomainError } from '../../shared/errors';
import { Roles } from '../../shared/utils/roles';
import {
	inviteCreateSchema,
	inviteParamsSchema,
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
			body: inviteCreateSchema,
			response: {
				201: inviteResponseSchema,
			},
		},
		onRequest: [fastify.authenticate([Roles.TENANT_ADMIN, Roles.SUPER_ADMIN])],
		handler: async (request, reply) => {
			if (request.user.role === Roles.SUPER_ADMIN && !request.body.tenantId) {
				throw DomainError.badRequest({
					message: 'tenantId is required in request body',
				});
			} else if (request.body.tenantId) {
				throw DomainError.badRequest({
					message: 'tenantId is not allowed in request body',
				});
			}
			const invite = await service.create({
				...request.body,
				tenantId: (request.user.tenantId ?? request.body.tenantId) as number,
			});
			reply.code(201);
			return invite;
		},
	});

	fastify.withTypeProvider<TypeBoxTypeProvider>().delete('/:id', {
		schema: {
			params: inviteParamsSchema,
		},
		handler: async (request, reply) => {
			await service.delete(request.params.id);
			reply.code(204);
		},
	});
}

export default initInviteRouter;
