module.exports = {
  paths: {
    '/religions': {
      get: {
        tags: ['🕌 Religions'],
        summary: 'Get all religions',
        description: 'Retrieves a list of all religions',
        responses: {
          '200': {
            description: 'Religions retrieved successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    data: { type: 'array', items: { $ref: '#/components/schemas/Religion' } }
                  }
                }
              }
            }
          },
          '500': { $ref: '#/components/responses/ServerError' }
        }
      },
      post: {
        tags: ['🕌 Religions'],
        summary: 'Create new religion',
        description: 'Creates a new religion record',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['name'],
                properties: {
                  name: { type: 'string', example: 'Hindu' },
                  description: { type: 'string', example: 'Hindu religion' }
                }
              }
            }
          }
        },
        responses: {
          '201': {
            description: 'Religion created successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    message: { type: 'string', example: 'Religion created successfully' },
                    data: { $ref: '#/components/schemas/Religion' }
                  }
                }
              }
            }
          },
          '400': { $ref: '#/components/responses/ValidationError' },
          '500': { $ref: '#/components/responses/ServerError' }
        }
      }
    },
    '/religions/{id}': {
      get: {
        tags: ['🕌 Religions'],
        summary: 'Get religion by ID',
        description: 'Retrieves a specific religion by its ID',
        parameters: [
          { name: 'id', in: 'path', required: true, description: 'Religion ID', schema: { type: 'integer' } }
        ],
        responses: {
          '200': {
            description: 'Religion retrieved successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    data: { $ref: '#/components/schemas/Religion' }
                  }
                }
              }
            }
          },
          '404': { $ref: '#/components/responses/NotFoundError' },
          '500': { $ref: '#/components/responses/ServerError' }
        }
      },
      put: {
        tags: ['🕌 Religions'],
        summary: 'Update religion',
        description: 'Updates an existing religion record',
        parameters: [
          { name: 'id', in: 'path', required: true, description: 'Religion ID', schema: { type: 'integer' } }
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: { type: 'string', example: 'Updated Religion' },
                  description: { type: 'string', example: 'Updated description' }
                }
              }
            }
          }
        },
        responses: {
          '200': {
            description: 'Religion updated successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    message: { type: 'string', example: 'Religion updated successfully' },
                    data: { $ref: '#/components/schemas/Religion' }
                  }
                }
              }
            }
          },
          '400': { $ref: '#/components/responses/ValidationError' },
          '404': { $ref: '#/components/responses/NotFoundError' },
          '500': { $ref: '#/components/responses/ServerError' }
        }
      },
      delete: {
        tags: ['🕌 Religions'],
        summary: 'Delete religion',
        description: 'Soft deletes a religion record',
        parameters: [
          { name: 'id', in: 'path', required: true, description: 'Religion ID', schema: { type: 'integer' } }
        ],
        responses: {
          '200': {
            description: 'Religion deleted successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    message: { type: 'string', example: 'Religion deleted successfully' }
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
    Religion: {
      type: 'object',
      properties: {
        id: { type: 'integer', description: 'Religion ID', example: 1 },
        name: { type: 'string', description: 'Religion name', example: 'Hindu' },
        description: { type: 'string', description: 'Description', example: 'Hindu religion' },
        is_active: { type: 'boolean', description: 'Active status', example: true },
        created_at: { type: 'string', format: 'date-time', description: 'Creation timestamp' },
        updated_at: { type: 'string', format: 'date-time', description: 'Last update timestamp' }
      }
    }
  }
};
