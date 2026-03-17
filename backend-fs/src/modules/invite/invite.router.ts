import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
import { FastifyInstance } from 'fastify';
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
		handler: async (request, reply) => {
			const invite = await service.create(request.body);
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
