module.exports = {
  paths: {
    '/roles': {
      get: {
        tags: ['🔐 Roles & Permissions'],
        summary: 'Get all roles',
        description: 'Retrieves a list of all available roles with their hierarchy and permissions',
        security: [{ BearerAuth: [] }],
        responses: {
          '200': {
            description: 'Roles retrieved successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    message: { type: 'string', example: 'Roles retrieved successfully' },
                    data: {
                      type: 'object',
                      properties: {
                        roles: {
                          type: 'array',
                          items: { $ref: '#/components/schemas/Role' }
                        },
                        hierarchy: {
                          type: 'object',
                          description: 'Role hierarchy mapping (role name to level)',
                          example: {
                            super_admin: 6,
                            admin: 5,
                            deo: 4,
                            sdeo: 3,
                            hoi: 2,
                            teacher: 1
                          }
                        },
                        permissions: {
                          type: 'object',
                          description: 'Role permissions mapping',
                          example: {
                            admin: ['users.read', 'users.create', 'users.update'],
                            teacher: ['teachers.read_own']
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
    '/roles/{role}/permissions': {
      get: {
        tags: ['🔐 Roles & Permissions'],
        summary: 'Get role permissions',
        description: 'Retrieves permissions for a specific role',
        security: [{ BearerAuth: [] }],
        parameters: [
          {
            name: 'role',
            in: 'path',
            required: true,
            description: 'Role name',
            schema: {
              type: 'string',
              enum: ['super_admin', 'admin', 'deo', 'sdeo', 'hoi', 'teacher']
            },
            example: 'admin'
          }
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
                    message: { type: 'string', example: 'Role permissions retrieved successfully' },
                    data: {
                      type: 'object',
                      properties: {
                        role: { type: 'string', example: 'admin' },
                        display_name: { type: 'string', example: 'Administrator' },
                        description: { type: 'string', example: 'Administrative access to manage schools, teachers, and system data' },
                        level: { type: 'integer', example: 5 },
                        permissions: {
                          type: 'array',
                          items: { type: 'string' },
                          example: ['users.read', 'users.create', 'users.update', 'schools.create', 'schools.read']
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
    '/roles/hierarchy': {
      get: {
        tags: ['🔐 Roles & Permissions'],
        summary: 'Get role hierarchy',
        description: 'Retrieves the role hierarchy information showing the level structure',
        security: [{ BearerAuth: [] }],
        responses: {
          '200': {
            description: 'Role hierarchy retrieved successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    message: { type: 'string', example: 'Role hierarchy retrieved successfully' },
                    data: {
                      type: 'object',
                      properties: {
                        hierarchy: {
                          type: 'array',
                          items: {
                            type: 'object',
                            properties: {
                              role: { type: 'string', example: 'super_admin' },
                              level: { type: 'integer', example: 6 },
                              display_name: { type: 'string', example: 'Super Administrator' },
                              description: { type: 'string', example: 'Full system access including user management and role assignment' }
                            }
                          }
                        },
                        levels: {
                          type: 'object',
                          description: 'Role to level mapping',
                          example: {
                            super_admin: 6,
                            admin: 5,
                            deo: 4,
                            sdeo: 3,
                            hoi: 2,
                            teacher: 1
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
    '/roles/permissions/all': {
      get: {
        tags: ['🔐 Roles & Permissions'],
        summary: 'Get all permissions',
        description: 'Retrieves a list of all available permissions in the system, grouped by category',
        security: [{ BearerAuth: [] }],
        responses: {
          '200': {
            description: 'All permissions retrieved successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    message: { type: 'string', example: 'All permissions retrieved successfully' },
                    data: {
                      type: 'object',
                      properties: {
                        permissions: {
                          type: 'array',
                          items: { type: 'string' },
                          example: ['users.create', 'users.read', 'users.update', 'users.delete', 'schools.create', 'schools.read'],
                          description: 'Sorted list of all unique permissions'
                        },
                        permissionsByCategory: {
                          type: 'object',
                          description: 'Permissions grouped by category',
                          example: {
                            users: ['users.create', 'users.read', 'users.update', 'users.delete'],
                            schools: ['schools.create', 'schools.read', 'schools.update', 'schools.delete'],
                            teachers: ['teachers.create', 'teachers.read', 'teachers.update', 'teachers.delete']
                          }
                        },
                        totalCount: { type: 'integer', example: 25, description: 'Total number of unique permissions' }
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
    }
  },
  schemas: {
    Role: {
      type: 'object',
      properties: {
        name: { type: 'string', example: 'admin', enum: ['super_admin', 'admin', 'deo', 'sdeo', 'hoi', 'teacher'] },
        display_name: { type: 'string', example: 'Administrator' },
        description: { type: 'string', example: 'Administrative access to manage schools, teachers, and system data' },
        level: { type: 'integer', example: 5, description: 'Role hierarchy level (1-6)' },
        permissions: {
          type: 'array',
          items: { type: 'string' },
          example: ['users.read', 'users.create', 'users.update', 'schools.create', 'schools.read'],
          description: 'List of permissions for this role'
        }
      }
    }
  }
};

