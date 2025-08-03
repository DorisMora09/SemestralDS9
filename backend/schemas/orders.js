exports.orderSchema = {
    type: 'object',
    required: ['service_id', 'payment_id', 'user_id', 'employee_id', 'creation_time', 'status'],
    properties: {
        service_id: { type: 'string', pattern: '^[a-f\\d]{24}$' },
        payment_id: { type: 'string', pattern: '^[a-f\\d]{24}$' },
        user_id: { type: 'string', pattern: '^[a-f\\d]{24}$' },
        employee_id: { type: 'string', pattern: '^[a-f\\d]{24}$' },
        creation_time: { type: 'string', format: 'date-time' },
        delivery_time: { type: 'string', format: 'date-time' },
        status: { type: 'string', enum: ['pending', 'in_progress', 'delivered', 'cancelled'] },
        step: { type: 'string' },
        tracking_location: {
            type: 'object',
            required: ['lat', 'lng', 'updated_at'],
            properties: {
                lat: { type: 'number' },
                lng: { type: 'number' },
                updated_at: { type: 'string', format: 'date-time' }
            }
        }
    },
    additionalProperties: false
};
