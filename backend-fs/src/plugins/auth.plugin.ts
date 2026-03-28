import fastifyJwt from '@fastify/jwt';
import { FastifyReply, FastifyRequest } from 'fastify';
import fp from 'fastify-plugin';

export interface GenerateAccessTokenOptions {
	userId: number;
	role: string;
	tenantId?: number | null;
}

export default fp(async (fastify) => {
	fastify.register(fastifyJwt, {
		secret: process.env.JWT_SECRET as string,
	});

	fastify.decorate(
		'authenticate',
		async (request: FastifyRequest, reply: FastifyReply) => {
			try {
				await request.jwtVerify();
			} catch (err) {
				reply.send(err);
			}
		}
	);

	fastify.decorate(
		'generateAccessToken',
		async (opts: GenerateAccessTokenOptions): Promise<string> => {
			const { userId, role, tenantId = null } = opts;
			return fastify.jwt.sign(
				{ sub: userId, role, tenantId },
				{ expiresIn: '1h' }
			);
		}
	);
});

declare module 'fastify' {
	export interface FastifyInstance {
		generateAccessToken: (opts: GenerateAccessTokenOptions) => Promise<string>;
		authenticate: (
			request: FastifyRequest,
			reply: FastifyReply
		) => Promise<void>;
	}
}

declare module '@fastify/jwt' {
	interface FastifyJWT {
		payload: {
			sub: number;
			role: string;
			tenantId: number | null;
		};
		user: {
			sub: number;
			role: string;
			tenantId: number | null;
		};
	}
}
