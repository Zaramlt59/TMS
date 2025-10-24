module.exports = {
  paths: {
    '/locations/habitations': {
      get: {
        tags: ['🏘️ Habitation'],
        summary: 'Get all habitations',
        description: 'Retrieves a list of all habitations',
        responses: {
          '200': {
            description: 'Habitations retrieved successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    data: { type: 'array', items: { $ref: '#/components/schemas/Habitation' } }
                  }
                }
              }
            }
          },
          '500': { $ref: '#/components/responses/ServerError' }
        }
      }
    },
    '/locations/habitations/active': {
      get: {
        tags: ['🏘️ Habitation'],
        summary: 'Get active habitations only',
        description: 'Retrieves a list of only active habitations',
        responses: {
          '200': {
            description: 'Active habitations retrieved successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    message: { type: 'string', example: 'All habitations retrieved successfully' },
                    data: {
                      type: 'array',
                      items: {
                        type: 'object',
                        properties: {
                          id: { type: 'integer', example: 1 },
                          name: { type: 'string', example: 'Habitation 1' },
                          rd_block_id: { type: 'integer', example: 1 },
                          is_active: { type: 'boolean', example: true },
                          rd_block_name: { type: 'string', example: 'RD Block 1' },
                          district_name: { type: 'string', example: 'Mumbai' }
                        }
                      }
                    }
                  }
                }
              }
            }
          },
          '500': { $ref: '#/components/responses/ServerError' }
        }
      }
    },
    '/locations/habitations/{rdBlockId}': {
      get: {
        tags: ['🏘️ Habitation'],
        summary: 'Get habitations by RD block',
        description: 'Retrieves habitations for a specific RD block',
        parameters: [
          { name: 'rdBlockId', in: 'path', required: true, schema: { type: 'integer' }, description: 'RD Block ID' }
        ],
        responses: {
          '200': {
            description: 'Habitations retrieved successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    message: { type: 'string', example: 'Habitations retrieved successfully' },
                    data: {
                      type: 'array',
                      items: {
                        type: 'object',
                        properties: {
                          id: { type: 'integer', example: 1 },
                          name: { type: 'string', example: 'Habitation 1' }
                        }
                      }
                    }
                  }
                }
              }
            }
          },
          '400': { $ref: '#/components/responses/ValidationError' },
          '500': { $ref: '#/components/responses/ServerError' }
        }
      },
      post: {
        tags: ['🏘️ Habitation'],
        summary: 'Create habitation',
        description: 'Creates a new habitation',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['name', 'rd_block_id'],
                properties: {
                  name: { type: 'string', example: 'New Habitation' },
                  rd_block_id: { type: 'integer', example: 1 }
                }
              }
            }
          }
        },
        responses: {
          '201': {
            description: 'Habitation created successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    message: { type: 'string', example: 'Habitation created successfully' },
                    data: {
                      type: 'object',
                      properties: {
                        id: { type: 'integer', example: 1 },
                        name: { type: 'string', example: 'New Habitation' },
                        rd_block_id: { type: 'integer', example: 1 },
                        is_active: { type: 'boolean', example: true },
                        created_at: { type: 'string', format: 'date-time' },
                        updated_at: { type: 'string', format: 'date-time' }
                      }
                    }
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
    '/locations/habitations/{id}': {
      put: {
        tags: ['🏘️ Habitation'],
        summary: 'Update habitation',
        description: 'Updates an existing habitation',
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'integer' }, description: 'Habitation ID' }
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['name', 'rd_block_id'],
                properties: {
                  name: { type: 'string', example: 'Updated Habitation' },
                  rd_block_id: { type: 'integer', example: 1 },
                  is_active: { type: 'boolean', example: true }
                }
              }
            }
          }
        },
        responses: {
          '200': {
            description: 'Habitation updated successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    message: { type: 'string', example: 'Habitation updated successfully' },
                    data: {
                      type: 'object',
                      properties: {
                        id: { type: 'integer', example: 1 },
                        name: { type: 'string', example: 'Updated Habitation' },
                        rd_block_id: { type: 'integer', example: 1 },
                        is_active: { type: 'boolean', example: true }
                      }
                    }
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
        tags: ['🏘️ Habitation'],
        summary: 'Delete habitation (soft delete)',
        description: 'Soft deletes a habitation by setting is_active to false',
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'integer' }, description: 'Habitation ID' }
        ],
        responses: {
          '200': {
            description: 'Habitation deleted successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    message: { type: 'string', example: 'Habitation deleted successfully' },
                    data: { type: 'null', example: null }
                  }
                }
              }
            }
          },
          '400': { $ref: '#/components/responses/ValidationError' },
          '404': { $ref: '#/components/responses/NotFoundError' },
          '500': { $ref: '#/components/responses/ServerError' }
        }
      }
    }
  },
  schemas: {
    Habitation: {
      type: 'object',
      properties: {
        id: { type: 'integer', description: 'Habitation ID', example: 1 },
        name: { type: 'string', description: 'Habitation name', example: 'Habitation 1' },
        rd_block_id: { type: 'integer', description: 'RD Block ID', example: 1 },
        is_active: { type: 'boolean', description: 'Active status', example: true },
        created_at: { type: 'string', format: 'date-time', description: 'Creation timestamp' },
        updated_at: { type: 'string', format: 'date-time', description: 'Last update timestamp' }
      }
    }
  }
};
