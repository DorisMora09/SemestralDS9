require('dotenv').config();
const fastify = require('fastify')({ logger: true });

// Configuración de CORS
fastify.register(require('@fastify/cors'), {
    origin: (origin, cb) => {
        if (!origin) {
            cb(null, true);
            return;
        }

        try {
            const hostname = new URL(origin).hostname;
            if (hostname === "localhost" || hostname === "127.0.0.1") {
                cb(null, true);
            } else {
                cb(new Error('Not allowed'), false);
            }
        } catch (err) {
            cb(new Error('Invalid origin'), false);
        }
    }
});

// Plugin para raw body - Solo si planeas usar webhooks más adelante
// fastify.register(require('@fastify/raw-body'), {
//     global: false,
//     encoding: false,
//     runFirst: true,
//     routes: ['/api/stripe/webhook']
// });

// JWT setup
fastify.register(require('@fastify/jwt'), {
    secret: process.env.JWT_SECRET || 'supersecret'
});

// Stripe setup - Decorar fastify con instancia de Stripe
fastify.decorate('stripe', require('stripe')(process.env.STRIPE_SECRET_KEY));

// Validar que las variables de entorno de Stripe estén configuradas
if (!process.env.STRIPE_SECRET_KEY) {
    fastify.log.error('❌ STRIPE_SECRET_KEY no está configurada en las variables de entorno');
    process.exit(1);
}

if (!process.env.STRIPE_PUBLISHABLE_KEY) {
    fastify.log.warn('⚠️  STRIPE_PUBLISHABLE_KEY no está configurada - necesaria para el frontend');
}

// Webhooks son opcionales para desarrollo
// if (!process.env.STRIPE_WEBHOOK_SECRET) {
//     fastify.log.warn('⚠️  STRIPE_WEBHOOK_SECRET no está configurada - necesaria para webhooks');
// }

// Decorar `request` con método `verifyJWT()`
fastify.decorate("authenticate", async function (request, reply) {
    try {
        await request.jwtVerify();
    } catch (err) {
        reply.code(401).send({ error: "Unauthorized" });
    }
});

// Middleware de autorización para acceso propio
fastify.decorate('authorizeSelfOnly', async (request, reply) => {
    const userIdFromToken = request.user.id;
    const targetUserId = request.params.id;

    if (userIdFromToken !== targetUserId) {
        return reply.code(403).send({ error: 'Forbidden: Unauthorized access' });
    }
});

// Registrar todas las rutas
fastify.register(require('./routes/auth'));
fastify.register(require('./routes/users'));
fastify.register(require('./routes/profiles'));
fastify.register(require('./routes/payments'));
fastify.register(require('./routes/services'));
fastify.register(require('./routes/orders'));
fastify.register(require('./routes/employees'));
fastify.register(require('./routes/health'));

// Registrar rutas de Stripe - IMPORTANTE: después de configurar Stripe
fastify.register(require('./routes/stripe'));

// Endpoint para obtener la clave pública de Stripe (para el frontend)
fastify.get('/api/stripe/config', async (request, reply) => {
    return {
        publishableKey: process.env.STRIPE_PUBLISHABLE_KEY
    };
});

// Manejo de errores global
fastify.setErrorHandler((error, request, reply) => {
    fastify.log.error(error);

    // Errores específicos de Stripe
    if (error.type && error.type.startsWith('Stripe')) {
        return reply.code(400).send({
            error: 'Payment processing error',
            message: error.message
        });
    }

    reply.code(500).send({
        error: 'Internal Server Error',
        message: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
    });
});

// Graceful shutdown
const gracefulShutdown = async (signal) => {
    fastify.log.info(`Received ${signal}, shutting down gracefully`);
    try {
        await fastify.close();
        process.exit(0);
    } catch (err) {
        fastify.log.error('Error during shutdown:', err);
        process.exit(1);
    }
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

const start = async () => {
    try {
        const port = process.env.PORT || 3000;
        const host = process.env.HOST || '0.0.0.0';

        await fastify.listen({ port, host });

        console.log(`🚀 Servidor corriendo en http://localhost:${port}`);
        console.log(`💳 Stripe configurado correctamente`);
        console.log(`🔑 Modo: ${process.env.STRIPE_SECRET_KEY?.startsWith('sk_live') ? 'PRODUCCIÓN' : 'DESARROLLO'}`);

    } catch (err) {
        fastify.log.error(err);
        process.exit(1);
    }
};

start();