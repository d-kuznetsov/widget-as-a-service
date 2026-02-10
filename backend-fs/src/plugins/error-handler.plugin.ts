import fp from 'fastify-plugin';
import {
	AppError,
	RepositoryErrorCode,
	ServiceErrorCode,
} from '../shared/errors';

const mapErrorToStatusCode = (error: AppError) => {
	switch (error.code) {
		case ServiceErrorCode.USER_NOT_FOUND:
			return 404;
		case ServiceErrorCode.USER_ALREADY_EXISTS:
			return 409;
		case RepositoryErrorCode.REPOSITORY_UNAVAILABLE:
			return 503;
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
