import request from 'supertest'
import { createApp } from '../../src/app'
import { testPrisma } from '../setup/test-db'

const app = createApp()

describe('Medical Records API', () => {
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
      console.log('✅ Ensured admin user exists for Medical Records tests')
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

  describe('GET /api/medical-records', () => {
    it('should get all medical records', async () => {
      const response = await request(app)
        .get('/api/medical-records')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)

      expect(response.body.success).toBe(true)
      expect(Array.isArray(response.body.data)).toBe(true)
    })

    it('should require authentication', async () => {
      await request(app)
        .get('/api/medical-records')
        .expect(401)
    })
  })

  describe('POST /api/medical-records', () => {
    it('should create a new medical record', async () => {
      const medicalRecordData = {
        teacherId: 1,
        ailmentName: 'Test Ailment',
        severity: 'Moderate',
        diagnosisDate: '2024-01-15',
        treatmentStatus: 'Ongoing',
        remarks: 'Test remarks'
      }

      const response = await request(app)
        .post('/api/medical-records')
        .set('Authorization', `Bearer ${authToken}`)
        .send(medicalRecordData)
        .expect(201)

      expect(response.body.success).toBe(true)
      expect(response.body.data.ailment_name).toBe('Test Ailment')
    })

    it('should validate required fields', async () => {
      await request(app)
        .post('/api/medical-records')
        .set('Authorization', `Bearer ${authToken}`)
        .send({})
        .expect(400)
    })
  })

  describe('GET /api/medical-records/:teacherId', () => {
    it('should get medical records by teacher ID', async () => {
      const response = await request(app)
        .get('/api/medical-records/1')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)

      expect(response.body.success).toBe(true)
      expect(Array.isArray(response.body.data)).toBe(true)
    })
  })

  describe('PUT /api/medical-records/:id', () => {
    it('should update medical record', async () => {
      // First create a medical record
      const medicalRecordData = {
        teacherId: 1,
        ailmentName: 'Test Ailment Update',
        severity: 'Critical',
        diagnosisDate: '2024-01-15',
        treatmentStatus: 'Completed',
        remarks: 'Updated remarks'
      }

      const createResponse = await request(app)
        .post('/api/medical-records')
        .set('Authorization', `Bearer ${authToken}`)
        .send(medicalRecordData)

      expect(createResponse.status).toBe(201)
      expect(createResponse.body.success).toBe(true)
      expect(createResponse.body.data).toBeDefined()
      expect(createResponse.body.data.id).toBeDefined()

      const recordId = createResponse.body.data.id

      // Then update the record
      const updateData = {
        treatmentStatus: 'Completed',
        remarks: 'Treatment completed successfully'
      }

      const response = await request(app)
        .put(`/api/medical-records/${recordId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData)
        .expect(200)

      expect(response.body.success).toBe(true)
      expect(response.body.data.treatment_status).toBe('Completed')
    })
  })

  describe('DELETE /api/medical-records/:id', () => {
    it('should delete medical record', async () => {
      // First create a medical record
      const medicalRecordData = {
        teacherId: 1,
        ailmentName: 'Test Ailment Delete',
        severity: 'Mild',
        diagnosisDate: '2024-01-15',
        treatmentStatus: 'Ongoing',
        remarks: 'Test remarks for deletion'
      }

      const createResponse = await request(app)
        .post('/api/medical-records')
        .set('Authorization', `Bearer ${authToken}`)
        .send(medicalRecordData)

      expect(createResponse.status).toBe(201)
      expect(createResponse.body.success).toBe(true)
      expect(createResponse.body.data).toBeDefined()
      expect(createResponse.body.data.id).toBeDefined()

      const recordId = createResponse.body.data.id

      // Then delete the record
      const response = await request(app)
        .delete(`/api/medical-records/${recordId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)

      expect(response.body.success).toBe(true)
      expect(response.body.message).toContain('deleted')
    })
  })
})
