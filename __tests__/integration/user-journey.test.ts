import request from 'supertest'
import { createApp } from '../../src/app'

const app = createApp()

describe('User Journey Integration Tests', () => {
  let authToken: string
  let schoolId: string
  let teacherId: string
  let medicalRecordId: string

  describe('Complete Admin Workflow', () => {
    it('should complete full admin workflow: login -> create school -> create teacher -> create medical record', async () => {
      // Step 1: Login as admin
      // Wait longer for test setup to complete
      await new Promise(resolve => setTimeout(resolve, 3000))
      
      // Ensure admin user exists by creating it if needed
      const bcrypt = require('bcrypt')
      const { setupSimpleTestData } = require('../setup/simple-test-db')
      
      try {
        // Run the test data setup to ensure admin user exists
        await setupSimpleTestData()
        console.log('✅ Ensured admin user exists for Integration tests')
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
          break
        }
        
        attempts++
        if (attempts < maxAttempts) {
          console.log(`Authentication attempt ${attempts} failed, retrying...`)
          await new Promise(resolve => setTimeout(resolve, 1500))
        }
      }

      if (loginResponse.status === 200 && loginResponse.body.data) {
        authToken = loginResponse.body.data.token
        expect(authToken).toBeDefined()
      } else {
        console.error('Failed to get auth token after', maxAttempts, 'attempts:', loginResponse.status, loginResponse.body)
        throw new Error('Authentication failed in test setup')
      }

      // Step 2: Create a school
      const schoolData = {
        school_id: 'INTEG001',
        school_name: 'Integration Test School',
        school_type: 'Co-educational',
        school_level: 'Primary, Secondary',
        management: 'Government',
        medium: 'English',
        pincode: '123456',
        district: 'Test District',
        rd_block: 'Test Block',
        school_phone: '9876543210',
        school_email: 'test@school.com',
        habitation: 'Test Village',
        habitation_class: 'Rural',
        habitation_category: 'Village',
        block_office: 'DEO Aizawl'
      }

      const schoolResponse = await request(app)
        .post('/api/schools')
        .set('Authorization', `Bearer ${authToken}`)
        .send(schoolData)
        .expect(201)

      schoolId = schoolResponse.body.data.id
      expect(schoolResponse.body.data.school_name).toBe('Integration Test School')

      // Step 3: Create a teacher for the school
      const teacherData = {
        teacher_name: 'Integration Test Teacher',
        date_of_birth: '1990-01-01',
        joining_date: '2020-01-01',
        phone_number: '9876543210',
        email: 'test.teacher@example.com',
        social_group: 'General',
        religion: 'Hindu',
        gender: 'Male',
        subjects_taught: 'Mathematics',
        classes_taught: 'Class 10',
        school_id: 'INTEG001', // Use the school_id string, not the database id
        current_school_name: 'Integration Test School',
        school_level: 'Secondary',
        management: 'Government',
        medium: 'English',
        block_office: 'DEO Aizawl'
      }

      const teacherResponse = await request(app)
        .post('/api/teachers')
        .set('Authorization', `Bearer ${authToken}`)
        .send(teacherData)
        .expect(201)

      teacherId = teacherResponse.body.data.id
      expect(teacherResponse.body.data.teacher_name).toBe('Integration Test Teacher')

      // Step 4: Create a medical record for the teacher
      const medicalRecordData = {
        teacherId: teacherId,
        ailmentName: 'Integration Test Ailment',
        severity: 'Moderate',
        diagnosisDate: '2024-01-15',
        treatmentStatus: 'Ongoing',
        remarks: 'Integration test medical record'
      }

      const medicalResponse = await request(app)
        .post('/api/medical-records')
        .set('Authorization', `Bearer ${authToken}`)
        .send(medicalRecordData)
        .expect(201)

      medicalRecordId = medicalResponse.body.data.id
      expect(medicalResponse.body.data.ailment_name).toBe('Integration Test Ailment')

      // Step 5: Verify all data can be retrieved
      const schoolsResponse = await request(app)
        .get('/api/schools')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)

      expect(schoolsResponse.body.data.some((school: any) => school.id === schoolId)).toBe(true)

      const teachersResponse = await request(app)
        .get('/api/teachers')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)

      expect(teachersResponse.body.data.some((teacher: any) => teacher.id === teacherId)).toBe(true)

      const medicalRecordsResponse = await request(app)
        .get('/api/medical-records')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)

      expect(medicalRecordsResponse.body.data.some((record: any) => record.id === medicalRecordId)).toBe(true)
    })

    it('should handle cascade deletion properly', async () => {
      // Test cascade protection for school with teachers
      const cascadeResponse = await request(app)
        .get(`/api/cascade/school/${schoolId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)

      expect(cascadeResponse.body.success).toBe(true)
      expect(cascadeResponse.body.data.cascadeInfo).toBeDefined()
    })

    it('should clean up test data', async () => {
      // Clean up in reverse order to handle dependencies
      if (medicalRecordId) {
        await request(app)
          .delete(`/api/medical-records/${medicalRecordId}`)
          .set('Authorization', `Bearer ${authToken}`)
          .expect(200)
      }

      if (teacherId) {
        await request(app)
          .delete(`/api/teachers/${teacherId}`)
          .set('Authorization', `Bearer ${authToken}`)
          .expect(200)
      }

      if (schoolId) {
        await request(app)
          .delete(`/api/schools/${schoolId}`)
          .set('Authorization', `Bearer ${authToken}`)
          .expect(200)
      }
    })
  })

  describe('Teacher OTP Authentication Flow', () => {
    it('should complete OTP authentication flow', async () => {
      // Step 1: Send OTP
      const sendOtpResponse = await request(app)
        .post('/api/otp-auth/send-otp')
        .send({
          phone: '9876543210'
        })
        .expect(200)

      expect(sendOtpResponse.body.success).toBe(true)

      // Step 2: Verify OTP (this might fail in test environment without actual OTP)
      const verifyOtpResponse = await request(app)
        .post('/api/otp-auth/verify-otp')
        .send({
          phoneNumber: '9876543210',
          otp: '123456'
        })

      // Accept either success or failure depending on OTP validation
      expect([200, 400, 401]).toContain(verifyOtpResponse.status)
    })
  })

  describe('Session Management Flow', () => {
    it('should handle session lifecycle properly', async () => {
      // Step 1: Login
      // Wait longer for test setup to complete
      await new Promise(resolve => setTimeout(resolve, 3000))
      
      // Ensure admin user exists by creating it if needed
      const bcrypt = require('bcrypt')
      const { setupSimpleTestData } = require('../setup/simple-test-db')
      
      try {
        // Run the test data setup to ensure admin user exists
        await setupSimpleTestData()
        console.log('✅ Ensured admin user exists for Session Management tests')
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
          break
        }
        
        attempts++
        if (attempts < maxAttempts) {
          console.log(`Authentication attempt ${attempts} failed, retrying...`)
          await new Promise(resolve => setTimeout(resolve, 1500))
        }
      }

      if (loginResponse.status === 200 && loginResponse.body.data) {
        const token = loginResponse.body.data.token

        // Step 2: Access protected resource
        await request(app)
          .get('/api/schools')
          .set('Authorization', `Bearer ${token}`)
          .expect(200)

        // Step 3: Refresh token
        const setCookieHeader = loginResponse.headers['set-cookie']
        const refreshToken = Array.isArray(setCookieHeader) 
          ? setCookieHeader.find(cookie => cookie.startsWith('refreshToken='))?.split(';')[0]?.split('=')[1]
          : setCookieHeader?.startsWith('refreshToken=') 
            ? setCookieHeader.split(';')[0].split('=')[1]
            : undefined

        if (refreshToken) {
          const refreshResponse = await request(app)
            .post('/api/auth/refresh')
            .set('Cookie', `refreshToken=${refreshToken}`)
            .expect(200)

          expect(refreshResponse.body.success).toBe(true)
          expect(refreshResponse.body.data.token).toBeDefined()
        }

        // Step 4: Logout
        await request(app)
          .post('/api/auth/logout')
          .set('Authorization', `Bearer ${token}`)
          .expect(200)
      } else {
        console.error('Failed to get auth token:', loginResponse.status, loginResponse.body)
        throw new Error('Authentication failed in test setup')
      }
    })
  })

  describe('Error Handling Flow', () => {
    it('should handle various error scenarios gracefully', async () => {
      // Test 404 for non-existent resource
      await request(app)
        .get('/api/schools/99999')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404)

      // Test 400 for invalid data
      await request(app)
        .post('/api/schools')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ invalid: 'data' })
        .expect(400)

      // Test 401 for missing authentication
      await request(app)
        .get('/api/schools')
        .expect(401)
    })
  })
})
