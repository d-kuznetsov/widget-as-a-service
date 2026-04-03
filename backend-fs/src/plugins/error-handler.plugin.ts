import fp from 'fastify-plugin';
import { AppError, DomainErrorCode } from '../shared/errors';

const mapErrorToStatusCode = (error: AppError) => {
	switch (error.code) {
		case DomainErrorCode.USER_NOT_FOUND:
		case DomainErrorCode.TENANT_NOT_FOUND:
		case DomainErrorCode.SPECIALIST_NOT_FOUND:
		case DomainErrorCode.SERVICE_NOT_FOUND:
			return 404;
		case DomainErrorCode.USER_ALREADY_EXISTS:
		case DomainErrorCode.TENANT_SLUG_ALREADY_EXISTS:
		case DomainErrorCode.SPECIALIST_NAME_ALREADY_EXISTS:
		case DomainErrorCode.SPECIALIST_USER_ALREADY_LINKED:
			return 409;
		case DomainErrorCode.INVALID_CREDENTIALS:
		case DomainErrorCode.AUTHENTICATION_ERROR:
			return 401;
		case DomainErrorCode.BAD_REQUEST:
		case DomainErrorCode.INVITE_NOT_FOUND:
		case DomainErrorCode.INVITE_EXPIRED:
		case DomainErrorCode.INVITE_ALREADY_USED:
		case DomainErrorCode.INVITE_ALREADY_EXISTS:
			return 400;
	}
	return 500;
};

export default fp(async (fastify, opts) => {
	fastify.setErrorHandler(function errorHandler(error, _, reply) {
		if (error instanceof AppError) {
			return reply.status(mapErrorToStatusCode(error)).send(error);
		}
		throw error;
	});
});
