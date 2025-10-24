module.exports = {
  paths: {
    '/uploads': {
      post: {
        tags: ['📁 File Uploads'],
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
                  }
                },
                required: ['file']
              }
            }
          }
        },
        responses: {
          '200': {
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
          '500': { $ref: '#/components/responses/ServerError' }
        }
      }
    },
    '/uploads/{fileId}': {
      get: {
        tags: ['📁 File Uploads'],
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
        tags: ['📁 File Uploads'],
        summary: 'Delete uploaded file',
        description: 'Deletes an uploaded file from the server',
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
        tags: ['📁 File Uploads'],
        summary: 'Get files by category',
        description: 'Retrieves all files in a specific category',
        parameters: [
          { name: 'category', in: 'path', required: true, description: 'File category', schema: { type: 'string' } }
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
    UploadedFile: {
      type: 'object',
      properties: {
        id: { type: 'string', description: 'File ID', example: 'file_123456789' },
        originalName: { type: 'string', description: 'Original file name', example: 'document.pdf' },
        filename: { type: 'string', description: 'Stored file name', example: 'file_123456789.pdf' },
        mimeType: { type: 'string', description: 'File MIME type', example: 'application/pdf' },
        size: { type: 'integer', description: 'File size in bytes', example: 1024000 },
        path: { type: 'string', description: 'File path on server', example: '/uploads/documents/file_123456.pdf' },
        url: { type: 'string', description: 'File URL', example: 'https://api.tms.gov.in/uploads/documents/file_123456.pdf' },
        uploadedBy: { type: 'integer', description: 'User ID who uploaded the file', example: 1 },
        is_active: { type: 'boolean', description: 'Active status', example: true },
        created_at: { type: 'string', format: 'date-time', description: 'Upload timestamp' },
        updated_at: { type: 'string', format: 'date-time', description: 'Last update timestamp' }
      }
    }
  }
};
