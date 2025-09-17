module.exports = {
  paths: {
    '/districts': {
      get: {
        tags: ['🗺️ Districts'],
        summary: 'Get all districts',
        description: 'Retrieves a list of all districts',
        responses: {
          '200': {
            description: 'Districts retrieved successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    data: { type: 'array', items: { $ref: '#/components/schemas/District' } }
                  }
                }
              }
            }
          },
          '500': { $ref: '#/components/responses/ServerError' }
        }
      }
    },
    '/districts/{id}': {
      get: {
        tags: ['🗺️ Districts'],
        summary: 'Get district by ID',
        description: 'Retrieves a specific district by its ID',
        parameters: [
          { name: 'id', in: 'path', required: true, description: 'District ID', schema: { type: 'integer' } }
        ],
        responses: {
          '200': {
            description: 'District retrieved successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    data: { $ref: '#/components/schemas/District' }
                  }
                }
              }
            }
          },
          '404': { $ref: '#/components/responses/NotFoundError' },
          '500': { $ref: '#/components/responses/ServerError' }
        }
      }
    }
  },
  schemas: {
    District: {
      type: 'object',
      properties: {
        id: { type: 'integer', description: 'District ID', example: 1 },
        name: { type: 'string', description: 'District name', example: 'Mumbai' },
        is_active: { type: 'boolean', description: 'Active status', example: true },
        created_at: { type: 'string', format: 'date-time', description: 'Creation timestamp' },
        updated_at: { type: 'string', format: 'date-time', description: 'Last update timestamp' }
      }
    }
  }
};
