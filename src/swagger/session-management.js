module.exports = {
  paths: {
    '/sessions': {
      get: {
        tags: ['🛡️ Session Management'],
        summary: 'Get current user sessions',
        description: 'Retrieves all active sessions for the current user',
        security: [{ BearerAuth: [] }],
        responses: {
          '200': {
            description: 'Sessions retrieved successfully',
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
                          sessionId: { type: 'string', example: 'sess_123456789' },
                          device: { type: 'string', example: 'Chrome on Windows' },
                          ipAddress: { type: 'string', example: '192.168.1.1' },
                          lastActivity: { type: 'string', format: 'date-time', example: '2024-01-15T10:30:00Z' },
                          isCurrent: { type: 'boolean', example: true }
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
    '/sessions/{sessionId}': {
      delete: {
        tags: ['🛡️ Session Management'],
        summary: 'Revoke session',
        description: 'Revokes a specific session by its ID',
        security: [{ BearerAuth: [] }],
        parameters: [
          { name: 'sessionId', in: 'path', required: true, schema: { type: 'string' }, description: 'Session ID to revoke' }
        ],
        responses: {
          '200': {
            description: 'Session revoked successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    message: { type: 'string', example: 'Session revoked successfully' }
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
    '/sessions/others': {
      delete: {
        tags: ['🛡️ Session Management'],
        summary: 'Revoke all other sessions',
        description: 'Revokes all sessions except the current one',
        security: [{ BearerAuth: [] }],
        responses: {
          '200': {
            description: 'All other sessions revoked successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    message: { type: 'string', example: 'All other sessions revoked successfully' },
                    revokedCount: { type: 'integer', example: 3 }
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
    '/roles/hierarchy': {
      get: {
        tags: ['🛡️ Session Management'],
        summary: 'Get role hierarchy',
        description: 'Retrieves the role hierarchy with levels and descriptions',
        responses: {
          '200': {
            description: 'Role hierarchy retrieved successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    data: {
                      type: 'object',
                      properties: {
                        hierarchy: {
                          type: 'array',
                          items: {
                            type: 'object',
                            properties: {
                              role: { type: 'string', example: 'super_admin' },
                              level: { type: 'integer', example: 1 },
                              displayName: { type: 'string', example: 'Super Administrator' },
                              description: { type: 'string', example: 'Full system access' }
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
          '500': { $ref: '#/components/responses/ServerError' }
        }
      }
    },
    '/roles/permissions/all': {
      get: {
        tags: ['🛡️ Session Management'],
        summary: 'Get all permissions',
        description: 'Retrieves all available permissions grouped by category',
        responses: {
          '200': {
            description: 'Permissions retrieved successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    data: {
                      type: 'object',
                      properties: {
                        categories: {
                          type: 'array',
                          items: {
                            type: 'object',
                            properties: {
                              name: { type: 'string', example: 'User Management' },
                              permissions: {
                                type: 'array',
                                items: {
                                  type: 'object',
                                  properties: {
                                    name: { type: 'string', example: 'users.create' },
                                    description: { type: 'string', example: 'Create new users' }
                                  }
                                }
                              }
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
          '500': { $ref: '#/components/responses/ServerError' }
        }
      }
    },
    '/roles': {
      get: {
        tags: ['🛡️ Session Management'],
        summary: 'Get all roles',
        description: 'Retrieves a list of all available roles in the system',
        responses: {
          '200': {
            description: 'Roles retrieved successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    data: {
                      type: 'object',
                      properties: {
                        roles: { type: 'array', items: { $ref: '#/components/schemas/Role' } },
                        hierarchy: { type: 'object', description: 'Role hierarchy mapping' },
                        permissions: { type: 'object', description: 'Role permissions mapping' }
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
    '/roles/{role}/permissions': {
      get: {
        tags: ['🛡️ Session Management'],
        summary: 'Get role permissions',
        description: 'Retrieves permissions for a specific role',
        parameters: [
          { name: 'role', in: 'path', required: true, description: 'Role name', schema: { type: 'string', enum: ['super_admin', 'admin', 'deo', 'sdeo', 'hoi', 'teacher'] } }
        ],
        responses: {
          '200': {
            description: 'Role permissions retrieved successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    data: {
                      type: 'object',
                      properties: {
                        role: { type: 'string', example: 'admin' },
                        permissions: { type: 'array', items: { type: 'string' }, example: ['users.read', 'users.create', 'users.update'] },
                        displayName: { type: 'string', example: 'Administrator' },
                        description: { type: 'string', example: 'System administrator with full access' }
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
    '/permissions': {
      get: {
        tags: ['🛡️ Session Management'],
        summary: 'Get all permissions',
        description: 'Retrieves a list of all available permissions in the system',
        responses: {
          '200': {
            description: 'Permissions retrieved successfully',
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
                          name: { type: 'string', example: 'users.create' },
                          description: { type: 'string', example: 'Create new users' },
                          category: { type: 'string', example: 'User Management' }
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
    }
  },
  schemas: {
    Role: {
      type: 'object',
      properties: {
        name: { type: 'string', example: 'admin' },
        displayName: { type: 'string', example: 'Administrator' },
        description: { type: 'string', example: 'System administrator with full access' },
        level: { type: 'integer', example: 2 },
        permissions: { type: 'array', items: { type: 'string' }, example: ['users.read', 'users.create', 'users.update'] }
      }
    }
  }
};
