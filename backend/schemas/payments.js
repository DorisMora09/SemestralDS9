exports.paymentSchema = {
    type: 'object',
    required: ['transaction_number', 'amount', 'method', 'status', 'user_id'],
    properties: {
        transaction_number: { type: 'string' },
        amount: { type: 'number', minimum: 0 },
        user_id: { type: 'string', pattern: '^[a-f\\d]{24}$' },
        method: { type: 'string', enum: ['card', 'cash', 'paypal', 'crypto'] },
        status: { type: 'string', enum: ['pending', 'completed', 'failed', 'refunded'] },
        paid_at: { type: 'string', format: 'date-time' }
    },
    additionalProperties: false
};
