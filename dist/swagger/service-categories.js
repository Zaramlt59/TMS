module.exports = {
  paths: {
    '/service-categories': {
      get: {
        tags: ['📋 Service Categories'],
        summary: 'Get all service categories',
        description: 'Retrieves a list of all service categories',
        responses: {
          '200': {
            description: 'Service categories retrieved successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    data: { type: 'array', items: { $ref: '#/components/schemas/ServiceCategory' } }
                  }
                }
              }
            }
          },
          '500': { $ref: '#/components/responses/ServerError' }
        }
      },
      post: {
        tags: ['📋 Service Categories'],
        summary: 'Create new service category',
        description: 'Creates a new service category record',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['name'],
                properties: {
                  name: { type: 'string', example: 'Teaching' },
                  description: { type: 'string', example: 'Teaching service category' }
                }
              }
            }
          }
        },
        responses: {
          '201': {
            description: 'Service category created successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    message: { type: 'string', example: 'Service category created successfully' },
                    data: { $ref: '#/components/schemas/ServiceCategory' }
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
    '/service-categories/{id}': {
      get: {
        tags: ['📋 Service Categories'],
        summary: 'Get service category by ID',
        description: 'Retrieves a specific service category by its ID',
        parameters: [
          { name: 'id', in: 'path', required: true, description: 'Service Category ID', schema: { type: 'integer' } }
        ],
        responses: {
          '200': {
            description: 'Service category retrieved successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    data: { $ref: '#/components/schemas/ServiceCategory' }
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
        tags: ['📋 Service Categories'],
        summary: 'Update service category',
        description: 'Updates an existing service category record',
        parameters: [
          { name: 'id', in: 'path', required: true, description: 'Service Category ID', schema: { type: 'integer' } }
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: { type: 'string', example: 'Updated Service Category' },
                  description: { type: 'string', example: 'Updated description' }
                }
              }
            }
          }
        },
        responses: {
          '200': {
            description: 'Service category updated successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    message: { type: 'string', example: 'Service category updated successfully' },
                    data: { $ref: '#/components/schemas/ServiceCategory' }
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
        tags: ['📋 Service Categories'],
        summary: 'Delete service category',
        description: 'Soft deletes a service category record',
        parameters: [
          { name: 'id', in: 'path', required: true, description: 'Service Category ID', schema: { type: 'integer' } }
        ],
        responses: {
          '200': {
            description: 'Service category deleted successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    message: { type: 'string', example: 'Service category deleted successfully' }
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
    ServiceCategory: {
      type: 'object',
      properties: {
        id: { type: 'integer', description: 'Service Category ID', example: 1 },
        name: { type: 'string', description: 'Service category name', example: 'Teaching' },
        description: { type: 'string', description: 'Description', example: 'Teaching service category' },
        is_active: { type: 'boolean', description: 'Active status', example: true },
        created_at: { type: 'string', format: 'date-time', description: 'Creation timestamp' },
        updated_at: { type: 'string', format: 'date-time', description: 'Last update timestamp' }
      }
    }
  }
};
