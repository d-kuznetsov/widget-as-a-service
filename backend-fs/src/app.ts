import { FastifyPluginAsync, FastifyServerOptions } from 'fastify';
import { userModule } from './modules/user/user.module';
import envPlugin from './plugins/env.plugin';

export interface AppOptions extends FastifyServerOptions {}

// Pass --options via CLI arguments in command to enable these options.
const options: AppOptions = {};

const app: FastifyPluginAsync<AppOptions> = async (
	fastify,
	opts
): Promise<void> => {
	await fastify.register(envPlugin).ready(() => {
		console.log(fastify.config);
	});
	await fastify.register(userModule);
};

export default app;
export { app, options };
