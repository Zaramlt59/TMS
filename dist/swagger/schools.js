module.exports = {
  paths: {
    '/schools': {
      get: {
        tags: ['🏫 Schools'],
        summary: 'Get all schools',
        description: 'Retrieves a list of all active schools',
        responses: {
          '200': {
            description: 'Schools retrieved successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    data: { type: 'array', items: { $ref: '#/components/schemas/School' } }
                  }
                }
              }
            }
          },
          '500': { $ref: '#/components/responses/ServerError' }
        }
      },
      post: {
        tags: ['🏫 Schools'],
        summary: 'Create new school',
        description: 'Creates a new school record',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['id', 'schoolName'],
                properties: {
                  id: { type: 'string', description: 'School ID', example: 'SCH001' },
                  schoolName: { type: 'string', description: 'School name', example: 'ABC High School' },
                  district: { type: 'string', description: 'District', example: 'Mumbai' },
                  rdBlock: { type: 'string', description: 'RD Block', example: 'Block A' },
                  schoolType: { type: 'string', description: 'School type', example: 'High School' },
                  management: { type: 'string', description: 'Management type', example: 'Government' },
                  medium: { type: 'string', description: 'Medium of instruction', example: 'English' }
                }
              }
            }
          }
        },
        responses: {
          '201': {
            description: 'School created successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    message: { type: 'string', example: 'School created successfully' },
                    data: { $ref: '#/components/schemas/School' }
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
    '/schools/stats': {
      get: {
        tags: ['🏫 Schools'],
        summary: 'Get school statistics',
        description: 'Retrieves statistical information about schools',
        responses: {
          '200': {
            description: 'Statistics retrieved successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    data: {
                      type: 'object',
                      properties: {
                        total: { type: 'integer', example: 150 },
                        byDistrict: { type: 'object', additionalProperties: { type: 'integer' } },
                        byType: { type: 'object', additionalProperties: { type: 'integer' } }
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
    '/schools/{id}': {
      get: {
        tags: ['🏫 Schools'],
        summary: 'Get school by ID',
        description: 'Retrieves a specific school by its ID',
        parameters: [
          { name: 'id', in: 'path', required: true, description: 'School ID', schema: { type: 'string' } }
        ],
        responses: {
          '200': {
            description: 'School retrieved successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    data: { $ref: '#/components/schemas/School' }
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
        tags: ['🏫 Schools'],
        summary: 'Update school',
        description: 'Updates an existing school record',
        parameters: [
          { name: 'id', in: 'path', required: true, description: 'School ID', schema: { type: 'string' } }
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  schoolName: { type: 'string', example: 'Updated School Name' },
                  district: { type: 'string', example: 'Updated District' },
                  rdBlock: { type: 'string', example: 'Updated Block' }
                }
              }
            }
          }
        },
        responses: {
          '200': {
            description: 'School updated successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    message: { type: 'string', example: 'School updated successfully' },
                    data: { $ref: '#/components/schemas/School' }
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
        tags: ['🏫 Schools'],
        summary: 'Delete school',
        description: 'Soft deletes a school record',
        parameters: [
          { name: 'id', in: 'path', required: true, description: 'School ID', schema: { type: 'string' } }
        ],
        responses: {
          '200': {
            description: 'School deleted successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    message: { type: 'string', example: 'School deleted successfully' }
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
    School: {
      type: 'object',
      properties: {
        id: { type: 'integer', description: 'Unique school identifier', example: 1 },
        school_id: { type: 'string', description: 'Business school ID', example: 'SCH001' },
        school_name: { type: 'string', description: 'School name', example: 'ABC High School' },
        district: { type: 'string', description: 'District', example: 'Mumbai' },
        rd_block: { type: 'string', description: 'RD Block', example: 'Block A' },
        school_type: { type: 'string', description: 'School type', example: 'High School' },
        management: { type: 'string', description: 'Management type', example: 'Government' },
        medium: { type: 'string', description: 'Medium of instruction', example: 'English' },
        is_active: { type: 'boolean', description: 'Whether school is active', example: true },
        created_at: { type: 'string', format: 'date-time', description: 'Creation timestamp', example: '2024-01-15T10:30:00Z' },
        updated_at: { type: 'string', format: 'date-time', description: 'Last update timestamp', example: '2024-01-15T15:45:00Z' }
      },
      required: ['id', 'school_id', 'school_name']
    }
  }
};