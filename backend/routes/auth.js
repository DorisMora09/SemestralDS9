
const { getCollection } = require('../conection');
const bcrypt = require('bcrypt');

async function authRoutes(fastify, options) {

    fastify.post('/login', async (request, reply) => {
        console.log('-------------Login request received:', request.body);
        const { email, password } = request.body;
        const col = await getCollection('users');
        const user = await col.findOne({ email });

        if (!user) {
            return reply.code(401).send({ error: 'Usuario no encontrado' });
        }

        console.log(password, user.password);
        console.log("new pass: await" + bcrypt.hash(password, 10)); 
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return reply.code(401).send({ error: 'Contraseña incorrecta' });
        }

        const token = fastify.jwt.sign({
            id: user._id,
            email: user.email,
            username: user.username
        });

        reply.send({ token, user_id: user._id });
    });
}

module.exports = authRoutes;
