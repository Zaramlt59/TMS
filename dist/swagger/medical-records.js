module.exports = {
  paths: {
    '/medical-records': {
      post: {
        tags: ['🏥 Medical Records'],
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
          '500': { $ref: '#/components/responses/ServerError' }
        }
      }
    },
    '/medical-records/{teacherId}': {
      get: {
        tags: ['🏥 Medical Records'],
        summary: 'Get medical records by teacher',
        description: 'Retrieves medical records for a specific teacher',
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
                    data: {
                      type: 'array',
                      items: { $ref: '#/components/schemas/MedicalRecord' }
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
    }
  },
  schemas: {
    MedicalRecord: {
      type: 'object',
      properties: {
        id: { type: 'integer', description: 'Medical record ID', example: 1 },
        teacherId: { type: 'integer', description: 'Teacher ID', example: 1 },
        ailmentName: { type: 'string', description: 'Ailment name', example: 'Diabetes' },
        severity: { type: 'string', enum: ['Mild', 'Moderate', 'Severe', 'Critical'], description: 'Severity level', example: 'Moderate' },
        remarks: { type: 'string', description: 'Additional remarks', example: 'Regular medication required' },
        documents: { type: 'string', description: 'Document file path', example: 'medical_report.pdf' },
        recordedBy: { type: 'integer', description: 'User ID who recorded this', example: 1 },
        recordedAt: { type: 'string', format: 'date-time', description: 'Recording timestamp', example: '2024-01-15T10:30:00Z' },
        is_active: { type: 'boolean', description: 'Active status', example: true },
        created_at: { type: 'string', format: 'date-time', description: 'Creation timestamp' },
        updated_at: { type: 'string', format: 'date-time', description: 'Last update timestamp' }
      },
      required: ['id', 'teacherId', 'ailmentName', 'severity']
    }
  }
};
