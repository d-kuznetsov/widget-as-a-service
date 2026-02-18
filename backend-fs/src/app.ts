import { FastifyPluginAsync, FastifyServerOptions } from 'fastify';
import {
	createAuthRepository,
	createAuthService,
	initAuthRouter,
} from './modules/auth';
import {
	createUserRepository,
	createUserService,
	initUserRouter,
} from './modules/user';
import authPlugin from './plugins/auth.plugin';
import dbPlugin from './plugins/db.plugin';
import envPlugin from './plugins/env.plugin';
import errorHandlerPlugin from './plugins/error-handler.plugin';

export interface AppOptions extends FastifyServerOptions {}

// Pass --options via CLI arguments in command to enable these options.
const options: AppOptions = {};

const app: FastifyPluginAsync<AppOptions> = async (fastify) => {
	await fastify.register(errorHandlerPlugin);
	await fastify.register(envPlugin).ready(() => {
		console.log(fastify.config);
	});
	await fastify.register(dbPlugin);
	await fastify.register(authPlugin);
	const userService = createUserService(createUserRepository(fastify.db));
	await fastify.register(initUserRouter, {
		prefix: '/users',
		service: userService,
	});
	await fastify.register(initAuthRouter, {
		prefix: '/auth',
		service: createAuthService({
			userService,
			authRepo: createAuthRepository(fastify.db),
			generateAccessToken: fastify.generateAccessToken.bind(fastify),
		}),
	});
};

export default app;
export { app, options };
