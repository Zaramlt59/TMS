module.exports = {
  paths: {
    '/user-management/users': {
      get: {
        tags: ['👑 User Management'],
        summary: 'Get all users',
        description: 'Retrieves a list of all users in the system (Super Admin only)',
        security: [{ BearerAuth: [] }],
        parameters: [
          { name: 'page', in: 'query', schema: { type: 'integer', minimum: 1, default: 1 } },
          { name: 'limit', in: 'query', schema: { type: 'integer', minimum: 1, maximum: 100, default: 10 } },
          { name: 'search', in: 'query', schema: { type: 'string' } },
          { name: 'role', in: 'query', schema: { type: 'string', enum: ['super_admin', 'admin', 'deo', 'sdeo', 'hoi', 'teacher'] } },
          { name: 'is_active', in: 'query', schema: { type: 'boolean' } }
        ],
        responses: {
          '200': {
            description: 'Users retrieved successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    data: {
                      type: 'object',
                      properties: {
                        users: { type: 'array', items: { $ref: '#/components/schemas/User' } },
                        pagination: { $ref: '#/components/schemas/Pagination' }
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
      },
      post: {
        tags: ['👑 User Management'],
        summary: 'Create new user',
        description: 'Creates a new user with specified role and details (Super Admin only)',
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['username', 'email', 'password', 'role'],
                properties: {
                  username: { type: 'string', example: 'newuser', minLength: 3, maxLength: 50 },
                  email: { type: 'string', format: 'email', example: 'newuser@tms.gov.in' },
                  phone: { type: 'string', example: '9876543210', pattern: '^[0-9]{10}$' },
                  password: { type: 'string', example: 'securepassword123', minLength: 6 },
                  role: { type: 'string', enum: ['super_admin', 'admin', 'deo', 'sdeo', 'hoi', 'teacher'], example: 'deo' },
                  is_active: { type: 'boolean', default: true }
                }
              }
            }
          }
        },
        responses: {
          '201': {
            description: 'User created successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    message: { type: 'string', example: 'User created successfully' },
                    data: { $ref: '#/components/schemas/User' }
                  }
                }
              }
            }
          },
          '400': { $ref: '#/components/responses/ValidationError' },
          '401': { $ref: '#/components/responses/UnauthorizedError' },
          '403': { $ref: '#/components/responses/ForbiddenError' },
          '409': {
            description: 'Conflict - Username or email already exists',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' }
              }
            }
          },
          '500': { $ref: '#/components/responses/ServerError' }
        }
      }
    },
    '/user-management/users/{id}/toggle-status': {
      patch: {
        tags: ['👑 User Management'],
        summary: 'Toggle user status',
        description: 'Toggles the active/inactive status of a user (Super Admin only)',
        security: [{ BearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'integer' }, description: 'User ID' }
        ],
        responses: {
          '200': {
            description: 'User status toggled successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    message: { type: 'string', example: 'User status toggled successfully' },
                    data: {
                      type: 'object',
                      properties: {
                        id: { type: 'integer', example: 1 },
                        is_active: { type: 'boolean', example: false }
                      }
                    }
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
    }
  },
  schemas: {
    Pagination: {
      type: 'object',
      properties: {
        page: { type: 'integer', example: 1 },
        limit: { type: 'integer', example: 10 },
        total: { type: 'integer', example: 100 },
        totalPages: { type: 'integer', example: 10 },
        hasNext: { type: 'boolean', example: true },
        hasPrev: { type: 'boolean', example: false }
      }
    },
    Error: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: false },
        message: { type: 'string', example: 'Error message' },
        code: { type: 'string', example: 'ERROR_CODE' }
      }
    }
  }
};
