import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
import { FastifyInstance } from 'fastify';
import {
	loginResponseSchema,
	loginSchema,
	logoutSchema,
	refreshTokenSchema,
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
			body: loginSchema,
			response: { 200: loginResponseSchema },
		},
		handler: async (request) => {
			const { email, password } = request.body;
			const tokens = await service.login(email, password);
			return tokens;
		},
	});

	fastify.withTypeProvider<TypeBoxTypeProvider>().post('/refresh', {
		schema: {
			body: refreshTokenSchema,
			response: { 200: loginResponseSchema },
		},
		handler: async (request) => {
			return service.refreshToken(request.body.refreshToken);
		},
	});

	fastify.withTypeProvider<TypeBoxTypeProvider>().post('/logout', {
		schema: {
			body: logoutSchema,
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
