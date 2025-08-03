const usersController = require('../controllers/usersController');
const { userSchema } = require('../schemas/users');

async function routes(fastify, options) {
    const { authenticate, authorizeSelfOnly } = fastify;

    fastify.get('/users', usersController.getAll); // este se debe borrar
    fastify.get('/users/:id', { preHandler: [authenticate, authorizeSelfOnly] }, usersController.getById);
    fastify.post('/users', { schema: { body: userSchema } }, usersController.create);
    fastify.put('/users/:id', { schema: { body: userSchema }, preHandler: [authenticate, authorizeSelfOnly] }, usersController.update); //falta revisar funcionalidad
    fastify.delete('/users/:id', { preHandler: [authenticate, authorizeSelfOnly] }, usersController.remove); // falta revisar funcionalidad
}

module.exports = routes;