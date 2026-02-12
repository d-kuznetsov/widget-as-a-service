import fastifyJwt from '@fastify/jwt';
import { FastifyReply, FastifyRequest } from 'fastify';
import fp from 'fastify-plugin';

export interface AuthPayload {
	id: number;
	roles: string[];
}

export type GenerateTokenOptions =
	| { type: 'access'; payload: AuthPayload }
	| { type: 'refresh'; userId: number };

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

	fastify.decorate(
		'generateToken',
		async (options: GenerateTokenOptions): Promise<string> => {
			const jti = String(Date.now());
			if (options.type === 'access') {
				const { id, ...rest } = options.payload;
				return fastify.jwt.sign({ ...rest, sub: id }, { jti, expiresIn: '1h' });
			}
			return fastify.jwt.sign(
				{ sub: options.userId },
				{ jti, expiresIn: '7d' }
			);
		}
	);
});

declare module 'fastify' {
	export interface FastifyInstance {
		generateToken: (options: GenerateTokenOptions) => Promise<string>;
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
