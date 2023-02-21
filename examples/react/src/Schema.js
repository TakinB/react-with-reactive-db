export const flagSchema = {
    title: 'flag schema',
    description: 'describes a simple flag',
    version: 0,
    primaryKey: 'name',
    type: 'object',
    properties: {
        name: {
            type: 'string'
        },
        value: {
            type: 'string'
        }
    },
    required: [
        'name',
        'value'
    ]
};
