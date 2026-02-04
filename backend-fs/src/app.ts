import { FastifyPluginAsync, FastifyServerOptions } from 'fastify';
import userRouter from './modules/user/user.router';
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
	await fastify.register(userRouter, { prefix: '/users' });
};

export default app;
export { app, options };
