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

	fastify.decorateRequest(
		'generateToken',
		async function (this: FastifyRequest) {
			const token = await fastify.jwt.sign(
				{
					id: this.user.id,
					firstName: this.user.firstName,
					lastName: this.user.lastName,
				},
				{
					jti: String(Date.now()),
					expiresIn: '1h', //fastify.config.JWT_EXPIRE_IN,
				}
			);

			return token;
		}
	);
});

declare module 'fastify' {
	export interface FastifyInstance {}
}

declare module '@fastify/jwt' {
	interface FastifyJWT {
		payload: { id: number; firstName: string; lastName: string }; // payload type is used for signing and verifying
		user: {
			id: number;
			firstName: string;
			lastName: string;
			jti: string;
		};
	}
}
