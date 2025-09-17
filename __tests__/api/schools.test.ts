import request from 'supertest'
import { createApp } from '../../src/app'
import { testPrisma } from '../setup/test-db'

const app = createApp()

describe('Schools API', () => {
  let authToken: string

  beforeAll(async () => {
    // Wait longer for test setup to complete
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Ensure admin user exists by creating it if needed
    const bcrypt = require('bcrypt')
    const { setupSimpleTestData } = require('../setup/simple-test-db')
    
    try {
      // Run the test data setup to ensure admin user exists
      await setupSimpleTestData()
      console.log('✅ Ensured admin user exists for Schools tests')
    } catch (error) {
      console.error('❌ Failed to ensure admin user exists:', error)
    }
    
    // Try multiple times to get auth token
    let loginResponse
    let attempts = 0
    const maxAttempts = 5
    
    while (attempts < maxAttempts) {
      loginResponse = await request(app)
        .post('/api/auth/login')
        .send({
          username: 'admin',
          password: 'admin123'
        })
      
      if (loginResponse.status === 200 && loginResponse.body.data) {
        authToken = loginResponse.body.data.token
        break
      }
      
      attempts++
      if (attempts < maxAttempts) {
        console.log(`Authentication attempt ${attempts} failed, retrying...`)
        await new Promise(resolve => setTimeout(resolve, 1000))
      }
    }
    
    if (!authToken) {
      console.error('Failed to get auth token after', maxAttempts, 'attempts:', loginResponse.status, loginResponse.body)
      throw new Error('Authentication failed in test setup')
    }
  })

  describe('GET /api/schools', () => {
    it('should get all schools', async () => {
      const response = await request(app)
        .get('/api/schools')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)

      expect(response.body.success).toBe(true)
      expect(Array.isArray(response.body.data)).toBe(true)
    })

    it('should require authentication', async () => {
      await request(app)
        .get('/api/schools')
        .expect(401)
    })
  })

  describe('POST /api/schools', () => {
    it('should create a new school', async () => {
      const schoolData = {
        school_id: `TEST${Date.now()}`,
        school_name: 'Test School',
        school_type: 'Co-educational',
        school_level: 'Primary, Secondary',
        management: 'Government',
        medium: 'English',
        pincode: '123456',
        district: 'Test District',
        rd_block: 'Test RD Block',
        school_phone: '9876543210',
        school_email: 'test@school.com',
        habitation: 'Test Village',
        habitation_class: 'Rural',
        habitation_category: 'Village',
        block_office: 'DEO Aizawl'
      }

      const response = await request(app)
        .post('/api/schools')
        .set('Authorization', `Bearer ${authToken}`)
        .send(schoolData)
        .expect(201)

      expect(response.body.success).toBe(true)
      expect(response.body.data.school_name).toBe('Test School')
    })

    it('should validate required fields', async () => {
      await request(app)
        .post('/api/schools')
        .set('Authorization', `Bearer ${authToken}`)
        .send({})
        .expect(400)
    })
  })

  describe('GET /api/schools/:id', () => {
    it('should get school by ID', async () => {
      // First create a school
      const schoolData = {
        school_id: `TEST${Date.now() + 1}`,
        school_name: 'Test School 2',
        school_type: 'Co-educational',
        school_level: 'Primary, Secondary',
        management: 'Government',
        medium: 'English',
        pincode: '123456',
        district: 'Test District',
        rd_block: 'Test RD Block',
        school_phone: '9876543210',
        school_email: 'test2@school.com',
        habitation: 'Test Village',
        habitation_class: 'Rural',
        habitation_category: 'Village',
        block_office: 'DEO Aizawl'
      }

      const createResponse = await request(app)
        .post('/api/schools')
        .set('Authorization', `Bearer ${authToken}`)
        .send(schoolData)

      const schoolId = createResponse.body.data.id

      // Then get the school
      const response = await request(app)
        .get(`/api/schools/${schoolId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)

      expect(response.body.success).toBe(true)
      expect(response.body.data.school_name).toBe('Test School 2')
    })

    it('should return 404 for non-existent school', async () => {
      await request(app)
        .get('/api/schools/99999')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404)
    })
  })

  describe('PUT /api/schools/:id', () => {
    it('should update school', async () => {
      // First create a school
      const schoolData = {
        school_id: `TEST${Date.now() + 2}`,
        school_name: 'Test School 3',
        school_type: 'Co-educational',
        school_level: 'Primary, Secondary',
        management: 'Government',
        medium: 'English',
        pincode: '123456',
        district: 'Test District',
        rd_block: 'Test RD Block',
        school_phone: '9876543210',
        school_email: 'test3@school.com',
        habitation: 'Test Village',
        habitation_class: 'Rural',
        habitation_category: 'Village',
        block_office: 'DEO Aizawl'
      }

      const createResponse = await request(app)
        .post('/api/schools')
        .set('Authorization', `Bearer ${authToken}`)
        .send(schoolData)

      const schoolId = createResponse.body.data.id

      // Then update the school
      const updateData = {
        school_name: 'Updated Test School 3'
      }

      const response = await request(app)
        .put(`/api/schools/${schoolId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData)
        .expect(200)

      expect(response.body.success).toBe(true)
      expect(response.body.data.school_name).toBe('Updated Test School 3')
    })
  })

  describe('DELETE /api/schools/:id', () => {
    it('should delete school', async () => {
      // First create a school
      const schoolData = {
        school_id: `TEST${Date.now() + 3}`,
        school_name: 'Test School 4',
        school_type: 'Co-educational',
        school_level: 'Primary, Secondary',
        management: 'Government',
        medium: 'English',
        pincode: '123456',
        district: 'Test District',
        rd_block: 'Test RD Block',
        school_phone: '9876543210',
        school_email: 'test4@school.com',
        habitation: 'Test Village',
        habitation_class: 'Rural',
        habitation_category: 'Village',
        block_office: 'DEO Aizawl'
      }

      const createResponse = await request(app)
        .post('/api/schools')
        .set('Authorization', `Bearer ${authToken}`)
        .send(schoolData)

      const schoolId = createResponse.body.data.id

      // Then delete the school
      const response = await request(app)
        .delete(`/api/schools/${schoolId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)

      expect(response.body.success).toBe(true)
      expect(response.body.message).toContain('deleted')
    })
  })
})
