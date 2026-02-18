import fastifyJwt from '@fastify/jwt';
import { FastifyReply, FastifyRequest } from 'fastify';
import fp from 'fastify-plugin';

export default fp(async (fastify) => {
	fastify.register(fastifyJwt, {
		secret: fastify.config.JWT_SECRET,
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
		async (userId: number, scope: string[]): Promise<string> => {
			return fastify.jwt.sign({ sub: userId, scope }, { expiresIn: '1h' });
		}
	);
});

declare module 'fastify' {
	export interface FastifyInstance {
		generateAccessToken: (userId: number, scope: string[]) => Promise<string>;
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
			scope: string[];
		};
		user: {
			sub: number;
			scope: string[];
		};
	}
}
