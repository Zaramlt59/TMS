module.exports = {
  paths: {
    '/reports/dashboard-stats': {
      get: {
        tags: ['📊 Reports'],
        summary: 'Get dashboard statistics',
        description: 'Retrieves comprehensive dashboard statistics',
        security: [{ BearerAuth: [] }],
        responses: {
          '200': {
            description: 'Dashboard statistics retrieved successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    data: {
                      type: 'object',
                      properties: {
                        totalSchools: { type: 'integer', example: 150 },
                        totalTeachers: { type: 'integer', example: 500 },
                        totalStudents: { type: 'integer', example: 5000 },
                        totalDistricts: { type: 'integer', example: 10 },
                        recentActivities: {
                          type: 'array',
                          items: {
                            type: 'object',
                            properties: {
                              type: { type: 'string', example: 'teacher_added' },
                              description: { type: 'string', example: 'New teacher added' },
                              timestamp: { type: 'string', format: 'date-time', example: '2024-01-15T10:30:00Z' }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          },
          '401': { $ref: '#/components/responses/UnauthorizedError' },
          '500': { $ref: '#/components/responses/ServerError' }
        }
      }
    },
    '/reports/export': {
      post: {
        tags: ['📊 Reports'],
        summary: 'Export data',
        description: 'Exports data in specified format',
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['type', 'format'],
                properties: {
                  type: { type: 'string', enum: ['teachers', 'schools', 'students'], example: 'teachers' },
                  format: { type: 'string', enum: ['csv', 'excel', 'pdf'], example: 'excel' },
                  filters: {
                    type: 'object',
                    properties: {
                      district: { type: 'string', example: 'Mumbai' },
                      dateRange: {
                        type: 'object',
                        properties: {
                          start: { type: 'string', format: 'date', example: '2024-01-01' },
                          end: { type: 'string', format: 'date', example: '2024-12-31' }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        },
        responses: {
          '200': {
            description: 'Export generated successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    message: { type: 'string', example: 'Export generated successfully' },
                    data: {
                      type: 'object',
                      properties: {
                        downloadUrl: { type: 'string', example: '/downloads/export_123456.xlsx' },
                        expiresAt: { type: 'string', format: 'date-time', example: '2024-01-16T10:30:00Z' }
                      }
                    }
                  }
                }
              }
            }
          },
          '400': { $ref: '#/components/responses/ValidationError' },
          '401': { $ref: '#/components/responses/UnauthorizedError' },
          '500': { $ref: '#/components/responses/ServerError' }
        }
      }
    },
    '/reports/teacher/{teacherId}': {
      get: {
        tags: ['📊 Reports'],
        summary: 'Get teacher analytics',
        description: 'Retrieves analytics and reports for a specific teacher',
        security: [{ BearerAuth: [] }],
        parameters: [
          { name: 'teacherId', in: 'path', required: true, description: 'Teacher ID', schema: { type: 'integer' } }
        ],
        responses: {
          '200': {
            description: 'Teacher analytics retrieved successfully',
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
                        totalClasses: { type: 'integer', example: 5 },
                        totalStudents: { type: 'integer', example: 120 },
                        subjectsTaught: { type: 'array', items: { type: 'string' }, example: ['Mathematics', 'Physics'] },
                        performanceMetrics: {
                          type: 'object',
                          properties: {
                            attendanceRate: { type: 'number', example: 95.5 },
                            studentSatisfaction: { type: 'number', example: 4.2 }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          },
          '401': { $ref: '#/components/responses/UnauthorizedError' },
          '404': { $ref: '#/components/responses/NotFoundError' },
          '500': { $ref: '#/components/responses/ServerError' }
        }
      }
    },
    '/reports/school/{schoolId}': {
      get: {
        tags: ['📊 Reports'],
        summary: 'Get school analytics',
        description: 'Retrieves analytics and reports for a specific school',
        security: [{ BearerAuth: [] }],
        parameters: [
          { name: 'schoolId', in: 'path', required: true, description: 'School ID', schema: { type: 'string' } }
        ],
        responses: {
          '200': {
            description: 'School analytics retrieved successfully',
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
                        totalTeachers: { type: 'integer', example: 25 },
                        totalStudents: { type: 'integer', example: 500 },
                        totalClasses: { type: 'integer', example: 20 },
                        infrastructure: {
                          type: 'object',
                          properties: {
                            classrooms: { type: 'integer', example: 20 },
                            laboratories: { type: 'integer', example: 3 },
                            library: { type: 'boolean', example: true }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          },
          '401': { $ref: '#/components/responses/UnauthorizedError' },
          '404': { $ref: '#/components/responses/NotFoundError' },
          '500': { $ref: '#/components/responses/ServerError' }
        }
      }
    },
    '/reports/district/{district}': {
      get: {
        tags: ['📊 Reports'],
        summary: 'Get district analytics',
        description: 'Retrieves analytics and reports for a specific district',
        security: [{ BearerAuth: [] }],
        parameters: [
          { name: 'district', in: 'path', required: true, description: 'District name', schema: { type: 'string' } }
        ],
        responses: {
          '200': {
            description: 'District analytics retrieved successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    data: {
                      type: 'object',
                      properties: {
                        district: { type: 'string', example: 'Mumbai' },
                        totalSchools: { type: 'integer', example: 50 },
                        totalTeachers: { type: 'integer', example: 200 },
                        totalStudents: { type: 'integer', example: 2000 },
                        rdBlocks: { type: 'integer', example: 10 },
                        habitations: { type: 'integer', example: 100 }
                      }
                    }
                  }
                }
              }
            }
          },
          '401': { $ref: '#/components/responses/UnauthorizedError' },
          '404': { $ref: '#/components/responses/NotFoundError' },
          '500': { $ref: '#/components/responses/ServerError' }
        }
      }
    }
  },
  schemas: {}
};
