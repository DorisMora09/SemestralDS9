
async function routes(fastify, options) {
    fastify.get('/', async (request, reply) => {
        return { status: 'ok', message: 'Service is running' };

    });
}

module.exports = routes;