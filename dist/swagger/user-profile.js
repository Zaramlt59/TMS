module.exports = {
  paths: {
    '/users/profile': {
      get: {
        tags: ['👥 User Profile'],
        summary: 'Get current user profile',
        description: 'Retrieves the current authenticated user\'s profile information',
        security: [{ BearerAuth: [] }],
        responses: {
          '200': {
            description: 'User profile retrieved successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    data: { $ref: '#/components/schemas/User' }
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
    '/users/me': {
      get: {
        tags: ['👥 User Profile'],
        summary: 'Get current user profile',
        description: 'Retrieves the current authenticated user\'s profile information',
        security: [{ BearerAuth: [] }],
        responses: {
          '200': {
            description: 'User profile retrieved successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    message: { type: 'string', example: 'User profile retrieved successfully' },
                    data: {
                      type: 'object',
                      properties: {
                        id: { type: 'integer', example: 1 },
                        username: { type: 'string', example: 'john_doe' },
                        email: { type: 'string', example: 'john@example.com' },
                        phone: { type: 'string', example: '9876543210' },
                        role: { type: 'string', example: 'teacher' },
                        is_active: { type: 'boolean', example: true },
                        created_at: { type: 'string', format: 'date-time', example: '2024-01-15T10:30:00Z' },
                        updated_at: { type: 'string', format: 'date-time', example: '2024-01-15T10:30:00Z' }
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
      },
      put: {
        tags: ['👥 User Profile'],
        summary: 'Update current user profile',
        description: 'Updates the current authenticated user\'s profile information',
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  username: { type: 'string', example: 'john_doe_updated' },
                  email: { type: 'string', format: 'email', example: 'john.updated@example.com' },
                  phone: { type: 'string', example: '9876543210' }
                }
              }
            }
          }
        },
        responses: {
          '200': {
            description: 'User profile updated successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    message: { type: 'string', example: 'User profile updated successfully' },
                    data: {
                      type: 'object',
                      properties: {
                        id: { type: 'integer', example: 1 },
                        username: { type: 'string', example: 'john_doe_updated' },
                        email: { type: 'string', example: 'john.updated@example.com' },
                        phone: { type: 'string', example: '9876543210' },
                        role: { type: 'string', example: 'teacher' },
                        is_active: { type: 'boolean', example: true },
                        created_at: { type: 'string', format: 'date-time', example: '2024-01-15T10:30:00Z' },
                        updated_at: { type: 'string', format: 'date-time', example: '2024-01-15T10:30:00Z' }
                      }
                    }
                  }
                }
              }
            }
          },
          '400': { $ref: '#/components/responses/ValidationError' },
          '401': { $ref: '#/components/responses/UnauthorizedError' },
          '404': { $ref: '#/components/responses/NotFoundError' },
          '500': { $ref: '#/components/responses/ServerError' }
        }
      }
    },
    '/users/change-password': {
      post: {
        tags: ['👥 User Profile'],
        summary: 'Change password',
        description: 'Changes the current authenticated user\'s password',
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['currentPassword', 'newPassword'],
                properties: {
                  currentPassword: { type: 'string', example: 'oldpassword123' },
                  newPassword: { type: 'string', example: 'newpassword123', minLength: 6 }
                }
              }
            }
          }
        },
        responses: {
          '200': {
            description: 'Password changed successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    message: { type: 'string', example: 'Password changed successfully' }
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
    }
  },
  schemas: {}
};
