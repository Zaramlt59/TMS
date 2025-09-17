module.exports = {
  paths: {
    '/management-types': {
      get: {
        tags: ['🏢 Management Types'],
        summary: 'Get all management types',
        description: 'Retrieves a list of all management types',
        responses: {
          '200': {
            description: 'Management types retrieved successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    data: { type: 'array', items: { $ref: '#/components/schemas/ManagementType' } }
                  }
                }
              }
            }
          },
          '500': { $ref: '#/components/responses/ServerError' }
        }
      },
      post: {
        tags: ['🏢 Management Types'],
        summary: 'Create new management type',
        description: 'Creates a new management type record',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['name'],
                properties: {
                  name: { type: 'string', example: 'Government' },
                  description: { type: 'string', example: 'Government managed schools' }
                }
              }
            }
          }
        },
        responses: {
          '201': {
            description: 'Management type created successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    message: { type: 'string', example: 'Management type created successfully' },
                    data: { $ref: '#/components/schemas/ManagementType' }
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
    '/management-types/{id}': {
      get: {
        tags: ['🏢 Management Types'],
        summary: 'Get management type by ID',
        description: 'Retrieves a specific management type by its ID',
        parameters: [
          { name: 'id', in: 'path', required: true, description: 'Management Type ID', schema: { type: 'integer' } }
        ],
        responses: {
          '200': {
            description: 'Management type retrieved successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    data: { $ref: '#/components/schemas/ManagementType' }
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
        tags: ['🏢 Management Types'],
        summary: 'Update management type',
        description: 'Updates an existing management type record',
        parameters: [
          { name: 'id', in: 'path', required: true, description: 'Management Type ID', schema: { type: 'integer' } }
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: { type: 'string', example: 'Updated Management Type' },
                  description: { type: 'string', example: 'Updated description' }
                }
              }
            }
          }
        },
        responses: {
          '200': {
            description: 'Management type updated successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    message: { type: 'string', example: 'Management type updated successfully' },
                    data: { $ref: '#/components/schemas/ManagementType' }
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
        tags: ['🏢 Management Types'],
        summary: 'Delete management type',
        description: 'Soft deletes a management type record',
        parameters: [
          { name: 'id', in: 'path', required: true, description: 'Management Type ID', schema: { type: 'integer' } }
        ],
        responses: {
          '200': {
            description: 'Management type deleted successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    message: { type: 'string', example: 'Management type deleted successfully' }
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
    ManagementType: {
      type: 'object',
      properties: {
        id: { type: 'integer', description: 'Management Type ID', example: 1 },
        name: { type: 'string', description: 'Management type name', example: 'Government' },
        description: { type: 'string', description: 'Description', example: 'Government managed schools' },
        is_active: { type: 'boolean', description: 'Active status', example: true },
        created_at: { type: 'string', format: 'date-time', description: 'Creation timestamp' },
        updated_at: { type: 'string', format: 'date-time', description: 'Last update timestamp' }
      }
    }
  }
};
