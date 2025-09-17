// Import all the smaller, focused modules
const authentication = require('./authentication')
const otpAuthentication = require('./otp-authentication')
const sessionManagement = require('./session-management')
const userProfile = require('./user-profile')
const userManagement = require('./user-management')
const schools = require('./schools')
const teachers = require('./teachers')
const medicalRecords = require('./medical-records')
const districts = require('./districts')
const rdBlocks = require('./rd-blocks')
const habitation = require('./habitation')
const blockOffices = require('./block-offices')
const managementTypes = require('./management-types')
const schoolTypes = require('./school-types')
const serviceCategories = require('./service-categories')
const subjects = require('./subjects')
const religions = require('./religions')
const mediums = require('./mediums')
const cascadeProtection = require('./cascade-protection')
const fileUploads = require('./file-uploads')
const reports = require('./reports')

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
    },
    {
      url: 'https://tms.gov.in/api',
      description: 'Production server'
    }
  ],
  tags: [
    // 1. Authentication & Security
    { name: '🔐 Authentication', description: 'User authentication and authorization' },
    { name: '📱 OTP Authentication', description: 'OTP-based authentication for teachers' },
    { name: '🛡️ Session Management', description: 'User session management and security' },
    { name: '👥 User Profile', description: 'User profile management and password operations' },

    // 2. User Management (Super Admin Only)
    { name: '👑 User Management', description: 'User management operations for super administrators' },

    // 3. Core Educational Entities
    { name: '🏫 Schools', description: 'School management operations' },
    { name: '👨‍🏫 Teachers', description: 'Teacher management operations' },
    { name: '🏥 Medical Records', description: 'Medical records management' },

    // 4. Geographic & Administrative Data
    { name: '🗺️ Districts', description: 'District management operations' },
    { name: '🏢 RD Blocks', description: 'RD Block management operations' },
    { name: '🏘️ Habitation', description: 'Habitation and location management operations' },
    { name: '🏛️ Block Offices', description: 'Block office management' },

    // 5. Reference Data & Lookup Tables
    { name: '🏢 Management Types', description: 'Management type management' },
    { name: '🏫 School Types', description: 'School type management' },
    { name: '📋 Service Categories', description: 'Service category management' },
    { name: '📖 Subjects', description: 'Subject management' },
    { name: '🕌 Religions', description: 'Religion management' },
    { name: '🗣️ Mediums', description: 'Medium management' },

    // 6. System Features & Utilities
    { name: '🔗 Cascade Protection', description: 'Safe deletion with cascade warnings' },
    { name: '📁 File Uploads', description: 'File upload and management' },
    { name: '📊 Reports', description: 'Reporting and analytics' }
  ],
  paths: {
    // Merge all path specifications from all focused modules
    ...authentication.paths,
    ...otpAuthentication.paths,
    ...sessionManagement.paths,
    ...userProfile.paths,
    ...userManagement.paths,
    ...schools.paths,
    ...teachers.paths,
    ...medicalRecords.paths,
    ...districts.paths,
    ...rdBlocks.paths,
    ...habitation.paths,
    ...blockOffices.paths,
    ...managementTypes.paths,
    ...schoolTypes.paths,
    ...serviceCategories.paths,
    ...subjects.paths,
    ...religions.paths,
    ...mediums.paths,
    ...cascadeProtection.paths,
    ...fileUploads.paths,
    ...reports.paths
  },
  components: {
    schemas: {
      // Merge all schemas from all focused modules
      ...authentication.schemas,
      ...otpAuthentication.schemas,
      ...sessionManagement.schemas,
      ...userProfile.schemas,
      ...userManagement.schemas,
      ...schools.schemas,
      ...teachers.schemas,
      ...medicalRecords.schemas,
      ...districts.schemas,
      ...rdBlocks.schemas,
      ...habitation.schemas,
      ...blockOffices.schemas,
      ...managementTypes.schemas,
      ...schoolTypes.schemas,
      ...serviceCategories.schemas,
      ...subjects.schemas,
      ...religions.schemas,
      ...mediums.schemas,
      ...cascadeProtection.schemas,
      ...fileUploads.schemas,
      ...reports.schemas
    },
    responses: {
      // Common response schemas
      ValidationError: {
        description: 'Validation error',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                success: { type: 'boolean', example: false },
                message: { type: 'string', example: 'Validation failed' },
                errors: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      field: { type: 'string', example: 'username' },
                      message: { type: 'string', example: 'Username is required' }
                    }
                  }
                }
              }
            }
          }
        }
      },
      NotFoundError: {
        description: 'Resource not found',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                success: { type: 'boolean', example: false },
                message: { type: 'string', example: 'Resource not found' }
              }
            }
          }
        }
      },
      UnauthorizedError: {
        description: 'Unauthorized access',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                success: { type: 'boolean', example: false },
                message: { type: 'string', example: 'Unauthorized' }
              }
            }
          }
        }
      },
      ForbiddenError: {
        description: 'Forbidden access',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                success: { type: 'boolean', example: false },
                message: { type: 'string', example: 'Forbidden' }
              }
            }
          }
        }
      },
      ServerError: {
        description: 'Internal server error',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                success: { type: 'boolean', example: false },
                message: { type: 'string', example: 'Internal server error' }
              }
            }
          }
        }
      }
    },
    securitySchemes: {
      BearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT'
      }
    }
  }
}

module.exports = swaggerSpec
