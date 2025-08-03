const employeesController = require('../controllers/employeesController');
const { employeeSchema } = require('../schemas/employees');

async function routes(fastify, options) {

    fastify.get('/employees', employeesController.getAll);
    fastify.get('/employees/:id', employeesController.getById);
    fastify.post('/employees', { schema: { body: employeeSchema } }, employeesController.create); // se puede eliminar, control admin
    fastify.put('/employees/:id', { schema: { body: employeeSchema } }, employeesController.update); // se puede eliminar, control admin
}

module.exports = routes;