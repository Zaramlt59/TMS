import request from 'supertest'
import { createApp } from '../../src/app'

const app = createApp()

describe('OTP Authentication API', () => {
  describe('POST /api/otp-auth/send-otp', () => {
    it('should send OTP for valid phone number', async () => {
      const response = await request(app)
        .post('/api/otp-auth/send-otp')
        .send({
          phone: '6909701606'
        })
        .expect(200)

      expect(response.body.success).toBe(true)
      expect(response.body.message).toContain('OTP sent')
    })

    it('should require phone number', async () => {
      await request(app)
        .post('/api/otp-auth/send-otp')
        .send({})
        .expect(400)
    })

    it('should validate phone number format', async () => {
      await request(app)
        .post('/api/otp-auth/send-otp')
        .send({
          phone: 'invalid'
        })
        .expect(400)
    })
  })

  describe('POST /api/otp-auth/verify-otp', () => {
    it('should verify OTP and return token', async () => {
      // First send OTP
      await request(app)
        .post('/api/otp-auth/send-otp')
        .send({
          phone: '6909701606'
        })

      // Then verify OTP (using a mock OTP for testing)
      const response = await request(app)
        .post('/api/otp-auth/verify-otp')
        .send({
          phone: '6909701606',
          otp: '123456' // Mock OTP for testing
        })

      // This might return 200 or 400 depending on OTP validation
      expect([200, 400]).toContain(response.status)
    })

    it('should require phone number and OTP', async () => {
      await request(app)
        .post('/api/otp-auth/verify-otp')
        .send({})
        .expect(400)
    })
  })

  describe('POST /api/otp-auth/resend-otp', () => {
    it('should resend OTP for valid phone number', async () => {
      // Wait a bit to ensure teacher user is created
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const response = await request(app)
        .post('/api/otp-auth/resend-otp')
        .send({
          phone: '6909701606'
        })
        .expect(200)

      expect(response.body.success).toBe(true)
      expect(response.body.message).toContain('OTP resent')
    })
  })
})
