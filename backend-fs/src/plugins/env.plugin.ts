import fsEnv from '@fastify/env';
import fp from 'fastify-plugin';

const schema = {
	type: 'object',
	required: ['DATABASE_URL'],
	properties: {
		DATABASE_PATH: {
			type: 'string',
			default: 'src/database/db.sqlite',
		},
	},
};

const options = {
	confKey: 'config', // optional, default: 'config'
	schema: schema,
	// data: data // optional, default: process.env
};

export default fp(async (fastify) => {
	fastify.register(fsEnv, options);
});

declare module 'fastify' {
	export interface FastifyInstance {
		config: {
			DATABASE_PATH: string;
		};
	}
}
