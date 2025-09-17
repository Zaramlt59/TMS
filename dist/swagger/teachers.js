module.exports = {
  paths: {
    '/teachers': {
      get: {
        tags: ['👨‍🏫 Teachers'],
        summary: 'Get all teachers',
        description: 'Retrieves a list of all active teachers',
        responses: {
          '200': {
            description: 'Teachers retrieved successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    data: { type: 'array', items: { $ref: '#/components/schemas/Teacher' } }
                  }
                }
              }
            }
          },
          '500': { $ref: '#/components/responses/ServerError' }
        }
      },
      post: {
        tags: ['👨‍🏫 Teachers'],
        summary: 'Create new teacher',
        description: 'Creates a new teacher record',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['teacherName'],
                properties: {
                  teacherName: { type: 'string', example: 'John Doe' },
                  dateOfBirth: { type: 'string', format: 'date', example: '1990-01-15' },
                  joiningDate: { type: 'string', format: 'date', example: '2020-06-01' },
                  phoneNumber: { type: 'string', example: '9876543210' },
                  email: { type: 'string', format: 'email', example: 'john.doe@school.edu' },
                  socialGroup: { type: 'string', example: 'General' },
                  religion: { type: 'string', example: 'Hindu' },
                  gender: { type: 'string', enum: ['Male', 'Female'], example: 'Male' },
                  aadhaarNumber: { type: 'string', example: '123456789012' },
                  subjectsTaught: { type: 'array', items: { type: 'string' }, example: ['Mathematics', 'Physics'] },
                  classesTaught: { type: 'array', items: { type: 'string' }, example: ['Class 10', 'Class 12'] }
                }
              }
            }
          }
        },
        responses: {
          '201': {
            description: 'Teacher created successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    message: { type: 'string', example: 'Teacher created successfully' },
                    data: { $ref: '#/components/schemas/Teacher' }
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
    '/teachers/stats': {
      get: {
        tags: ['👨‍🏫 Teachers'],
        summary: 'Get teacher statistics',
        description: 'Retrieves statistical information about teachers',
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
                        total: { type: 'integer', example: 500 },
                        byDistrict: { type: 'object', additionalProperties: { type: 'integer' } },
                        bySubject: { type: 'object', additionalProperties: { type: 'integer' } }
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
    '/teachers/{id}': {
      get: {
        tags: ['👨‍🏫 Teachers'],
        summary: 'Get teacher by ID',
        description: 'Retrieves a specific teacher by their ID',
        parameters: [
          { name: 'id', in: 'path', required: true, description: 'Teacher ID', schema: { type: 'integer' } }
        ],
        responses: {
          '200': {
            description: 'Teacher retrieved successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    data: { $ref: '#/components/schemas/Teacher' }
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
        tags: ['👨‍🏫 Teachers'],
        summary: 'Update teacher',
        description: 'Updates an existing teacher record',
        parameters: [
          { name: 'id', in: 'path', required: true, description: 'Teacher ID', schema: { type: 'integer' } }
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  teacherName: { type: 'string', example: 'Updated Teacher Name' },
                  phoneNumber: { type: 'string', example: '9876543210' },
                  email: { type: 'string', format: 'email', example: 'updated@school.edu' }
                }
              }
            }
          }
        },
        responses: {
          '200': {
            description: 'Teacher updated successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    message: { type: 'string', example: 'Teacher updated successfully' },
                    data: { $ref: '#/components/schemas/Teacher' }
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
        tags: ['👨‍🏫 Teachers'],
        summary: 'Delete teacher',
        description: 'Soft deletes a teacher record',
        parameters: [
          { name: 'id', in: 'path', required: true, description: 'Teacher ID', schema: { type: 'integer' } }
        ],
        responses: {
          '200': {
            description: 'Teacher deleted successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    message: { type: 'string', example: 'Teacher deleted successfully' }
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
    Teacher: {
      type: 'object',
      properties: {
        id: { type: 'integer', description: 'Unique teacher identifier', example: 1 },
        teacherName: { type: 'string', description: 'Teacher name', example: 'John Doe' },
        dateOfBirth: { type: 'string', format: 'date', description: 'Date of birth', example: '1990-01-15' },
        joiningDate: { type: 'string', format: 'date', description: 'Joining date', example: '2020-06-01' },
        phoneNumber: { type: 'string', description: 'Phone number', example: '9876543210' },
        email: { type: 'string', format: 'email', description: 'Email address', example: 'john.doe@school.edu' },
        socialGroup: { type: 'string', description: 'Social group', example: 'General' },
        religion: { type: 'string', description: 'Religion', example: 'Hindu' },
        gender: { type: 'string', enum: ['Male', 'Female'], description: 'Gender', example: 'Male' },
        aadhaarNumber: { type: 'string', description: 'Aadhaar number', example: '123456789012' },
        subjectsTaught: { type: 'array', items: { type: 'string' }, description: 'Subjects taught', example: ['Mathematics', 'Physics'] },
        classesTaught: { type: 'array', items: { type: 'string' }, description: 'Classes taught', example: ['Class 10', 'Class 12'] },
        is_active: { type: 'boolean', description: 'Whether teacher is active', example: true },
        created_at: { type: 'string', format: 'date-time', description: 'Creation timestamp', example: '2024-01-15T10:30:00Z' },
        updated_at: { type: 'string', format: 'date-time', description: 'Last update timestamp', example: '2024-01-15T15:45:00Z' }
      },
      required: ['id', 'teacherName']
    }
  }
};
