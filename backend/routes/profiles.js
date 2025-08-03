const profilesController = require('../controllers/profilesController');
const { profileSchema } = require('../schemas/profiles');

async function routes(fastify, options) {
    const { authenticate } = fastify;

    fastify.get('/profiles', profilesController.getAll); // se puede eliminar
    fastify.get('/profiles/:id', { preHandler: [authenticate] }, profilesController.getById);
    fastify.post('/profiles', { schema: { body: profileSchema } }, profilesController.create);
    fastify.put('/profiles/:id', { schema: { body: profileSchema, preHandler: [authenticate] } }, profilesController.update);
    fastify.delete('/profiles/:id', profilesController.remove); // se puede eliminar
}

module.exports = routes;