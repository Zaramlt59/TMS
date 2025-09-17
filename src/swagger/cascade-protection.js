module.exports = {
  paths: {
    '/cascade/school/{schoolId}': {
      get: {
        tags: ['🔗 Cascade Protection'],
        summary: 'Get school cascade information',
        description: 'Retrieves information about what records will be affected if a school is deleted',
        parameters: [
          { name: 'schoolId', in: 'path', required: true, description: 'School ID', schema: { type: 'string' } }
        ],
        responses: {
          '200': {
            description: 'Cascade information retrieved successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    data: {
                      type: 'object',
                      properties: {
                        schoolId: { type: 'string', example: 'SCH001' },
                        cascadeInfo: {
                          type: 'object',
                          properties: {
                            teachers: { type: 'integer', example: 15 },
                            students: { type: 'integer', example: 200 },
                            classes: { type: 'integer', example: 10 }
                          }
                        },
                        totalAffected: { type: 'integer', example: 225 },
                        warning: { type: 'string', example: 'This will affect 225 related records' }
                      }
                    }
                  }
                }
              }
            }
          },
          '404': { $ref: '#/components/responses/NotFoundError' },
          '500': { $ref: '#/components/responses/ServerError' }
        }
      }
    },
    '/cascade/teacher/{teacherId}': {
      get: {
        tags: ['🔗 Cascade Protection'],
        summary: 'Get teacher cascade information',
        description: 'Retrieves information about what records will be affected if a teacher is deleted',
        parameters: [
          { name: 'teacherId', in: 'path', required: true, description: 'Teacher ID', schema: { type: 'integer' } }
        ],
        responses: {
          '200': {
            description: 'Cascade information retrieved successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    data: {
                      type: 'object',
                      properties: {
                        teacherId: { type: 'integer', example: 1 },
                        cascadeInfo: {
                          type: 'object',
                          properties: {
                            classes: { type: 'integer', example: 3 },
                            students: { type: 'integer', example: 60 },
                            medicalRecords: { type: 'integer', example: 2 }
                          }
                        },
                        totalAffected: { type: 'integer', example: 65 },
                        warning: { type: 'string', example: 'This will affect 65 related records' }
                      }
                    }
                  }
                }
              }
            }
          },
          '404': { $ref: '#/components/responses/NotFoundError' },
          '500': { $ref: '#/components/responses/ServerError' }
        }
      }
    },
    '/cascade/user/{userId}': {
      get: {
        tags: ['🔗 Cascade Protection'],
        summary: 'Get user cascade information',
        description: 'Retrieves information about what records will be affected if a user is deleted',
        parameters: [
          { name: 'userId', in: 'path', required: true, description: 'User ID', schema: { type: 'integer' } }
        ],
        responses: {
          '200': {
            description: 'Cascade information retrieved successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    data: {
                      type: 'object',
                      properties: {
                        userId: { type: 'integer', example: 1 },
                        cascadeInfo: {
                          type: 'object',
                          properties: {
                            sessions: { type: 'integer', example: 2 },
                            activities: { type: 'integer', example: 15 }
                          }
                        },
                        totalAffected: { type: 'integer', example: 17 },
                        warning: { type: 'string', example: 'This will affect 17 related records' }
                      }
                    }
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
  schemas: {}
};
