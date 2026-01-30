import { FastifyPluginAsync, FastifyServerOptions } from 'fastify';
import envPlugin from './plugins/env.plugin';

export interface AppOptions extends FastifyServerOptions {}

// Pass --options via CLI arguments in command to enable these options.
const options: AppOptions = {};

const app: FastifyPluginAsync<AppOptions> = async (
	fastify,
	opts
): Promise<void> => {
	fastify.register(envPlugin).ready(() => {
		console.log(fastify.config);
	});
};

export default app;
export { app, options };
