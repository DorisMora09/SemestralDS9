exports.serviceSchema = {
    type: 'object',
    required: ['name', 'description', 'price', 'time', 'category', 'image_directory', 'status'],
    properties: {
        name: { type: 'string' },
        description: { type: 'string' },
        price: { type: 'number', minimum: 0 },
        time: { type: 'number', minimum: 1 },
        category: { type: 'string' }, // Ej: "Delivery", "Cleaning", "Repair"
        image_directory: { type: 'string' },
        status: { type: 'string', enum: ['active', 'paused', 'disabled'] }
    },
    additionalProperties: false
};
