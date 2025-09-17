module.exports = {
  paths: {
    '/otp-auth/send-otp': {
      post: {
        tags: ['📱 OTP Authentication'],
        summary: 'Send OTP to phone number',
        description: 'Sends a 6-digit OTP to the provided phone number for teacher authentication',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['phone'],
                properties: {
                  phone: {
                    type: 'string',
                    description: 'Phone number to send OTP to',
                    example: '6909701606',
                    pattern: '^[0-9]{10}$'
                  }
                }
              }
            }
          }
        },
        responses: {
          '200': {
            description: 'OTP sent successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    message: { type: 'string', example: 'OTP sent successfully' }
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
    '/otp-auth/verify-otp': {
      post: {
        tags: ['📱 OTP Authentication'],
        summary: 'Verify OTP and login',
        description: 'Verifies the provided OTP and logs in the teacher user',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['phone', 'otp'],
                properties: {
                  phone: { type: 'string', example: '6909701606' },
                  otp: { type: 'string', example: '123456', pattern: '^[0-9]{6}$' }
                }
              }
            }
          }
        },
        responses: {
          '200': {
            description: 'OTP verified successfully and user logged in',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    message: { type: 'string', example: 'Login successful' },
                    token: { type: 'string', description: 'JWT authentication token' },
                    user: { $ref: '#/components/schemas/User' }
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
    '/otp-auth/resend-otp': {
      post: {
        tags: ['📱 OTP Authentication'],
        summary: 'Resend OTP',
        description: 'Resends OTP to the same phone number',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['phone'],
                properties: {
                  phone: { type: 'string', example: '6909701606' }
                }
              }
            }
          }
        },
        responses: {
          '200': {
            description: 'OTP resent successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    message: { type: 'string', example: 'OTP resent successfully' }
                  }
                }
              }
            }
          },
          '400': { $ref: '#/components/responses/ValidationError' },
          '429': {
            description: 'Too many requests - Rate limited',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' }
              }
            }
          },
          '500': { $ref: '#/components/responses/ServerError' }
        }
      }
    }
  },
  schemas: {}
};
