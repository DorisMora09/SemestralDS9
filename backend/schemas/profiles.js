exports.profileSchema = {
    type: 'object',
    required: ['user_id', 'firstname', 'lastname', 'address', 'phone_number'],
    properties: {
        user_id: { type: 'string', pattern: '^[a-f\\d]{24}$' },
        firstname: { type: 'string' },
        lastname: { type: 'string' },
        address: { type: 'string' },
        phone_number: { type: 'string' },
        gender: { type: 'string', enum: ['male', 'female', 'other'] }
    },
    additionalProperties: false
};
