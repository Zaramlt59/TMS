module.exports = {
  paths: {
    '/rd-blocks': {
      get: {
        tags: ['🏢 RD Blocks'],
        summary: 'Get all RD blocks',
        description: 'Retrieves a list of all RD blocks',
        responses: {
          '200': {
            description: 'RD blocks retrieved successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    data: { type: 'array', items: { $ref: '#/components/schemas/RDBlock' } }
                  }
                }
              }
            }
          },
          '500': { $ref: '#/components/responses/ServerError' }
        }
      },
      post: {
        tags: ['🏢 RD Blocks'],
        summary: 'Create new RD block',
        description: 'Creates a new RD block record',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['name', 'district_id'],
                properties: {
                  name: { type: 'string', example: 'RD Block 1' },
                  district_id: { type: 'integer', example: 1 }
                }
              }
            }
          }
        },
        responses: {
          '201': {
            description: 'RD block created successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    message: { type: 'string', example: 'RD block created successfully' },
                    data: { $ref: '#/components/schemas/RDBlock' }
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
    '/rd-blocks/{id}': {
      get: {
        tags: ['🏢 RD Blocks'],
        summary: 'Get RD block by ID',
        description: 'Retrieves a specific RD block by its ID',
        parameters: [
          { name: 'id', in: 'path', required: true, description: 'RD Block ID', schema: { type: 'integer' } }
        ],
        responses: {
          '200': {
            description: 'RD block retrieved successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    data: { $ref: '#/components/schemas/RDBlock' }
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
        tags: ['🏢 RD Blocks'],
        summary: 'Update RD block',
        description: 'Updates an existing RD block record',
        parameters: [
          { name: 'id', in: 'path', required: true, description: 'RD Block ID', schema: { type: 'integer' } }
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: { type: 'string', example: 'Updated RD Block' },
                  district_id: { type: 'integer', example: 1 }
                }
              }
            }
          }
        },
        responses: {
          '200': {
            description: 'RD block updated successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    message: { type: 'string', example: 'RD block updated successfully' },
                    data: { $ref: '#/components/schemas/RDBlock' }
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
        tags: ['🏢 RD Blocks'],
        summary: 'Delete RD block',
        description: 'Soft deletes an RD block record',
        parameters: [
          { name: 'id', in: 'path', required: true, description: 'RD Block ID', schema: { type: 'integer' } }
        ],
        responses: {
          '200': {
            description: 'RD block deleted successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    message: { type: 'string', example: 'RD block deleted successfully' }
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
    RDBlock: {
      type: 'object',
      properties: {
        id: { type: 'integer', description: 'RD Block ID', example: 1 },
        name: { type: 'string', description: 'RD Block name', example: 'RD Block 1' },
        district_id: { type: 'integer', description: 'District ID', example: 1 },
        is_active: { type: 'boolean', description: 'Active status', example: true },
        created_at: { type: 'string', format: 'date-time', description: 'Creation timestamp' },
        updated_at: { type: 'string', format: 'date-time', description: 'Last update timestamp' }
      }
    }
  }
};
