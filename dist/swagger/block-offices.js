module.exports = {
  paths: {
    '/block-offices': {
      get: {
        tags: ['🏛️ Block Offices'],
        summary: 'Get all block offices',
        description: 'Retrieves a list of all block offices',
        responses: {
          '200': {
            description: 'Block offices retrieved successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    data: { type: 'array', items: { $ref: '#/components/schemas/BlockOffice' } }
                  }
                }
              }
            }
          },
          '500': { $ref: '#/components/responses/ServerError' }
        }
      },
      post: {
        tags: ['🏛️ Block Offices'],
        summary: 'Create new block office',
        description: 'Creates a new block office record',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['name', 'district_id'],
                properties: {
                  name: { type: 'string', example: 'Block Office 1' },
                  district_id: { type: 'integer', example: 1 }
                }
              }
            }
          }
        },
        responses: {
          '201': {
            description: 'Block office created successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    message: { type: 'string', example: 'Block office created successfully' },
                    data: { $ref: '#/components/schemas/BlockOffice' }
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
    '/block-offices/{id}': {
      get: {
        tags: ['🏛️ Block Offices'],
        summary: 'Get block office by ID',
        description: 'Retrieves a specific block office by its ID',
        parameters: [
          { name: 'id', in: 'path', required: true, description: 'Block Office ID', schema: { type: 'integer' } }
        ],
        responses: {
          '200': {
            description: 'Block office retrieved successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    data: { $ref: '#/components/schemas/BlockOffice' }
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
        tags: ['🏛️ Block Offices'],
        summary: 'Update block office',
        description: 'Updates an existing block office record',
        parameters: [
          { name: 'id', in: 'path', required: true, description: 'Block Office ID', schema: { type: 'integer' } }
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['name', 'district_id'],
                properties: {
                  name: { type: 'string', example: 'Updated Block Office' },
                  district_id: { type: 'integer', example: 1 }
                }
              }
            }
          }
        },
        responses: {
          '200': {
            description: 'Block office updated successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    message: { type: 'string', example: 'Block office updated successfully' },
                    data: { $ref: '#/components/schemas/BlockOffice' }
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
        tags: ['🏛️ Block Offices'],
        summary: 'Delete block office',
        description: 'Deletes a block office record',
        parameters: [
          { name: 'id', in: 'path', required: true, description: 'Block Office ID', schema: { type: 'integer' } }
        ],
        responses: {
          '200': {
            description: 'Block office deleted successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    message: { type: 'string', example: 'Block office deleted successfully' }
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
    BlockOffice: {
      type: 'object',
      properties: {
        id: { type: 'integer', description: 'Block Office ID', example: 1 },
        name: { type: 'string', description: 'Block Office name', example: 'Block Office 1' },
        district_id: { type: 'integer', description: 'District ID', example: 1 },
        is_active: { type: 'boolean', description: 'Active status', example: true },
        created_at: { type: 'string', format: 'date-time', description: 'Creation timestamp' },
        updated_at: { type: 'string', format: 'date-time', description: 'Last update timestamp' }
      }
    }
  }
};
