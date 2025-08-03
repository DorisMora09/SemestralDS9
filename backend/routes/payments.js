const paymentsController = require('../controllers/paymentsController');
const { paymentSchema } = require('../schemas/payments');

async function routes(fastify, options) {
    const { authenticate } = fastify;

    fastify.get('/payments', paymentsController.getAll); // se puede eliminar
    fastify.get('/payments/:id', { preHandler: [authenticate] }, paymentsController.getById);
    fastify.post('/payments', { schema: { body: paymentSchema }, preHandler: [authenticate] }, paymentsController.create);
    fastify.put('/payments/:id', { schema: { body: paymentSchema } }, paymentsController.update); // se puede eliminar
}

module.exports = routes;