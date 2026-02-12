import fastifyJwt from '@fastify/jwt';
import { FastifyReply, FastifyRequest } from 'fastify';
import fp from 'fastify-plugin';

export interface AuthPayload {
	id: number;
	roles: string[];
}

export default fp(async (fastify) => {
	fastify.register(fastifyJwt, {
		secret: fastify.config.JWT_SECRET,
		// trusted: (_, decodedToken) => {
		// 	return !revokedTokens.has(decodedToken.jti as string);
		// },
	});

	fastify.decorate(
		'authenticate',
		async (request: FastifyRequest, reply: FastifyReply) => {
			try {
				await request.jwtVerify(); // populate the request.user with the current user
			} catch (err) {
				reply.send(err);
			}
		}
	);

	fastify.decorate('generateAccessToken', async (payload: AuthPayload) => {
		return fastify.jwt.sign(
			{ ...payload, sub: payload.id },
			{ jti: String(Date.now()), expiresIn: '1h' }
		);
	});

	fastify.decorate('generateRefreshToken', async (userId: number) => {
		return fastify.jwt.sign(
			{ sub: userId },
			{ jti: String(Date.now()), expiresIn: '7d' }
		);
	});
});

declare module 'fastify' {
	export interface FastifyInstance {
		generateAccessToken: (payload: AuthPayload) => Promise<string>;
		generateRefreshToken: (userId: number) => Promise<string>;
		authenticate: (
			request: FastifyRequest,
			reply: FastifyReply
		) => Promise<void>;
	}
}

declare module '@fastify/jwt' {
	interface FastifyJWT {
		payload: {
			sub?: number;
			id?: number;
			roles?: string[];
			// iat?: number;
			// exp?: number;
		};
		user: {
			id: number;
			roles?: string[];
		};
	}
}
