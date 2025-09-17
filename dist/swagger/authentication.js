module.exports = {
  paths: {
    '/auth/login': {
      post: {
        tags: ['🔐 Authentication'],
        summary: 'User login with username and password',
        description: 'Authenticates users with username and password credentials',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['username', 'password'],
                properties: {
                  username: { type: 'string', example: 'admin' },
                  password: { type: 'string', example: 'password123' }
                }
              }
            }
          }
        },
        responses: {
          '200': {
            description: 'Login successful',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    message: { type: 'string', example: 'Login successful' },
                    token: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' },
                    user: { $ref: '#/components/schemas/User' }
                  }
                }
              }
            }
          },
          '401': { $ref: '#/components/responses/UnauthorizedError' },
          '400': { $ref: '#/components/responses/ValidationError' },
          '500': { $ref: '#/components/responses/ServerError' }
        }
      }
    },
    '/auth/logout': {
      post: {
        tags: ['🔐 Authentication'],
        summary: 'User logout',
        description: 'Logs out the current user and invalidates the session',
        security: [{ BearerAuth: [] }],
        responses: {
          '200': {
            description: 'Logout successful',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    message: { type: 'string', example: 'Logout successful' }
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
    '/auth/refresh': {
      post: {
        tags: ['🔐 Authentication'],
        summary: 'Refresh access token',
        description: 'Refreshes the access token using the refresh token',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['refreshToken'],
                properties: {
                  refreshToken: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' }
                }
              }
            }
          }
        },
        responses: {
          '200': {
            description: 'Token refreshed successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    message: { type: 'string', example: 'Token refreshed successfully' },
                    accessToken: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' }
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
    '/auth/request-password-reset': {
      post: {
        tags: ['🔐 Authentication'],
        summary: 'Request password reset',
        description: 'Sends a password reset email to the user',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['email'],
                properties: {
                  email: { type: 'string', format: 'email', example: 'user@example.com' }
                }
              }
            }
          }
        },
        responses: {
          '200': {
            description: 'Password reset email sent successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    message: { type: 'string', example: 'Password reset email sent successfully' }
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
    },
    '/auth/reset-password': {
      post: {
        tags: ['🔐 Authentication'],
        summary: 'Reset password',
        description: 'Resets the user password using the reset token',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['token', 'newPassword'],
                properties: {
                  token: { type: 'string', example: 'reset_token_here' },
                  newPassword: { type: 'string', example: 'newpassword123', minLength: 6 }
                }
              }
            }
          }
        },
        responses: {
          '200': {
            description: 'Password reset successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    message: { type: 'string', example: 'Password reset successfully' }
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
  schemas: {
    User: {
      type: 'object',
      properties: {
        id: { type: 'integer', description: 'Unique user identifier', example: 1 },
        username: { type: 'string', description: 'Username', example: 'admin' },
        email: { type: 'string', format: 'email', example: 'admin@example.com' },
        role: { type: 'string', example: 'super_admin' }
      }
    }
  }
};
