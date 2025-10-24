module.exports = {
  paths: {
    '/mediums': {
      get: {
        tags: ['🗣️ Mediums'],
        summary: 'Get all mediums',
        description: 'Retrieves a list of all mediums',
        responses: {
          '200': {
            description: 'Mediums retrieved successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    data: { type: 'array', items: { $ref: '#/components/schemas/Medium' } }
                  }
                }
              }
            }
          },
          '500': { $ref: '#/components/responses/ServerError' }
        }
      },
      post: {
        tags: ['🗣️ Mediums'],
        summary: 'Create new medium',
        description: 'Creates a new medium record',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['name'],
                properties: {
                  name: { type: 'string', example: 'English' },
                  description: { type: 'string', example: 'English medium of instruction' }
                }
              }
            }
          }
        },
        responses: {
          '201': {
            description: 'Medium created successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    message: { type: 'string', example: 'Medium created successfully' },
                    data: { $ref: '#/components/schemas/Medium' }
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
    '/mediums/{id}': {
      get: {
        tags: ['🗣️ Mediums'],
        summary: 'Get medium by ID',
        description: 'Retrieves a specific medium by its ID',
        parameters: [
          { name: 'id', in: 'path', required: true, description: 'Medium ID', schema: { type: 'integer' } }
        ],
        responses: {
          '200': {
            description: 'Medium retrieved successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    data: { $ref: '#/components/schemas/Medium' }
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
        tags: ['🗣️ Mediums'],
        summary: 'Update medium',
        description: 'Updates an existing medium record',
        parameters: [
          { name: 'id', in: 'path', required: true, description: 'Medium ID', schema: { type: 'integer' } }
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: { type: 'string', example: 'Updated Medium' },
                  description: { type: 'string', example: 'Updated description' }
                }
              }
            }
          }
        },
        responses: {
          '200': {
            description: 'Medium updated successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    message: { type: 'string', example: 'Medium updated successfully' },
                    data: { $ref: '#/components/schemas/Medium' }
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
        tags: ['🗣️ Mediums'],
        summary: 'Delete medium',
        description: 'Soft deletes a medium record',
        parameters: [
          { name: 'id', in: 'path', required: true, description: 'Medium ID', schema: { type: 'integer' } }
        ],
        responses: {
          '200': {
            description: 'Medium deleted successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    message: { type: 'string', example: 'Medium deleted successfully' }
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
    Medium: {
      type: 'object',
      properties: {
        id: { type: 'integer', description: 'Medium ID', example: 1 },
        name: { type: 'string', description: 'Medium name', example: 'English' },
        description: { type: 'string', description: 'Description', example: 'English medium of instruction' },
        is_active: { type: 'boolean', description: 'Active status', example: true },
        created_at: { type: 'string', format: 'date-time', description: 'Creation timestamp' },
        updated_at: { type: 'string', format: 'date-time', description: 'Last update timestamp' }
      }
    }
  }
};
