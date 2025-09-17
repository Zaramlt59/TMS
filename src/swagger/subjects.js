module.exports = {
  paths: {
    '/subjects': {
      get: {
        tags: ['📖 Subjects'],
        summary: 'Get all subjects',
        description: 'Retrieves a list of all subjects',
        responses: {
          '200': {
            description: 'Subjects retrieved successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    data: { type: 'array', items: { $ref: '#/components/schemas/Subject' } }
                  }
                }
              }
            }
          },
          '500': { $ref: '#/components/responses/ServerError' }
        }
      },
      post: {
        tags: ['📖 Subjects'],
        summary: 'Create new subject',
        description: 'Creates a new subject record',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['name'],
                properties: {
                  name: { type: 'string', example: 'Mathematics' },
                  description: { type: 'string', example: 'Mathematics subject' },
                  code: { type: 'string', example: 'MATH' }
                }
              }
            }
          }
        },
        responses: {
          '201': {
            description: 'Subject created successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    message: { type: 'string', example: 'Subject created successfully' },
                    data: { $ref: '#/components/schemas/Subject' }
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
    '/subjects/{id}': {
      get: {
        tags: ['📖 Subjects'],
        summary: 'Get subject by ID',
        description: 'Retrieves a specific subject by its ID',
        parameters: [
          { name: 'id', in: 'path', required: true, description: 'Subject ID', schema: { type: 'integer' } }
        ],
        responses: {
          '200': {
            description: 'Subject retrieved successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    data: { $ref: '#/components/schemas/Subject' }
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
        tags: ['📖 Subjects'],
        summary: 'Update subject',
        description: 'Updates an existing subject record',
        parameters: [
          { name: 'id', in: 'path', required: true, description: 'Subject ID', schema: { type: 'integer' } }
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: { type: 'string', example: 'Updated Subject' },
                  description: { type: 'string', example: 'Updated description' },
                  code: { type: 'string', example: 'UPD' }
                }
              }
            }
          }
        },
        responses: {
          '200': {
            description: 'Subject updated successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    message: { type: 'string', example: 'Subject updated successfully' },
                    data: { $ref: '#/components/schemas/Subject' }
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
        tags: ['📖 Subjects'],
        summary: 'Delete subject',
        description: 'Soft deletes a subject record',
        parameters: [
          { name: 'id', in: 'path', required: true, description: 'Subject ID', schema: { type: 'integer' } }
        ],
        responses: {
          '200': {
            description: 'Subject deleted successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    message: { type: 'string', example: 'Subject deleted successfully' }
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
    Subject: {
      type: 'object',
      properties: {
        id: { type: 'integer', description: 'Subject ID', example: 1 },
        name: { type: 'string', description: 'Subject name', example: 'Mathematics' },
        description: { type: 'string', description: 'Description', example: 'Mathematics subject' },
        code: { type: 'string', description: 'Subject code', example: 'MATH' },
        is_active: { type: 'boolean', description: 'Active status', example: true },
        created_at: { type: 'string', format: 'date-time', description: 'Creation timestamp' },
        updated_at: { type: 'string', format: 'date-time', description: 'Last update timestamp' }
      }
    }
  }
};
