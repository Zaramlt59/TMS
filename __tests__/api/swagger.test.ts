import request from 'supertest'
import { createApp } from '../../src/app'

const app = createApp()

describe('Swagger Documentation API', () => {
  describe('GET /api/docs', () => {
    it('should serve Swagger UI', async () => {
      const response = await request(app)
        .get('/api/docs/')
        .expect(200)

      expect(response.text).toContain('swagger-ui')
      expect(response.text).toContain('TMS API')
    })
  })

  describe('GET /api/docs/swagger.json', () => {
    it('should serve OpenAPI specification', async () => {
      const response = await request(app)
        .get('/api/docs/swagger.json')
        .expect(200)

      const spec = response.body
      expect(spec.openapi).toBe('3.0.0')
      expect(spec.info.title).toBe('TMS API')
      expect(spec.info.version).toBe('1.0.0')
      expect(spec.tags).toBeDefined()
      expect(spec.paths).toBeDefined()
      expect(spec.components).toBeDefined()
    })

    it('should have all expected tags', async () => {
      const response = await request(app)
        .get('/api/docs/swagger.json')
        .expect(200)

      const spec = response.body
      const expectedTags = [
        '🔐 Authentication',
        '📱 OTP Authentication',
        '🛡️ Session Management',
        '👥 User Profile',
        '👑 User Management',
        '🏫 Schools',
        '👨‍🏫 Teachers',
        '🏥 Medical Records',
        '🗺️ Districts',
        '🏢 RD Blocks',
        '🏘️ Habitation',
        '🏛️ Block Offices',
        '🏢 Management Types',
        '🏫 School Types',
        '📋 Service Categories',
        '📖 Subjects',
        '🕌 Religions',
        '🗣️ Mediums',
        '🔗 Cascade Protection',
        '📁 File Uploads',
        '📊 Reports'
      ]

      const actualTags = spec.tags.map((tag: any) => tag.name)
      expectedTags.forEach(expectedTag => {
        expect(actualTags).toContain(expectedTag)
      })
    })

    it('should have expected number of endpoints', async () => {
      const response = await request(app)
        .get('/api/docs/swagger.json')
        .expect(200)

      const spec = response.body
      const endpointCount = Object.keys(spec.paths).length
      
      // Should have around 62 endpoints based on our modular structure
      expect(endpointCount).toBeGreaterThan(50)
      expect(endpointCount).toBeLessThan(100)
    })

    it('should have authentication endpoints', async () => {
      const response = await request(app)
        .get('/api/docs/swagger.json')
        .expect(200)

      const spec = response.body
      expect(spec.paths['/auth/login']).toBeDefined()
      expect(spec.paths['/auth/logout']).toBeDefined()
      expect(spec.paths['/auth/refresh']).toBeDefined()
    })

    it('should have OTP authentication endpoints', async () => {
      const response = await request(app)
        .get('/api/docs/swagger.json')
        .expect(200)

      const spec = response.body
      expect(spec.paths['/otp-auth/send-otp']).toBeDefined()
      expect(spec.paths['/otp-auth/verify-otp']).toBeDefined()
      expect(spec.paths['/otp-auth/resend-otp']).toBeDefined()
    })

    it('should have schools endpoints', async () => {
      const response = await request(app)
        .get('/api/docs/swagger.json')
        .expect(200)

      const spec = response.body
      expect(spec.paths['/schools']).toBeDefined()
      expect(spec.paths['/schools/{id}']).toBeDefined()
    })

    it('should have medical records endpoints', async () => {
      const response = await request(app)
        .get('/api/docs/swagger.json')
        .expect(200)

      const spec = response.body
      expect(spec.paths['/medical-records']).toBeDefined()
      expect(spec.paths['/medical-records/{teacherId}']).toBeDefined()
    })

    it('should have proper security schemes', async () => {
      const response = await request(app)
        .get('/api/docs/swagger.json')
        .expect(200)

      const spec = response.body
      expect(spec.components.securitySchemes).toBeDefined()
      expect(spec.components.securitySchemes.BearerAuth).toBeDefined()
      expect(spec.components.securitySchemes.BearerAuth.type).toBe('http')
      expect(spec.components.securitySchemes.BearerAuth.scheme).toBe('bearer')
    })

    it('should have proper response schemas', async () => {
      const response = await request(app)
        .get('/api/docs/swagger.json')
        .expect(200)

      const spec = response.body
      expect(spec.components.responses).toBeDefined()
      expect(spec.components.responses.ValidationError).toBeDefined()
      expect(spec.components.responses.NotFoundError).toBeDefined()
      expect(spec.components.responses.UnauthorizedError).toBeDefined()
      expect(spec.components.responses.ServerError).toBeDefined()
    })
  })
})
