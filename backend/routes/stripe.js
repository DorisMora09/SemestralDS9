const servicesController = require('../controllers/servicesController');

module.exports = async function (fastify, opts) {

    // Crear sesión de checkout para un servicio específico
    fastify.get('/stripe/create/:id', {
        preHandler: fastify.authenticate
    }, async (request, reply) => {
        try {
            const { id } = request.params;

            // Obtener el servicio por ID
            const service = await servicesController.getById(request, reply);
            if (!service) {
                return reply.code(404).send({ error: 'Service not found' });
            }

            // Validar que el servicio tenga un precio definido
            if (!service.price || service.price <= 0) {
                return reply.code(400).send({ error: 'Service price must be greater than zero' });
            }

            const session = await fastify.stripe.checkout.sessions.create({
                payment_method_types: ['card'],
                line_items: [
                    {
                        price_data: {
                            currency: 'usd',
                            product_data: {
                                name: service.name, // ✅ Corregido: era item.name
                                description: service.description || `Servicio: ${service.name}`,
                            },
                            unit_amount: Math.round(service.price * 100), // ✅ Corregido: era item.price
                        },
                        quantity: 1,
                    },
                ],
                mode: 'payment',
                success_url: `http://127.0.0.1:5501/frontend/payment/index.html`,
                cancel_url: `${request.headers.origin || 'http://localhost:3000'}/servicios`,
                metadata: {
                    user_id: request.user.id,
                    service_id: service.id, // ✅ Corregido: era item.id
                    service_name: service.name
                }
            });

            return {
                url: session.url,
                sessionId: session.id,
                service: {
                    id: service.id,
                    name: service.name,
                    price: service.price
                }
            };

        } catch (error) {
            fastify.log.error('Error creating checkout session:', error);
            return reply.code(400).send({
                error: 'Error creating payment session',
                message: error.message
            });
        }
    });

    // Verificar estado de pago (alternativa a webhooks)
    fastify.get('/api/stripe/verify-payment/:sessionId', {
        preHandler: fastify.authenticate
    }, async (request, reply) => {
        try {
            const { sessionId } = request.params;

            const session = await fastify.stripe.checkout.sessions.retrieve(sessionId);

            // Verificar que el usuario tenga acceso a esta sesión
            if (session.metadata?.user_id !== request.user.id) {
                return reply.code(403).send({ error: 'Unauthorized access to this session' });
            }

            return {
                status: session.payment_status,
                sessionId: session.id,
                amountTotal: session.amount_total / 100,
                currency: session.currency,
                customerEmail: session.customer_details?.email,
                paymentIntentId: session.payment_intent,
                metadata: session.metadata
            };

        } catch (error) {
            fastify.log.error('Error verifying payment:', error);
            return reply.code(400).send({
                error: 'Error verifying payment',
                message: error.message
            });
        }
    });

    // Obtener detalles de una sesión específica
    fastify.get('/stripe/session/:sessionId', {
        preHandler: fastify.authenticate
    }, async (request, reply) => {
        try {
            const { sessionId } = request.params;

            const session = await fastify.stripe.checkout.sessions.retrieve(sessionId, {
                expand: ['line_items', 'payment_intent']
            });

            // Verificar que el usuario tenga acceso a esta sesión
            if (session.metadata?.user_id !== request.user.id) {
                return reply.code(403).send({ error: 'Unauthorized access to this session' });
            }

            return {
                id: session.id,
                status: session.payment_status,
                amountTotal: session.amount_total / 100,
                currency: session.currency,
                customerEmail: session.customer_details?.email,
                createdAt: new Date(session.created * 1000),
                metadata: session.metadata,
                lineItems: session.line_items?.data?.map(item => ({
                    description: item.description,
                    quantity: item.quantity,
                    amountTotal: item.amount_total / 100
                }))
            };

        } catch (error) {
            fastify.log.error('Error getting session details:', error);
            return reply.code(400).send({
                error: 'Error getting session details',
                message: error.message
            });
        }
    });

    // Listar pagos del usuario
    fastify.get('/api/stripe/my-payments', {
        preHandler: fastify.authenticate
    }, async (request, reply) => {
        try {
            // Nota: Stripe no permite filtrar por metadata en list()
            // Idealmente deberías guardar los session IDs en tu DB
            return {
                message: 'Para obtener el historial de pagos, guarda los session IDs en tu base de datos cuando se creen',
                suggestion: 'Implementa una tabla "payments" que relacione user_id con session_id'
            };

        } catch (error) {
            fastify.log.error('Error getting user payments:', error);
            return reply.code(400).send({
                error: 'Error getting payments',
                message: error.message
            });
        }
    });

    // ✅ NUEVO: Endpoint adicional para crear checkout con datos personalizados
    fastify.post('/stripe/create-custom-checkout', {
        preHandler: fastify.authenticate
    }, async (request, reply) => {
        try {
            const { amount, productName, currency = 'usd', quantity = 1 } = request.body;

            // Validar datos requeridos
            if (!amount || !productName) {
                return reply.code(400).send({
                    error: 'Missing required fields: amount, productName'
                });
            }

            const session = await fastify.stripe.checkout.sessions.create({
                payment_method_types: ['card'],
                line_items: [
                    {
                        price_data: {
                            currency: currency,
                            product_data: {
                                name: productName,
                            },
                            unit_amount: Math.round(amount * 100),
                        },
                        quantity: quantity,
                    },
                ],
                mode: 'payment',
                success_url: `http://127.0.0.1:5501/frontend/payment/index.html`,
                cancel_url: `${request.headers.origin || 'http://localhost:3000'}/servicios`,
                metadata: {
                    user_id: request.user.id,
                    custom_product: 'true'
                }
            });

            return {
                url: session.url,
                sessionId: session.id
            };

        } catch (error) {
            fastify.log.error('Error creating custom checkout session:', error);
            return reply.code(400).send({
                error: 'Error creating payment session',
                message: error.message
            });
        }
    });

};