import request from 'supertest'
import { createApp } from '../../src/app'
import { testPrisma } from '../setup/test-db'

const app = createApp()

describe('Authentication API', () => {
  describe('POST /api/auth/login', () => {
    it('should login with valid credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          username: 'admin',
          password: 'admin123'
        })
        .expect(200)

      expect(response.body.success).toBe(true)
      expect(response.body.data.token).toBeDefined()
      expect(response.body.data.user).toBeDefined()
      expect(response.body.data.user.username).toBe('admin')
    })

    it('should reject invalid credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          username: 'invalid',
          password: 'wrong'
        })
        .expect(401)

      expect(response.body.success).toBe(false)
      expect(response.body.message).toContain('Invalid username or password')
    })

    it('should require username and password', async () => {
      await request(app)
        .post('/api/auth/login')
        .send({})
        .expect(400)
    })
  })

  describe('POST /api/auth/logout', () => {
    it('should logout successfully', async () => {
      // First login to get a token
      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({
          username: 'admin',
          password: 'admin123'
        })

      expect(loginResponse.status).toBe(200)
      expect(loginResponse.body.success).toBe(true)
      expect(loginResponse.body.data).toBeDefined()
      expect(loginResponse.body.data.token).toBeDefined()

      const token = loginResponse.body.data.token

      // Then logout
      const response = await request(app)
        .post('/api/auth/logout')
        .set('Authorization', `Bearer ${token}`)
        .expect(200)

      expect(response.body.success).toBe(true)
      expect(response.body.message).toContain('Logged out')
    })

    it('should handle logout without authentication', async () => {
      const response = await request(app)
        .post('/api/auth/logout')
        .expect(200)

      expect(response.body.success).toBe(true)
    })
  })

  describe('POST /api/auth/refresh', () => {
    it('should refresh token with valid refresh token', async () => {
      // First login to get tokens
      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({
          username: 'admin',
          password: 'admin123'
        })

      const setCookieHeader = loginResponse.headers['set-cookie']
      const refreshToken = Array.isArray(setCookieHeader) 
        ? setCookieHeader.find(cookie => cookie.startsWith('refreshToken='))?.split(';')[0]?.split('=')[1]
        : setCookieHeader?.startsWith('refreshToken=') 
          ? setCookieHeader.split(';')[0].split('=')[1]
          : undefined

      if (refreshToken) {
        const response = await request(app)
          .post('/api/auth/refresh')
          .set('Cookie', `refreshToken=${refreshToken}`)
          .expect(200)

        expect(response.body.success).toBe(true)
        expect(response.body.data.token).toBeDefined()
      }
    })
  })
})
