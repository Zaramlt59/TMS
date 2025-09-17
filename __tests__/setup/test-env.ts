import dotenv from 'dotenv'
import path from 'path'

// Load test environment variables
export function setupTestEnvironment() {
  // Set test environment
  process.env.NODE_ENV = 'test'
  process.env.PORT = '5005'
  
  // Test database configuration
  process.env.DB_HOST = process.env.DB_HOST || 'localhost'
  process.env.DB_USER = process.env.DB_USER || 'root'
  process.env.DB_PASSWORD = process.env.DB_PASSWORD || ''
  process.env.DB_NAME = process.env.DB_NAME || 'tms_test'
  process.env.DB_PORT = process.env.DB_PORT || '3306'
  
  // Construct DATABASE_URL for Prisma
  const dbUrl = `mysql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`
  process.env.DATABASE_URL = dbUrl
  
  // JWT configuration
  process.env.JWT_SECRET = process.env.JWT_SECRET || 'test-jwt-secret-key'
  process.env.JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'test-jwt-refresh-secret-key'
  
  // CORS configuration
  process.env.CORS_ORIGIN = 'http://localhost:3000'
  
  // Disable logging in tests
  process.env.LOG_LEVEL = 'error'
  
  // Disable Sentry in tests
  process.env.SENTRY_DSN = ''
  
  console.log('✅ Test environment configured')
  console.log(`📊 Database: ${process.env.DB_NAME}`)
  console.log(`🌐 Port: ${process.env.PORT}`)
}
