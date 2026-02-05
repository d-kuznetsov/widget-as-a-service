import { FastifyPluginAsync, FastifyServerOptions } from 'fastify';
import {
	createUserRepository,
	createUserService,
	initUserRouter,
} from './modules/user';
import dbPlugin from './plugins/db.plugin';
import envPlugin from './plugins/env.plugin';

export interface AppOptions extends FastifyServerOptions {}

// Pass --options via CLI arguments in command to enable these options.
const options: AppOptions = {};

const app: FastifyPluginAsync<AppOptions> = async (fastify) => {
	await fastify.register(envPlugin).ready(() => {
		console.log(fastify.config);
	});
	await fastify.register(dbPlugin);

	await fastify.register(initUserRouter, {
		prefix: '/users',
		service: createUserService(createUserRepository(fastify.db)),
	});
};

export default app;
export { app, options };
