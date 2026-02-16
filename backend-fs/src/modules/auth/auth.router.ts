import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
import { FastifyInstance } from 'fastify';
import {
	refreshTokenSchema,
	signInResponseSchema,
	signInSchema,
	signOutSchema,
} from './auth.schema';
import { AuthService } from './auth.service';

export interface AuthRouterOptions {
	service: AuthService;
}

export async function initAuthRouter(
	fastify: FastifyInstance,
	options: AuthRouterOptions
) {
	const { service } = options;

	fastify.withTypeProvider<TypeBoxTypeProvider>().post('/login', {
		schema: {
			body: signInSchema,
			response: { 200: signInResponseSchema },
		},
		handler: async (request) => {
			const { email, password } = request.body;
			const tokens = await service.signIn(email, password);
			return tokens;
		},
	});

	fastify.withTypeProvider<TypeBoxTypeProvider>().post('/refresh', {
		schema: {
			body: refreshTokenSchema,
			response: { 200: signInResponseSchema },
		},
		handler: async (request) => {
			return service.refreshToken(request.body.refreshToken);
		},
	});

	fastify.withTypeProvider<TypeBoxTypeProvider>().post('/logout', {
		schema: {
			body: signOutSchema,
		},
		onRequest: [fastify.authenticate],
		handler: async (request, reply) => {
			await service.logout(request.body.refreshToken);
			reply.code(204);
		},
	});

	fastify.withTypeProvider<TypeBoxTypeProvider>().post('/logout-all', {
		preHandler: [fastify.authenticate],
		handler: async (request, reply) => {
			await service.logoutAll(request.user.id);
			reply.code(204);
		},
	});
}
