import { FastifyPluginAsync, FastifyServerOptions } from 'fastify';
import {
	createAuthRepository,
	createAuthService,
	initAuthRouter,
} from './modules/auth';
import {
	createInviteRepository,
	createInviteService,
	initInviteRouter,
} from './modules/invite';
import {
	createTenantRepository,
	createTenantService,
	initTenantRouter,
} from './modules/tenant';
import {
	createUserRepository,
	createUserService,
	initUserRouter,
} from './modules/user';
import authPlugin from './plugins/auth.plugin';
import cookiePlugin from './plugins/cookie.plugin';
import dbPlugin from './plugins/db.plugin';
import errorHandlerPlugin from './plugins/error-handler.plugin';

export interface AppOptions extends FastifyServerOptions {}

// Pass --options via CLI arguments in command to enable these options.
const options: AppOptions = {};

const app: FastifyPluginAsync<AppOptions> = async (fastify) => {
	await fastify.register(errorHandlerPlugin);
	await fastify.register(dbPlugin);
	await fastify.register(cookiePlugin);
	await fastify.register(authPlugin);

	const inviteService = createInviteService(createInviteRepository(fastify.db));
	const userService = createUserService(createUserRepository(fastify.db));
	await fastify.register(initUserRouter, {
		prefix: '/users',
		service: userService,
	});
	await fastify.register(initAuthRouter, {
		prefix: '/auth',
		service: createAuthService({
			userService,
			inviteService,
			authRepo: createAuthRepository(fastify.db),
			generateAccessToken: fastify.generateAccessToken.bind(fastify),
		}),
	});
	const tenantService = createTenantService(createTenantRepository(fastify.db));
	await fastify.register(initTenantRouter, {
		prefix: '/tenants',
		service: tenantService,
	});
	await fastify.register(initInviteRouter, {
		prefix: '/tenants/:tenantId/invites',
		service: inviteService,
	});
};

export default app;
export { app, options };
