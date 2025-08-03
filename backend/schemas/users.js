exports.userSchema = {
    type: 'object',
    required: ['username', 'email', 'password'],
    properties: {
        username: { type: 'string' },
        email: { type: 'string', format: 'email' },
        password: { type: 'string', minLength: 6 },
        status: { type: 'string', enum: ['active', 'inactive', 'banned'] },
        role: { type: 'string', enum: ['admin', 'customer', 'employee'], default: 'customer' }
    },
    additionalProperties: false
};
