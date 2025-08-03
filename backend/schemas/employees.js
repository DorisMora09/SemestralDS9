exports.employeeSchema = {
    type: 'object',
    required: ['firstname', 'lastname', 'job', 'status'],
    properties: {
        firstname: { type: 'string' },
        lastname: { type: 'string' },
        job: { type: 'string' },
        status: { type: 'string', enum: ['active', 'inactive', 'terminated'] }
    },
    additionalProperties: false
};
