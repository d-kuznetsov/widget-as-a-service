import { FastifyRequest } from 'fastify';

export interface AuthenticatedUser {
	sub: string;
	username: string;
	roles: string[];
}

export interface AuthenticatedRequest extends FastifyRequest {
	user: AuthenticatedUser;
}
