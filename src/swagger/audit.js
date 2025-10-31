module.exports = {
  paths: {
    '/audit/logs': {
      get: {
        tags: ['📋 Audit Logs'],
        summary: 'Get audit logs',
        description: 'Retrieves audit logs with filtering and pagination (Admin only)',
        security: [{ BearerAuth: [] }],
        parameters: [
          { name: 'page', in: 'query', schema: { type: 'integer', default: 1 }, description: 'Page number' },
          { name: 'limit', in: 'query', schema: { type: 'integer', default: 20 }, description: 'Items per page' },
          { name: 'userId', in: 'query', schema: { type: 'integer' }, description: 'Filter by user ID' },
          { name: 'action', in: 'query', schema: { type: 'string' }, description: 'Filter by action (e.g., create, update, delete)' },
          { name: 'resourceType', in: 'query', schema: { type: 'string' }, description: 'Filter by resource type' },
          { name: 'success', in: 'query', schema: { type: 'boolean' }, description: 'Filter by success status' },
          { name: 'startDate', in: 'query', schema: { type: 'string', format: 'date-time' }, description: 'Filter by start date' },
          { name: 'endDate', in: 'query', schema: { type: 'string', format: 'date-time' }, description: 'Filter by end date' }
        ],
        responses: {
          '200': {
            description: 'Audit logs retrieved successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    data: {
                      type: 'array',
                      items: { $ref: '#/components/schemas/AuditLog' }
                    },
                    pagination: {
                      type: 'object',
                      properties: {
                        page: { type: 'integer', example: 1 },
                        limit: { type: 'integer', example: 20 },
                        total: { type: 'integer', example: 100 },
                        totalPages: { type: 'integer', example: 5 }
                      }
                    }
                  }
                }
              }
            }
          },
          '401': { $ref: '#/components/responses/UnauthorizedError' },
          '403': { $ref: '#/components/responses/ForbiddenError' },
          '500': { $ref: '#/components/responses/ServerError' }
        }
      }
    },
    '/audit/logs/{id}': {
      get: {
        tags: ['📋 Audit Logs'],
        summary: 'Get audit log by ID',
        description: 'Retrieves a specific audit log entry by its ID (Admin only)',
        security: [{ BearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'integer' }, description: 'Audit log ID' }
        ],
        responses: {
          '200': {
            description: 'Audit log retrieved successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    data: { $ref: '#/components/schemas/AuditLog' }
                  }
                }
              }
            }
          },
          '401': { $ref: '#/components/responses/UnauthorizedError' },
          '403': { $ref: '#/components/responses/ForbiddenError' },
          '404': { $ref: '#/components/responses/NotFoundError' },
          '500': { $ref: '#/components/responses/ServerError' }
        }
      }
    },
    '/audit/security-alerts': {
      get: {
        tags: ['📋 Audit Logs'],
        summary: 'Get security alerts',
        description: 'Retrieves security-related audit logs (Admin only)',
        security: [{ BearerAuth: [] }],
        parameters: [
          { name: 'page', in: 'query', schema: { type: 'integer', default: 1 }, description: 'Page number' },
          { name: 'limit', in: 'query', schema: { type: 'integer', default: 20 }, description: 'Items per page' },
          { name: 'days', in: 'query', schema: { type: 'integer', default: 7 }, description: 'Number of days to look back' }
        ],
        responses: {
          '200': {
            description: 'Security alerts retrieved successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    data: {
                      type: 'array',
                      items: { $ref: '#/components/schemas/AuditLog' }
                    },
                    pagination: {
                      type: 'object',
                      properties: {
                        page: { type: 'integer', example: 1 },
                        limit: { type: 'integer', example: 20 },
                        total: { type: 'integer', example: 10 },
                        totalPages: { type: 'integer', example: 1 }
                      }
                    }
                  }
                }
              }
            }
          },
          '401': { $ref: '#/components/responses/UnauthorizedError' },
          '403': { $ref: '#/components/responses/ForbiddenError' },
          '500': { $ref: '#/components/responses/ServerError' }
        }
      }
    },
    '/audit/stats': {
      get: {
        tags: ['📋 Audit Logs'],
        summary: 'Get audit statistics',
        description: 'Retrieves audit log statistics for the specified time period (Admin only)',
        security: [{ BearerAuth: [] }],
        parameters: [
          { name: 'days', in: 'query', schema: { type: 'integer', default: 30 }, description: 'Number of days to analyze' }
        ],
        responses: {
          '200': {
            description: 'Audit statistics retrieved successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    data: {
                      type: 'object',
                      properties: {
                        totalLogs: { type: 'integer', example: 1500 },
                        successfulActions: { type: 'integer', example: 1400 },
                        failedActions: { type: 'integer', example: 100 },
                        actionsByType: { type: 'object', example: { create: 500, update: 600, delete: 400 } },
                        actionsByResource: { type: 'object', example: { users: 200, schools: 300, teachers: 1000 } }
                      }
                    }
                  }
                }
              }
            }
          },
          '401': { $ref: '#/components/responses/UnauthorizedError' },
          '403': { $ref: '#/components/responses/ForbiddenError' },
          '500': { $ref: '#/components/responses/ServerError' }
        }
      }
    },
    '/audit/export': {
      get: {
        tags: ['📋 Audit Logs'],
        summary: 'Export audit logs to CSV',
        description: 'Exports audit logs to CSV format with optional filtering (Admin only)',
        security: [{ BearerAuth: [] }],
        parameters: [
          { name: 'userId', in: 'query', schema: { type: 'integer' }, description: 'Filter by user ID' },
          { name: 'action', in: 'query', schema: { type: 'string' }, description: 'Filter by action' },
          { name: 'resourceType', in: 'query', schema: { type: 'string' }, description: 'Filter by resource type' },
          { name: 'success', in: 'query', schema: { type: 'boolean' }, description: 'Filter by success status' },
          { name: 'startDate', in: 'query', schema: { type: 'string', format: 'date-time' }, description: 'Filter by start date' },
          { name: 'endDate', in: 'query', schema: { type: 'string', format: 'date-time' }, description: 'Filter by end date' }
        ],
        responses: {
          '200': {
            description: 'Audit logs exported successfully',
            content: {
              'text/csv': {
                schema: { type: 'string', format: 'binary' }
              }
            },
            headers: {
              'Content-Disposition': {
                schema: { type: 'string', example: 'attachment; filename="audit_logs.csv"' }
              }
            }
          },
          '401': { $ref: '#/components/responses/UnauthorizedError' },
          '403': { $ref: '#/components/responses/ForbiddenError' },
          '500': { $ref: '#/components/responses/ServerError' }
        }
      }
    },
    '/audit/export/manual': {
      post: {
        tags: ['📋 Audit Logs'],
        summary: 'Manually export audit logs',
        description: 'Manually exports audit logs for a specific date range to CSV file (Admin only)',
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['startDate', 'endDate'],
                properties: {
                  startDate: { type: 'string', format: 'date-time', example: '2024-01-01T00:00:00Z', description: 'Start date for export' },
                  endDate: { type: 'string', format: 'date-time', example: '2024-01-31T23:59:59Z', description: 'End date for export' }
                }
              }
            }
          }
        },
        responses: {
          '200': {
            description: 'Audit logs exported successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    message: { type: 'string', example: 'Audit logs exported successfully' },
                    data: {
                      type: 'object',
                      properties: {
                        exportPath: { type: 'string', example: '/exports/audit-logs/audit_logs_20240101_20240131.csv' },
                        recordCount: { type: 'integer', example: 500 },
                        filename: { type: 'string', example: 'audit_logs_20240101_20240131.csv' }
                      }
                    }
                  }
                }
              }
            }
          },
          '400': { $ref: '#/components/responses/ValidationError' },
          '401': { $ref: '#/components/responses/UnauthorizedError' },
          '403': { $ref: '#/components/responses/ForbiddenError' },
          '500': { $ref: '#/components/responses/ServerError' }
        }
      }
    },
    '/audit/export/files': {
      get: {
        tags: ['📋 Audit Logs'],
        summary: 'Get list of exported files',
        description: 'Retrieves a list of all exported audit log CSV files (Admin only)',
        security: [{ BearerAuth: [] }],
        responses: {
          '200': {
            description: 'Exported files list retrieved successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    data: {
                      type: 'array',
                      items: {
                        type: 'object',
                        properties: {
                          filename: { type: 'string', example: 'audit_logs_20240101_20240131.csv' },
                          filePath: { type: 'string', example: '/exports/audit-logs/audit_logs_20240101_20240131.csv' },
                          size: { type: 'integer', example: 1024000, description: 'File size in bytes' },
                          created: { type: 'string', format: 'date-time', example: '2024-01-31T10:00:00Z' },
                          modified: { type: 'string', format: 'date-time', example: '2024-01-31T10:00:00Z' }
                        }
                      }
                    }
                  }
                }
              }
            }
          },
          '401': { $ref: '#/components/responses/UnauthorizedError' },
          '403': { $ref: '#/components/responses/ForbiddenError' },
          '500': { $ref: '#/components/responses/ServerError' }
        }
      }
    },
    '/audit/export/files/{filename}': {
      get: {
        tags: ['📋 Audit Logs'],
        summary: 'Download exported CSV file',
        description: 'Downloads a specific exported audit log CSV file (Admin only)',
        security: [{ BearerAuth: [] }],
        parameters: [
          { name: 'filename', in: 'path', required: true, schema: { type: 'string' }, description: 'CSV filename' }
        ],
        responses: {
          '200': {
            description: 'File downloaded successfully',
            content: {
              'text/csv': {
                schema: { type: 'string', format: 'binary' }
              }
            },
            headers: {
              'Content-Disposition': {
                schema: { type: 'string', example: 'attachment; filename="audit_logs_20240101_20240131.csv"' }
              }
            }
          },
          '400': { $ref: '#/components/responses/ValidationError' },
          '401': { $ref: '#/components/responses/UnauthorizedError' },
          '403': { $ref: '#/components/responses/ForbiddenError' },
          '404': { $ref: '#/components/responses/NotFoundError' },
          '500': { $ref: '#/components/responses/ServerError' }
        }
      },
      delete: {
        tags: ['📋 Audit Logs'],
        summary: 'Delete exported CSV file',
        description: 'Deletes a specific exported audit log CSV file (Admin only)',
        security: [{ BearerAuth: [] }],
        parameters: [
          { name: 'filename', in: 'path', required: true, schema: { type: 'string' }, description: 'CSV filename' }
        ],
        responses: {
          '200': {
            description: 'File deleted successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    message: { type: 'string', example: 'File deleted successfully' }
                  }
                }
              }
            }
          },
          '400': { $ref: '#/components/responses/ValidationError' },
          '401': { $ref: '#/components/responses/UnauthorizedError' },
          '403': { $ref: '#/components/responses/ForbiddenError' },
          '404': { $ref: '#/components/responses/NotFoundError' },
          '500': { $ref: '#/components/responses/ServerError' }
        }
      }
    }
  },
  schemas: {
    AuditLog: {
      type: 'object',
      properties: {
        id: { type: 'integer', example: 1 },
        user_id: { type: 'integer', example: 5 },
        action: { type: 'string', example: 'create', enum: ['create', 'update', 'delete', 'read', 'login', 'logout'] },
        resource_type: { type: 'string', example: 'users' },
        resource_id: { type: 'integer', nullable: true, example: 10 },
        success: { type: 'boolean', example: true },
        ip_address: { type: 'string', nullable: true, example: '192.168.1.1' },
        user_agent: { type: 'string', nullable: true, example: 'Mozilla/5.0...' },
        details: { type: 'object', nullable: true, description: 'Additional details about the action' },
        created_at: { type: 'string', format: 'date-time', example: '2024-01-15T10:30:00Z' },
        users: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 5 },
            username: { type: 'string', example: 'admin' },
            email: { type: 'string', example: 'admin@tms.com' }
          }
        }
      }
    }
  }
};

