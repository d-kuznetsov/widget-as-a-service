import { FastifyInstance } from 'fastify';

export default async function userController(fastify: FastifyInstance) {
	fastify.post('/', {
		schema: {
			body: {
				type: 'object',
				properties: {
					name: { type: 'string' },
				},
			},
		},
		handler: async (request, reply) => {
			return reply.send({ message: 'User created' });
		},
	});
}
