const ordersController = require('../controllers/ordersController');
const { orderSchema } = require('../schemas/orders');

async function routes(fastify, options) {
    const { authenticate } = fastify;

    fastify.get('/orders', ordersController.getAll); // hay que camiarlo por listar pedidos de un usuario
    fastify.get('/orders/:id', { preHandler: [authenticate] }, ordersController.getById);
    fastify.post('/orders', { schema: { body: orderSchema, preHandler: [authenticate] } }, ordersController.create);
    fastify.put('/orders/:id', { schema: { body: orderSchema } }, ordersController.update);
    fastify.delete('/orders/:id', ordersController.remove);
}

module.exports = routes;