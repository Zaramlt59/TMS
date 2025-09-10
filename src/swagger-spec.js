const swaggerSpec = {
  openapi: '3.0.0',
  info: {
    title: 'TMS API',
    version: '1.0.0',
    description: 'Teacher Management System API with Role-Based Access Control and OTP Authentication',
    contact: {
      name: 'TMS Development Team',
      email: 'support@tms.gov.in'
    }
  },
  servers: [
    {
      url: 'http://localhost:5004/api',
      description: 'Development server'
    }
  ],
  tags: [
    { name: 'Authentication', description: 'User authentication and authorization' },
    { name: 'OTP Authentication', description: 'OTP-based authentication for teachers' },
    { name: 'User Management', description: 'User management operations for super administrators' },
    { name: 'Roles & Permissions', description: 'Role hierarchy and permission system' },
    { name: 'Schools', description: 'School management operations' },
    { name: 'Teachers', description: 'Teacher management operations' },
    { name: 'Medical Records', description: 'Medical records management' },
    { name: 'Management Types', description: 'Management type management' },
    { name: 'School Types', description: 'School type management' },
    { name: 'Service Categories', description: 'Service category management' },
    { name: 'Block Offices', description: 'Block office management' },
    { name: 'Locations', description: 'Location management' },
    { name: 'Districts', description: 'District management' },
    { name: 'Subjects', description: 'Subject management' },
    { name: 'Religions', description: 'Religion management' },
    { name: 'Mediums', description: 'Medium management' },
    { name: 'Uploads', description: 'File upload management' }
  ],
  paths: {
    // Authentication endpoints
    '/users/login': {
      post: {
        tags: ['Authentication'],
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
                  password: { type: 'string', example: 'admin123', minLength: 6 }
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
                    data: {
                      type: 'object',
                      properties: {
                        token: { type: 'string', description: 'JWT authentication token' },
                        user: { $ref: '#/components/schemas/User' },
                        csrf: { type: 'string', description: 'CSRF token' }
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
    '/users/logout': {
      post: {
        tags: ['Authentication'],
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
          '401': { $ref: '#/components/responses/UnauthorizedError' }
        }
      }
    },
    // OTP Authentication endpoints
    '/otp-auth/send-otp': {
      post: {
        tags: ['OTP Authentication'],
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
        tags: ['OTP Authentication'],
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
        tags: ['OTP Authentication'],
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
    },
    // User Management endpoints
    '/user-management/users': {
      get: {
        tags: ['User Management'],
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
        tags: ['User Management'],
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
    // School Management endpoints
    '/schools': {
      get: {
        tags: ['Schools'],
        summary: 'Get all schools',
        description: 'Retrieves a list of all active schools',
        responses: {
          '200': {
            description: 'Schools retrieved successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    data: { type: 'array', items: { $ref: '#/components/schemas/School' } }
                  }
                }
              }
            }
          },
          '500': { $ref: '#/components/responses/ServerError' }
        }
      },
      post: {
        tags: ['Schools'],
        summary: 'Create new school',
        description: 'Creates a new school record',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['id', 'schoolName'],
                properties: {
                  id: { type: 'string', description: 'School ID', example: 'SCH001' },
                  schoolName: { type: 'string', description: 'School name', example: 'ABC High School' },
                  district: { type: 'string', description: 'District', example: 'Mumbai' },
                  rdBlock: { type: 'string', description: 'RD Block', example: 'Block A' },
                  schoolType: { type: 'string', description: 'School type', example: 'High School' },
                  management: { type: 'string', description: 'Management type', example: 'Government' },
                  medium: { type: 'string', description: 'Medium of instruction', example: 'English' }
                }
              }
            }
          }
        },
        responses: {
          '201': {
            description: 'School created successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    message: { type: 'string', example: 'School created successfully' },
                    data: { $ref: '#/components/schemas/School' }
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
    '/schools/stats': {
      get: {
        tags: ['Schools'],
        summary: 'Get school statistics',
        description: 'Retrieves statistical information about schools',
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
                        total: { type: 'integer', example: 150 },
                        byDistrict: { type: 'object', additionalProperties: { type: 'integer' } },
                        byType: { type: 'object', additionalProperties: { type: 'integer' } }
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
    '/schools/{id}': {
      get: {
        tags: ['Schools'],
        summary: 'Get school by ID',
        description: 'Retrieves a specific school by its ID',
        parameters: [
          { name: 'id', in: 'path', required: true, description: 'School ID', schema: { type: 'string' } }
        ],
        responses: {
          '200': {
            description: 'School retrieved successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    data: { $ref: '#/components/schemas/School' }
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
        tags: ['Schools'],
        summary: 'Update school',
        description: 'Updates an existing school record',
        parameters: [
          { name: 'id', in: 'path', required: true, description: 'School ID', schema: { type: 'string' } }
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  schoolName: { type: 'string', example: 'Updated School Name' },
                  district: { type: 'string', example: 'Updated District' },
                  rdBlock: { type: 'string', example: 'Updated Block' }
                }
              }
            }
          }
        },
        responses: {
          '200': {
            description: 'School updated successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    message: { type: 'string', example: 'School updated successfully' },
                    data: { $ref: '#/components/schemas/School' }
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
        tags: ['Schools'],
        summary: 'Delete school',
        description: 'Soft deletes a school record',
        parameters: [
          { name: 'id', in: 'path', required: true, description: 'School ID', schema: { type: 'string' } }
        ],
        responses: {
          '200': {
            description: 'School deleted successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    message: { type: 'string', example: 'School deleted successfully' }
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
    // Teacher Management endpoints
    '/teachers': {
      get: {
        tags: ['Teachers'],
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
        tags: ['Teachers'],
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
        tags: ['Teachers'],
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
        tags: ['Teachers'],
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
        tags: ['Teachers'],
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
        tags: ['Teachers'],
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
    },
    // Medical Records endpoints
    '/medical-records': {
      post: {
        tags: ['Medical Records'],
        summary: 'Create medical record',
        description: 'Creates a new medical record for a teacher (Admin only)',
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['teacherId', 'ailmentName', 'severity'],
                properties: {
                  teacherId: { type: 'integer', example: 1 },
                  ailmentName: { type: 'string', example: 'Diabetes' },
                  severity: { type: 'string', enum: ['Mild', 'Moderate', 'Severe', 'Critical'], example: 'Moderate' },
                  remarks: { type: 'string', example: 'Regular medication required' },
                  documents: { type: 'string', example: 'medical_report.pdf' }
                }
              }
            }
          }
        },
        responses: {
          '201': {
            description: 'Medical record created successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    message: { type: 'string', example: 'Medical record created successfully' },
                    data: { $ref: '#/components/schemas/MedicalRecord' }
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
    '/medical-records/{teacherId}': {
      get: {
        tags: ['Medical Records'],
        summary: 'Get medical records by teacher',
        description: 'Retrieves all medical records for a specific teacher',
        security: [{ BearerAuth: [] }],
        parameters: [
          { name: 'teacherId', in: 'path', required: true, description: 'Teacher ID', schema: { type: 'integer' } }
        ],
        responses: {
          '200': {
            description: 'Medical records retrieved successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    data: { type: 'array', items: { $ref: '#/components/schemas/MedicalRecord' } }
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
    // Master Data - Districts
    '/districts': {
      get: {
        tags: ['Districts'],
        summary: 'Get all active districts',
        description: 'Retrieves a list of all active districts',
        responses: {
          '200': {
            description: 'Districts retrieved successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    data: { type: 'array', items: { $ref: '#/components/schemas/District' } }
                  }
                }
              }
            }
          },
          '500': { $ref: '#/components/responses/ServerError' }
        }
      },
      post: {
        tags: ['Districts'],
        summary: 'Create new district',
        description: 'Creates a new district record',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['name'],
                properties: {
                  name: { type: 'string', example: 'Mumbai' },
                  isActive: { type: 'boolean', default: true }
                }
              }
            }
          }
        },
        responses: {
          '201': {
            description: 'District created successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    message: { type: 'string', example: 'District created successfully' },
                    data: { $ref: '#/components/schemas/District' }
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
    '/districts/{id}': {
      get: {
        tags: ['Districts'],
        summary: 'Get district by ID',
        description: 'Retrieves a specific district by its ID',
        parameters: [
          { name: 'id', in: 'path', required: true, description: 'District ID', schema: { type: 'integer' } }
        ],
        responses: {
          '200': {
            description: 'District retrieved successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    data: { $ref: '#/components/schemas/District' }
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
        tags: ['Districts'],
        summary: 'Update district',
        description: 'Updates an existing district record',
        parameters: [
          { name: 'id', in: 'path', required: true, description: 'District ID', schema: { type: 'integer' } }
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['name'],
                properties: {
                  name: { type: 'string', example: 'Updated District Name' },
                  isActive: { type: 'boolean', example: true }
                }
              }
            }
          }
        },
        responses: {
          '200': {
            description: 'District updated successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    message: { type: 'string', example: 'District updated successfully' },
                    data: { $ref: '#/components/schemas/District' }
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
        tags: ['Districts'],
        summary: 'Delete district',
        description: 'Soft deletes a district record',
        parameters: [
          { name: 'id', in: 'path', required: true, description: 'District ID', schema: { type: 'integer' } }
        ],
        responses: {
          '200': {
            description: 'District deleted successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    message: { type: 'string', example: 'District deleted successfully' }
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
    // Master Data - Subjects
    '/subjects': {
      get: {
        tags: ['Subjects'],
        summary: 'Get all subjects',
        description: 'Retrieves a list of all subjects',
        responses: {
          '200': {
            description: 'Subjects retrieved successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    data: { type: 'array', items: { $ref: '#/components/schemas/Subject' } }
                  }
                }
              }
            }
          },
          '500': { $ref: '#/components/responses/ServerError' }
        }
      },
      post: {
        tags: ['Subjects'],
        summary: 'Create new subject',
        description: 'Creates a new subject record',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['name'],
                properties: {
                  name: { type: 'string', example: 'Mathematics' },
                  code: { type: 'string', example: 'MATH' },
                  classes: { type: 'string', example: 'Class 1-12' }
                }
              }
            }
          }
        },
        responses: {
          '201': {
            description: 'Subject created successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    message: { type: 'string', example: 'Subject created successfully' },
                    data: { $ref: '#/components/schemas/Subject' }
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
    '/subjects/{id}': {
      get: {
        tags: ['Subjects'],
        summary: 'Get subject by ID',
        description: 'Retrieves a specific subject by its ID',
        parameters: [
          { name: 'id', in: 'path', required: true, description: 'Subject ID', schema: { type: 'integer' } }
        ],
        responses: {
          '200': {
            description: 'Subject retrieved successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    data: { $ref: '#/components/schemas/Subject' }
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
        tags: ['Subjects'],
        summary: 'Update subject',
        description: 'Updates an existing subject record',
        parameters: [
          { name: 'id', in: 'path', required: true, description: 'Subject ID', schema: { type: 'integer' } }
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['name'],
                properties: {
                  name: { type: 'string', example: 'Updated Subject Name' },
                  code: { type: 'string', example: 'UPDATED' },
                  classes: { type: 'string', example: 'Class 1-12' }
                }
              }
            }
          }
        },
        responses: {
          '200': {
            description: 'Subject updated successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    message: { type: 'string', example: 'Subject updated successfully' },
                    data: { $ref: '#/components/schemas/Subject' }
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
        tags: ['Subjects'],
        summary: 'Delete subject',
        description: 'Deletes a subject record',
        parameters: [
          { name: 'id', in: 'path', required: true, description: 'Subject ID', schema: { type: 'integer' } }
        ],
        responses: {
          '200': {
            description: 'Subject deleted successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    message: { type: 'string', example: 'Subject deleted successfully' }
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
    // Master Data - Religions
    '/religions': {
      get: {
        tags: ['Religions'],
        summary: 'Get all religions',
        description: 'Retrieves a list of all religions',
        responses: {
          '200': {
            description: 'Religions retrieved successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    data: { type: 'array', items: { $ref: '#/components/schemas/Religion' } }
                  }
                }
              }
            }
          },
          '500': { $ref: '#/components/responses/ServerError' }
        }
      },
      post: {
        tags: ['Religions'],
        summary: 'Create new religion',
        description: 'Creates a new religion record',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['name'],
                properties: {
                  name: { type: 'string', example: 'Hindu' }
                }
              }
            }
          }
        },
        responses: {
          '201': {
            description: 'Religion created successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    message: { type: 'string', example: 'Religion created successfully' },
                    data: { $ref: '#/components/schemas/Religion' }
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
    '/religions/{id}': {
      get: {
        tags: ['Religions'],
        summary: 'Get religion by ID',
        description: 'Retrieves a specific religion by its ID',
        parameters: [
          { name: 'id', in: 'path', required: true, description: 'Religion ID', schema: { type: 'integer' } }
        ],
        responses: {
          '200': {
            description: 'Religion retrieved successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    data: { $ref: '#/components/schemas/Religion' }
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
        tags: ['Religions'],
        summary: 'Update religion',
        description: 'Updates an existing religion record',
        parameters: [
          { name: 'id', in: 'path', required: true, description: 'Religion ID', schema: { type: 'integer' } }
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['name'],
                properties: {
                  name: { type: 'string', example: 'Updated Religion Name' }
                }
              }
            }
          }
        },
        responses: {
          '200': {
            description: 'Religion updated successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    message: { type: 'string', example: 'Religion updated successfully' },
                    data: { $ref: '#/components/schemas/Religion' }
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
        tags: ['Religions'],
        summary: 'Delete religion',
        description: 'Deletes a religion record',
        parameters: [
          { name: 'id', in: 'path', required: true, description: 'Religion ID', schema: { type: 'integer' } }
        ],
        responses: {
          '200': {
            description: 'Religion deleted successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    message: { type: 'string', example: 'Religion deleted successfully' }
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
    // Master Data - Mediums
    '/mediums': {
      get: {
        tags: ['Mediums'],
        summary: 'Get all mediums',
        description: 'Retrieves a list of all mediums of instruction',
        responses: {
          '200': {
            description: 'Mediums retrieved successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    data: { type: 'array', items: { $ref: '#/components/schemas/Medium' } }
                  }
                }
              }
            }
          },
          '500': { $ref: '#/components/responses/ServerError' }
        }
      },
      post: {
        tags: ['Mediums'],
        summary: 'Create new medium',
        description: 'Creates a new medium of instruction record',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['name'],
                properties: {
                  name: { type: 'string', example: 'English' }
                }
              }
            }
          }
        },
        responses: {
          '201': {
            description: 'Medium created successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    message: { type: 'string', example: 'Medium created successfully' },
                    data: { $ref: '#/components/schemas/Medium' }
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
    '/mediums/{id}': {
      get: {
        tags: ['Mediums'],
        summary: 'Get medium by ID',
        description: 'Retrieves a specific medium by its ID',
        parameters: [
          { name: 'id', in: 'path', required: true, description: 'Medium ID', schema: { type: 'integer' } }
        ],
        responses: {
          '200': {
            description: 'Medium retrieved successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    data: { $ref: '#/components/schemas/Medium' }
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
        tags: ['Mediums'],
        summary: 'Update medium',
        description: 'Updates an existing medium record',
        parameters: [
          { name: 'id', in: 'path', required: true, description: 'Medium ID', schema: { type: 'integer' } }
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['name'],
                properties: {
                  name: { type: 'string', example: 'Updated Medium Name' }
                }
              }
            }
          }
        },
        responses: {
          '200': {
            description: 'Medium updated successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    message: { type: 'string', example: 'Medium updated successfully' },
                    data: { $ref: '#/components/schemas/Medium' }
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
        tags: ['Mediums'],
        summary: 'Delete medium',
        description: 'Deletes a medium record',
        parameters: [
          { name: 'id', in: 'path', required: true, description: 'Medium ID', schema: { type: 'integer' } }
        ],
        responses: {
          '200': {
            description: 'Medium deleted successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    message: { type: 'string', example: 'Medium deleted successfully' }
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
    // Master Data - Management Types
    '/management-types': {
      get: {
        tags: ['Management Types'],
        summary: 'Get all management types',
        description: 'Retrieves a list of all management types',
        responses: {
          '200': {
            description: 'Management types retrieved successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    data: { type: 'array', items: { $ref: '#/components/schemas/ManagementType' } }
                  }
                }
              }
            }
          },
          '500': { $ref: '#/components/responses/ServerError' }
        }
      },
      post: {
        tags: ['Management Types'],
        summary: 'Create new management type',
        description: 'Creates a new management type record',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['name'],
                properties: {
                  name: { type: 'string', example: 'Government' }
                }
              }
            }
          }
        },
        responses: {
          '201': {
            description: 'Management type created successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    message: { type: 'string', example: 'Management type created successfully' },
                    data: { $ref: '#/components/schemas/ManagementType' }
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
    '/management-types/{id}': {
      get: {
        tags: ['Management Types'],
        summary: 'Get management type by ID',
        description: 'Retrieves a specific management type by its ID',
        parameters: [
          { name: 'id', in: 'path', required: true, description: 'Management Type ID', schema: { type: 'integer' } }
        ],
        responses: {
          '200': {
            description: 'Management type retrieved successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    data: { $ref: '#/components/schemas/ManagementType' }
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
        tags: ['Management Types'],
        summary: 'Update management type',
        description: 'Updates an existing management type record',
        parameters: [
          { name: 'id', in: 'path', required: true, description: 'Management Type ID', schema: { type: 'integer' } }
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['name'],
                properties: {
                  name: { type: 'string', example: 'Updated Management Type' }
                }
              }
            }
          }
        },
        responses: {
          '200': {
            description: 'Management type updated successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    message: { type: 'string', example: 'Management type updated successfully' },
                    data: { $ref: '#/components/schemas/ManagementType' }
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
        tags: ['Management Types'],
        summary: 'Delete management type',
        description: 'Deletes a management type record',
        parameters: [
          { name: 'id', in: 'path', required: true, description: 'Management Type ID', schema: { type: 'integer' } }
        ],
        responses: {
          '200': {
            description: 'Management type deleted successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    message: { type: 'string', example: 'Management type deleted successfully' }
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
    // Master Data - School Types
    '/school-types': {
      get: {
        tags: ['School Types'],
        summary: 'Get all school types',
        description: 'Retrieves a list of all school types',
        responses: {
          '200': {
            description: 'School types retrieved successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    data: { type: 'array', items: { $ref: '#/components/schemas/SchoolType' } }
                  }
                }
              }
            }
          },
          '500': { $ref: '#/components/responses/ServerError' }
        }
      },
      post: {
        tags: ['School Types'],
        summary: 'Create new school type',
        description: 'Creates a new school type record',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['name'],
                properties: {
                  name: { type: 'string', example: 'Primary School' }
                }
              }
            }
          }
        },
        responses: {
          '201': {
            description: 'School type created successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    message: { type: 'string', example: 'School type created successfully' },
                    data: { $ref: '#/components/schemas/SchoolType' }
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
    '/school-types/{id}': {
      get: {
        tags: ['School Types'],
        summary: 'Get school type by ID',
        description: 'Retrieves a specific school type by its ID',
        parameters: [
          { name: 'id', in: 'path', required: true, description: 'School Type ID', schema: { type: 'integer' } }
        ],
        responses: {
          '200': {
            description: 'School type retrieved successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    data: { $ref: '#/components/schemas/SchoolType' }
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
        tags: ['School Types'],
        summary: 'Update school type',
        description: 'Updates an existing school type record',
        parameters: [
          { name: 'id', in: 'path', required: true, description: 'School Type ID', schema: { type: 'integer' } }
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['name'],
                properties: {
                  name: { type: 'string', example: 'Updated School Type' }
                }
              }
            }
          }
        },
        responses: {
          '200': {
            description: 'School type updated successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    message: { type: 'string', example: 'School type updated successfully' },
                    data: { $ref: '#/components/schemas/SchoolType' }
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
        tags: ['School Types'],
        summary: 'Delete school type',
        description: 'Deletes a school type record',
        parameters: [
          { name: 'id', in: 'path', required: true, description: 'School Type ID', schema: { type: 'integer' } }
        ],
        responses: {
          '200': {
            description: 'School type deleted successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    message: { type: 'string', example: 'School type deleted successfully' }
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
    // Master Data - Service Categories
    '/service-categories': {
      get: {
        tags: ['Service Categories'],
        summary: 'Get all service categories',
        description: 'Retrieves a list of all service categories',
        responses: {
          '200': {
            description: 'Service categories retrieved successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    data: { type: 'array', items: { $ref: '#/components/schemas/ServiceCategory' } }
                  }
                }
              }
            }
          },
          '500': { $ref: '#/components/responses/ServerError' }
        }
      },
      post: {
        tags: ['Service Categories'],
        summary: 'Create new service category',
        description: 'Creates a new service category record',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['name'],
                properties: {
                  name: { type: 'string', example: 'Teaching' }
                }
              }
            }
          }
        },
        responses: {
          '201': {
            description: 'Service category created successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    message: { type: 'string', example: 'Service category created successfully' },
                    data: { $ref: '#/components/schemas/ServiceCategory' }
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
    '/service-categories/{id}': {
      get: {
        tags: ['Service Categories'],
        summary: 'Get service category by ID',
        description: 'Retrieves a specific service category by its ID',
        parameters: [
          { name: 'id', in: 'path', required: true, description: 'Service Category ID', schema: { type: 'integer' } }
        ],
        responses: {
          '200': {
            description: 'Service category retrieved successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    data: { $ref: '#/components/schemas/ServiceCategory' }
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
        tags: ['Service Categories'],
        summary: 'Update service category',
        description: 'Updates an existing service category record',
        parameters: [
          { name: 'id', in: 'path', required: true, description: 'Service Category ID', schema: { type: 'integer' } }
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['name'],
                properties: {
                  name: { type: 'string', example: 'Updated Service Category' }
                }
              }
            }
          }
        },
        responses: {
          '200': {
            description: 'Service category updated successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    message: { type: 'string', example: 'Service category updated successfully' },
                    data: { $ref: '#/components/schemas/ServiceCategory' }
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
        tags: ['Service Categories'],
        summary: 'Delete service category',
        description: 'Deletes a service category record',
        parameters: [
          { name: 'id', in: 'path', required: true, description: 'Service Category ID', schema: { type: 'integer' } }
        ],
        responses: {
          '200': {
            description: 'Service category deleted successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    message: { type: 'string', example: 'Service category deleted successfully' }
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
    // Master Data - Block Offices
    '/block-offices': {
      get: {
        tags: ['Block Offices'],
        summary: 'Get all block offices',
        description: 'Retrieves a list of all block offices',
        responses: {
          '200': {
            description: 'Block offices retrieved successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    data: { type: 'array', items: { $ref: '#/components/schemas/BlockOffice' } }
                  }
                }
              }
            }
          },
          '500': { $ref: '#/components/responses/ServerError' }
        }
      },
      post: {
        tags: ['Block Offices'],
        summary: 'Create new block office',
        description: 'Creates a new block office record',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['name', 'district_id'],
                properties: {
                  name: { type: 'string', example: 'Block Office 1' },
                  district_id: { type: 'integer', example: 1 }
                }
              }
            }
          }
        },
        responses: {
          '201': {
            description: 'Block office created successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    message: { type: 'string', example: 'Block office created successfully' },
                    data: { $ref: '#/components/schemas/BlockOffice' }
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
    '/block-offices/{id}': {
      get: {
        tags: ['Block Offices'],
        summary: 'Get block office by ID',
        description: 'Retrieves a specific block office by its ID',
        parameters: [
          { name: 'id', in: 'path', required: true, description: 'Block Office ID', schema: { type: 'integer' } }
        ],
        responses: {
          '200': {
            description: 'Block office retrieved successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    data: { $ref: '#/components/schemas/BlockOffice' }
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
        tags: ['Block Offices'],
        summary: 'Update block office',
        description: 'Updates an existing block office record',
        parameters: [
          { name: 'id', in: 'path', required: true, description: 'Block Office ID', schema: { type: 'integer' } }
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['name', 'district_id'],
                properties: {
                  name: { type: 'string', example: 'Updated Block Office' },
                  district_id: { type: 'integer', example: 1 }
                }
              }
            }
          }
        },
        responses: {
          '200': {
            description: 'Block office updated successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    message: { type: 'string', example: 'Block office updated successfully' },
                    data: { $ref: '#/components/schemas/BlockOffice' }
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
        tags: ['Block Offices'],
        summary: 'Delete block office',
        description: 'Deletes a block office record',
        parameters: [
          { name: 'id', in: 'path', required: true, description: 'Block Office ID', schema: { type: 'integer' } }
        ],
        responses: {
          '200': {
            description: 'Block office deleted successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    message: { type: 'string', example: 'Block office deleted successfully' }
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
    // Master Data - Locations
    '/locations': {
      get: {
        tags: ['Locations'],
        summary: 'Get all locations',
        description: 'Retrieves a list of all locations',
        responses: {
          '200': {
            description: 'Locations retrieved successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    data: { type: 'array', items: { $ref: '#/components/schemas/Location' } }
                  }
                }
              }
            }
          },
          '500': { $ref: '#/components/responses/ServerError' }
        }
      },
      post: {
        tags: ['Locations'],
        summary: 'Create new location',
        description: 'Creates a new location record',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['name', 'district_id'],
                properties: {
                  name: { type: 'string', example: 'Location 1' },
                  district_id: { type: 'integer', example: 1 },
                  block_office_id: { type: 'integer', example: 1 }
                }
              }
            }
          }
        },
        responses: {
          '201': {
            description: 'Location created successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    message: { type: 'string', example: 'Location created successfully' },
                    data: { $ref: '#/components/schemas/Location' }
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
    '/locations/{id}': {
      get: {
        tags: ['Locations'],
        summary: 'Get location by ID',
        description: 'Retrieves a specific location by its ID',
        parameters: [
          { name: 'id', in: 'path', required: true, description: 'Location ID', schema: { type: 'integer' } }
        ],
        responses: {
          '200': {
            description: 'Location retrieved successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    data: { $ref: '#/components/schemas/Location' }
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
        tags: ['Locations'],
        summary: 'Update location',
        description: 'Updates an existing location record',
        parameters: [
          { name: 'id', in: 'path', required: true, description: 'Location ID', schema: { type: 'integer' } }
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['name', 'district_id'],
                properties: {
                  name: { type: 'string', example: 'Updated Location' },
                  district_id: { type: 'integer', example: 1 },
                  block_office_id: { type: 'integer', example: 1 }
                }
              }
            }
          }
        },
        responses: {
          '200': {
            description: 'Location updated successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    message: { type: 'string', example: 'Location updated successfully' },
                    data: { $ref: '#/components/schemas/Location' }
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
        tags: ['Locations'],
        summary: 'Delete location',
        description: 'Deletes a location record',
        parameters: [
          { name: 'id', in: 'path', required: true, description: 'Location ID', schema: { type: 'integer' } }
        ],
        responses: {
          '200': {
            description: 'Location deleted successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    message: { type: 'string', example: 'Location deleted successfully' }
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
    // Roles & Permissions endpoints
    '/roles': {
      get: {
        tags: ['Roles & Permissions'],
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
        tags: ['Roles & Permissions'],
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
        tags: ['Roles & Permissions'],
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
    },
    // File Upload endpoints
    '/uploads': {
      post: {
        tags: ['Uploads'],
        summary: 'Upload file',
        description: 'Uploads a file to the server',
        requestBody: {
          required: true,
          content: {
            'multipart/form-data': {
              schema: {
                type: 'object',
                properties: {
                  file: {
                    type: 'string',
                    format: 'binary',
                    description: 'File to upload'
                  },
                  category: {
                    type: 'string',
                    description: 'File category',
                    example: 'documents'
                  },
                  description: {
                    type: 'string',
                    description: 'File description',
                    example: 'Teacher profile document'
                  }
                },
                required: ['file']
              }
            }
          }
        },
        responses: {
          '201': {
            description: 'File uploaded successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    message: { type: 'string', example: 'File uploaded successfully' },
                    data: { $ref: '#/components/schemas/UploadedFile' }
                  }
                }
              }
            }
          },
          '400': { $ref: '#/components/responses/ValidationError' },
          '413': {
            description: 'File too large',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' },
                example: {
                  success: false,
                  message: 'File too large',
                  error: 'File size exceeds maximum allowed limit'
                }
              }
            }
          },
          '415': {
            description: 'Unsupported media type',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' },
                example: {
                  success: false,
                  message: 'Unsupported file type',
                  error: 'File type not allowed'
                }
              }
            }
          },
          '500': { $ref: '#/components/responses/ServerError' }
        }
      }
    },
    '/uploads/{fileId}': {
      get: {
        tags: ['Uploads'],
        summary: 'Get file information',
        description: 'Retrieves information about a specific uploaded file',
        parameters: [
          { name: 'fileId', in: 'path', required: true, description: 'File ID', schema: { type: 'string' } }
        ],
        responses: {
          '200': {
            description: 'File information retrieved successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    data: { $ref: '#/components/schemas/UploadedFile' }
                  }
                }
              }
            }
          },
          '404': { $ref: '#/components/responses/NotFoundError' },
          '500': { $ref: '#/components/responses/ServerError' }
        }
      },
      delete: {
        tags: ['Uploads'],
        summary: 'Delete file',
        description: 'Deletes an uploaded file',
        parameters: [
          { name: 'fileId', in: 'path', required: true, description: 'File ID', schema: { type: 'string' } }
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
          '404': { $ref: '#/components/responses/NotFoundError' },
          '500': { $ref: '#/components/responses/ServerError' }
        }
      }
    },
    '/uploads/category/{category}': {
      get: {
        tags: ['Uploads'],
        summary: 'Get files by category',
        description: 'Retrieves all files in a specific category',
        parameters: [
          { name: 'category', in: 'path', required: true, description: 'File category', schema: { type: 'string' } },
          { name: 'page', in: 'query', description: 'Page number', schema: { type: 'integer', default: 1 } },
          { name: 'limit', in: 'query', description: 'Items per page', schema: { type: 'integer', default: 10 } }
        ],
        responses: {
          '200': {
            description: 'Files retrieved successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    data: {
                      type: 'array',
                      items: { $ref: '#/components/schemas/UploadedFile' }
                    },
                    pagination: { $ref: '#/components/schemas/Pagination' }
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
  components: {
    schemas: {
      User: {
        type: 'object',
        properties: {
          id: { type: 'integer', description: 'Unique user identifier', example: 1 },
          username: { type: 'string', description: 'Username', example: 'admin' },
          email: { type: 'string', description: 'Email address', example: 'admin@tms.gov.in' },
          phone: { type: 'string', description: 'Phone number', example: '9876543210' },
          role: { type: 'string', enum: ['super_admin', 'admin', 'deo', 'sdeo', 'hoi', 'teacher'], description: 'User role', example: 'admin' },
          is_active: { type: 'boolean', description: 'Whether user account is active', example: true },
          created_at: { type: 'string', format: 'date-time', description: 'Account creation timestamp', example: '2024-01-15T10:30:00Z' },
          updated_at: { type: 'string', format: 'date-time', description: 'Last update timestamp', example: '2024-01-15T15:45:00Z' }
        },
        required: ['id', 'username', 'email', 'role', 'is_active', 'created_at']
      },
      School: {
        type: 'object',
        properties: {
          id: { type: 'integer', description: 'Unique school identifier', example: 1 },
          school_id: { type: 'string', description: 'Business school ID', example: 'SCH001' },
          school_name: { type: 'string', description: 'School name', example: 'ABC High School' },
          district: { type: 'string', description: 'District', example: 'Mumbai' },
          rd_block: { type: 'string', description: 'RD Block', example: 'Block A' },
          school_type: { type: 'string', description: 'School type', example: 'High School' },
          management: { type: 'string', description: 'Management type', example: 'Government' },
          medium: { type: 'string', description: 'Medium of instruction', example: 'English' },
          is_active: { type: 'boolean', description: 'Whether school is active', example: true },
          created_at: { type: 'string', format: 'date-time', description: 'Creation timestamp', example: '2024-01-15T10:30:00Z' },
          updated_at: { type: 'string', format: 'date-time', description: 'Last update timestamp', example: '2024-01-15T15:45:00Z' }
        },
        required: ['id', 'school_id', 'school_name']
      },
      Teacher: {
        type: 'object',
        properties: {
          id: { type: 'integer', description: 'Unique teacher identifier', example: 1 },
          teacher_name: { type: 'string', description: 'Teacher name', example: 'John Doe' },
          date_of_birth: { type: 'string', format: 'date', description: 'Date of birth', example: '1990-01-15' },
          joining_date: { type: 'string', format: 'date', description: 'Joining date', example: '2020-06-01' },
          phone_number: { type: 'string', description: 'Phone number', example: '9876543210' },
          email: { type: 'string', format: 'email', description: 'Email address', example: 'john.doe@school.edu' },
          social_group: { type: 'string', description: 'Social group', example: 'General' },
          religion: { type: 'string', description: 'Religion', example: 'Hindu' },
          gender: { type: 'string', enum: ['Male', 'Female'], description: 'Gender', example: 'Male' },
          aadhaar_number: { type: 'string', description: 'Aadhaar number', example: '123456789012' },
          subjects_taught: { type: 'array', items: { type: 'string' }, description: 'Subjects taught', example: ['Mathematics', 'Physics'] },
          classes_taught: { type: 'array', items: { type: 'string' }, description: 'Classes taught', example: ['Class 10', 'Class 12'] },
          is_active: { type: 'boolean', description: 'Whether teacher is active', example: true },
          created_at: { type: 'string', format: 'date-time', description: 'Creation timestamp', example: '2024-01-15T10:30:00Z' },
          updated_at: { type: 'string', format: 'date-time', description: 'Last update timestamp', example: '2024-01-15T15:45:00Z' }
        },
        required: ['id', 'teacher_name']
      },
      MedicalRecord: {
        type: 'object',
        properties: {
          id: { type: 'integer', description: 'Unique medical record identifier', example: 1 },
          teacher_id: { type: 'integer', description: 'Teacher ID', example: 1 },
          ailment_name: { type: 'string', description: 'Ailment name', example: 'Diabetes' },
          severity: { type: 'string', enum: ['Mild', 'Moderate', 'Severe', 'Critical'], description: 'Severity level', example: 'Moderate' },
          remarks: { type: 'string', description: 'Additional remarks', example: 'Regular medication required' },
          documents: { type: 'string', description: 'Document references', example: 'medical_report.pdf' },
          created_at: { type: 'string', format: 'date-time', description: 'Creation timestamp', example: '2024-01-15T10:30:00Z' },
          updated_at: { type: 'string', format: 'date-time', description: 'Last update timestamp', example: '2024-01-15T15:45:00Z' }
        },
        required: ['id', 'teacher_id', 'ailment_name', 'severity']
      },
      District: {
        type: 'object',
        properties: {
          id: { type: 'integer', description: 'Unique district identifier', example: 1 },
          name: { type: 'string', description: 'District name', example: 'Mumbai' },
          isActive: { type: 'boolean', description: 'Whether district is active', example: true },
          created_at: { type: 'string', format: 'date-time', description: 'Creation timestamp', example: '2024-01-15T10:30:00Z' },
          updated_at: { type: 'string', format: 'date-time', description: 'Last update timestamp', example: '2024-01-15T15:45:00Z' }
        },
        required: ['id', 'name']
      },
      Subject: {
        type: 'object',
        properties: {
          id: { type: 'integer', description: 'Unique subject identifier', example: 1 },
          name: { type: 'string', description: 'Subject name', example: 'Mathematics' },
          code: { type: 'string', description: 'Subject code', example: 'MATH' },
          classes: { type: 'string', description: 'Classes for this subject', example: 'Class 1-12' },
          created_at: { type: 'string', format: 'date-time', description: 'Creation timestamp', example: '2024-01-15T10:30:00Z' },
          updated_at: { type: 'string', format: 'date-time', description: 'Last update timestamp', example: '2024-01-15T15:45:00Z' }
        },
        required: ['id', 'name']
      },
      Religion: {
        type: 'object',
        properties: {
          id: { type: 'integer', description: 'Unique religion identifier', example: 1 },
          name: { type: 'string', description: 'Religion name', example: 'Hindu' },
          created_at: { type: 'string', format: 'date-time', description: 'Creation timestamp', example: '2024-01-15T10:30:00Z' },
          updated_at: { type: 'string', format: 'date-time', description: 'Last update timestamp', example: '2024-01-15T15:45:00Z' }
        },
        required: ['id', 'name']
      },
      Medium: {
        type: 'object',
        properties: {
          id: { type: 'integer', description: 'Unique medium identifier', example: 1 },
          name: { type: 'string', description: 'Medium name', example: 'English' },
          created_at: { type: 'string', format: 'date-time', description: 'Creation timestamp', example: '2024-01-15T10:30:00Z' },
          updated_at: { type: 'string', format: 'date-time', description: 'Last update timestamp', example: '2024-01-15T15:45:00Z' }
        },
        required: ['id', 'name']
      },
      ManagementType: {
        type: 'object',
        properties: {
          id: { type: 'integer', description: 'Unique management type identifier', example: 1 },
          name: { type: 'string', description: 'Management type name', example: 'Government' },
          created_at: { type: 'string', format: 'date-time', description: 'Creation timestamp', example: '2024-01-15T10:30:00Z' },
          updated_at: { type: 'string', format: 'date-time', description: 'Last update timestamp', example: '2024-01-15T15:45:00Z' }
        },
        required: ['id', 'name']
      },
      SchoolType: {
        type: 'object',
        properties: {
          id: { type: 'integer', description: 'Unique school type identifier', example: 1 },
          name: { type: 'string', description: 'School type name', example: 'Primary School' },
          created_at: { type: 'string', format: 'date-time', description: 'Creation timestamp', example: '2024-01-15T10:30:00Z' },
          updated_at: { type: 'string', format: 'date-time', description: 'Last update timestamp', example: '2024-01-15T15:45:00Z' }
        },
        required: ['id', 'name']
      },
      ServiceCategory: {
        type: 'object',
        properties: {
          id: { type: 'integer', description: 'Unique service category identifier', example: 1 },
          name: { type: 'string', description: 'Service category name', example: 'Teaching' },
          created_at: { type: 'string', format: 'date-time', description: 'Creation timestamp', example: '2024-01-15T10:30:00Z' },
          updated_at: { type: 'string', format: 'date-time', description: 'Last update timestamp', example: '2024-01-15T15:45:00Z' }
        },
        required: ['id', 'name']
      },
      BlockOffice: {
        type: 'object',
        properties: {
          id: { type: 'integer', description: 'Unique block office identifier', example: 1 },
          name: { type: 'string', description: 'Block office name', example: 'Block Office 1' },
          district_id: { type: 'integer', description: 'District ID', example: 1 },
          created_at: { type: 'string', format: 'date-time', description: 'Creation timestamp', example: '2024-01-15T10:30:00Z' },
          updated_at: { type: 'string', format: 'date-time', description: 'Last update timestamp', example: '2024-01-15T15:45:00Z' }
        },
        required: ['id', 'name', 'district_id']
      },
      Location: {
        type: 'object',
        properties: {
          id: { type: 'integer', description: 'Unique location identifier', example: 1 },
          name: { type: 'string', description: 'Location name', example: 'Location 1' },
          district_id: { type: 'integer', description: 'District ID', example: 1 },
          block_office_id: { type: 'integer', description: 'Block Office ID', example: 1 },
          created_at: { type: 'string', format: 'date-time', description: 'Creation timestamp', example: '2024-01-15T10:30:00Z' },
          updated_at: { type: 'string', format: 'date-time', description: 'Last update timestamp', example: '2024-01-15T15:45:00Z' }
        },
        required: ['id', 'name', 'district_id']
      },
      Role: {
        type: 'object',
        properties: {
          name: { type: 'string', description: 'Role name', example: 'admin' },
          displayName: { type: 'string', description: 'Role display name', example: 'Administrator' },
          description: { type: 'string', description: 'Role description', example: 'System administrator with full access' },
          level: { type: 'integer', description: 'Role hierarchy level', example: 2 },
          permissions: { type: 'array', items: { type: 'string' }, description: 'Role permissions', example: ['users.read', 'users.create', 'users.update'] }
        },
        required: ['name', 'displayName', 'level']
      },
      UploadedFile: {
        type: 'object',
        properties: {
          id: { type: 'string', description: 'Unique file identifier', example: 'file_123456' },
          filename: { type: 'string', description: 'Generated filename', example: 'document.pdf' },
          originalName: { type: 'string', description: 'Original filename', example: 'teacher_certificate.pdf' },
          size: { type: 'integer', description: 'File size in bytes', example: 1024000 },
          mimeType: { type: 'string', description: 'File MIME type', example: 'application/pdf' },
          url: { type: 'string', description: 'File access URL', example: '/uploads/documents/file_123456.pdf' },
          category: { type: 'string', description: 'File category', example: 'documents' },
          description: { type: 'string', description: 'File description', example: 'Teacher profile document' },
          uploadedBy: { type: 'integer', description: 'User ID who uploaded the file', example: 1 },
          uploadedAt: { type: 'string', format: 'date-time', description: 'Upload timestamp', example: '2024-01-15T10:30:00Z' }
        },
        required: ['id', 'filename', 'originalName', 'size', 'mimeType', 'url', 'uploadedAt']
      },
      Pagination: {
        type: 'object',
        properties: {
          page: { type: 'integer', description: 'Current page number', example: 1 },
          limit: { type: 'integer', description: 'Items per page', example: 10 },
          total: { type: 'integer', description: 'Total number of items', example: 50 },
          pages: { type: 'integer', description: 'Total number of pages', example: 5 },
          hasNext: { type: 'boolean', description: 'Whether there is a next page', example: true },
          hasPrev: { type: 'boolean', description: 'Whether there is a previous page', example: false }
        }
      },
      Error: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: false },
          message: { type: 'string', description: 'Error message', example: 'An error occurred' },
          error: { type: 'string', description: 'Detailed error information (development only)', example: 'Database connection failed' }
        }
      }
    },
    securitySchemes: {
      BearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'JWT token obtained from login or OTP verification'
      }
    },
    responses: {
      UnauthorizedError: {
        description: 'Unauthorized - Authentication required',
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/Error' },
            example: {
              success: false,
              message: 'Authentication required',
              error: 'No valid token provided'
            }
          }
        }
      },
      ForbiddenError: {
        description: 'Forbidden - Insufficient permissions',
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/Error' },
            example: {
              success: false,
              message: 'Insufficient permissions',
              error: 'User role does not have required permissions'
            }
          }
        }
      },
      NotFoundError: {
        description: 'Resource not found',
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/Error' },
            example: {
              success: false,
              message: 'Resource not found',
              error: 'The requested resource does not exist'
            }
          }
        }
      },
      ValidationError: {
        description: 'Bad request - Validation error',
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/Error' },
            example: {
              success: false,
              message: 'Validation failed',
              error: 'Invalid input data provided'
            }
          }
        }
      },
      ServerError: {
        description: 'Internal server error',
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/Error' },
            example: {
              success: false,
              message: 'Internal server error',
              error: 'An unexpected error occurred'
            }
          }
        }
      }
    }
  },
  security: [{ BearerAuth: [] }]
}

module.exports = swaggerSpec
