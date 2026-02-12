import fastifyJwt from '@fastify/jwt';
import { FastifyReply, FastifyRequest } from 'fastify';
import fp from 'fastify-plugin';

export default fp(async (fastify) => {
	const revokedTokens = new Map<string, boolean>();

	fastify.register(fastifyJwt, {
		secret: fastify.config.JWT_SECRET,
		trusted: (_, decodedToken) => {
			return !revokedTokens.has(decodedToken.jti as string);
		},
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

	fastify.decorateRequest('revokeToken', function (this: FastifyRequest) {
		revokedTokens.set(this.user.jti, true);
	});

	fastify.decorate(
		'generateAccessToken',
		async (payload: { id: number; firstName: string; lastName: string }) => {
			return fastify.jwt.sign(
				{ ...payload, sub: payload.id },
				{ jti: String(Date.now()), expiresIn: '1h' }
			);
		}
	);

	fastify.decorate('generateRefreshToken', async (userId: number) => {
		return fastify.jwt.sign(
			{ sub: userId },
			{ jti: String(Date.now()), expiresIn: '7d' }
		);
	});
});

declare module 'fastify' {
	export interface FastifyInstance {
		generateAccessToken: (payload: {
			id: number;
			firstName: string;
			lastName: string;
		}) => Promise<string>;
		generateRefreshToken: (userId: number) => Promise<string>;
	}
}

declare module '@fastify/jwt' {
	interface FastifyJWT {
		payload: {
			sub?: number;
			id?: number;
			firstName?: string;
			lastName?: string;
		};
		user: {
			id: number;
			firstName: string;
			lastName: string;
			jti: string;
		};
	}
}
