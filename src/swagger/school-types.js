module.exports = {
  paths: {
    '/school-types': {
      get: {
        tags: ['🏫 School Types'],
        summary: 'Get all school types',
        description: 'Retrieves a list of all school types',
        responses: {
          '200': {
            description: 'School types retrieved successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    data: { type: 'array', items: { $ref: '#/components/schemas/SchoolType' } }
                  }
                }
              }
            }
          },
          '500': { $ref: '#/components/responses/ServerError' }
        }
      },
      post: {
        tags: ['🏫 School Types'],
        summary: 'Create new school type',
        description: 'Creates a new school type record',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['name'],
                properties: {
                  name: { type: 'string', example: 'High School' },
                  description: { type: 'string', example: 'Secondary education school' }
                }
              }
            }
          }
        },
        responses: {
          '201': {
            description: 'School type created successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    message: { type: 'string', example: 'School type created successfully' },
                    data: { $ref: '#/components/schemas/SchoolType' }
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
    '/school-types/{id}': {
      get: {
        tags: ['🏫 School Types'],
        summary: 'Get school type by ID',
        description: 'Retrieves a specific school type by its ID',
        parameters: [
          { name: 'id', in: 'path', required: true, description: 'School Type ID', schema: { type: 'integer' } }
        ],
        responses: {
          '200': {
            description: 'School type retrieved successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    data: { $ref: '#/components/schemas/SchoolType' }
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
        tags: ['🏫 School Types'],
        summary: 'Update school type',
        description: 'Updates an existing school type record',
        parameters: [
          { name: 'id', in: 'path', required: true, description: 'School Type ID', schema: { type: 'integer' } }
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: { type: 'string', example: 'Updated School Type' },
                  description: { type: 'string', example: 'Updated description' }
                }
              }
            }
          }
        },
        responses: {
          '200': {
            description: 'School type updated successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    message: { type: 'string', example: 'School type updated successfully' },
                    data: { $ref: '#/components/schemas/SchoolType' }
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
        tags: ['🏫 School Types'],
        summary: 'Delete school type',
        description: 'Soft deletes a school type record',
        parameters: [
          { name: 'id', in: 'path', required: true, description: 'School Type ID', schema: { type: 'integer' } }
        ],
        responses: {
          '200': {
            description: 'School type deleted successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    message: { type: 'string', example: 'School type deleted successfully' }
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
    SchoolType: {
      type: 'object',
      properties: {
        id: { type: 'integer', description: 'School Type ID', example: 1 },
        name: { type: 'string', description: 'School type name', example: 'High School' },
        description: { type: 'string', description: 'Description', example: 'Secondary education school' },
        is_active: { type: 'boolean', description: 'Active status', example: true },
        created_at: { type: 'string', format: 'date-time', description: 'Creation timestamp' },
        updated_at: { type: 'string', format: 'date-time', description: 'Last update timestamp' }
      }
    }
  }
};
