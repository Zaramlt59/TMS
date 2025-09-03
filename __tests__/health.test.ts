import request from 'supertest'
import { createApp } from '../src/app'

describe('Health', () => {
  it('returns OK', async () => {
    const app = createApp()
    const res = await request(app).get('/health')
    expect(res.status).toBe(200)
    expect(res.body?.status).toBe('OK')
  })
})


