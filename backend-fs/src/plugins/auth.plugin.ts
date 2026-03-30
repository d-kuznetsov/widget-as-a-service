import fastifyJwt from '@fastify/jwt';
import { FastifyReply, FastifyRequest } from 'fastify';
import fp from 'fastify-plugin';
import { type Role, Roles } from '../shared/utils/roles';

export interface GenerateAccessTokenOptions {
	userId: number;
	role: Role;
	tenantId?: number | null;
}

export default fp(async (fastify) => {
	fastify.register(fastifyJwt, {
		secret: process.env.JWT_SECRET as string,
	});

	fastify.decorate(
		'authenticate',
		(roles: readonly Role[]) =>
			async (request: FastifyRequest, reply: FastifyReply) => {
				try {
					await request.jwtVerify();
				} catch (err) {
					reply.send(err);
					return;
				}
				if (roles.length > 0 && !roles.includes(request.user.role)) {
					reply.code(403).send({ message: 'Forbidden' });
				}
				if (
					request.user.role !== Roles.SUPER_ADMIN &&
					request.user.tenantId !==
						Number((request.params as { tenantId: string }).tenantId)
				) {
					reply.code(403).send({ message: 'Forbidden' });
					return;
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
			roles: readonly Role[]
		) => (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
	}
}

declare module '@fastify/jwt' {
	interface FastifyJWT {
		payload: {
			sub: number;
			role: Role;
			tenantId: number | null;
		};
		user: {
			sub: number;
			role: Role;
			tenantId: number | null;
		};
	}
}
