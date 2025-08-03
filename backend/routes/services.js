const servicesController = require('../controllers/servicesController');
const { serviceSchema } = require('../schemas/services');

async function routes(fastify, options) {
    fastify.get('/services', servicesController.getAll);
    fastify.get('/services/:id', servicesController.getById);
    fastify.post('/services', { schema: { body: serviceSchema } }, servicesController.create); // se puede eliminar, control admin
    fastify.put('/services/:id', { schema: { body: serviceSchema } }, servicesController.update); // se puede eliminar, control admin
    fastify.delete('/services/:id', servicesController.remove); // se puede eliminar, control admin
}

module.exports = routes;