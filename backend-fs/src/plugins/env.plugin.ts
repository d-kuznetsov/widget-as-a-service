import fsEnv from '@fastify/env';
import fp from 'fastify-plugin';

const schema = {
	type: 'object',
	required: ['DATABASE_URL'],
	properties: {
		DATABASE_URL: {
			type: 'string',
		},
	},
};

const options = {
	confKey: 'config', // optional, default: 'config'
	schema: schema,
	dotenv: true,
	// data: data // optional, default: process.env
};

export default fp(async (fastify) => {
	fastify.register(fsEnv, options);
});

declare module 'fastify' {
	export interface FastifyInstance {
		config: {
			DATABASE_URL: string;
		};
	}
}
