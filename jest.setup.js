// Jest setup file
const { execSync } = require('child_process')

// Import test setup
const { setupTestEnvironment } = require('./__tests__/setup/test-env')
const { setupSimpleTestData, cleanupTestData, closeTestDb } = require('./__tests__/setup/simple-test-db')

// Setup test environment
setupTestEnvironment()

// Global test timeout
jest.setTimeout(30000)

// Global test data
let testData = null

// Setup before all tests
beforeAll(async () => {
  try {
    console.log('🧪 Setting up test environment...')
    
    // Wait a bit to ensure any previous test cleanup is complete
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    testData = await setupSimpleTestData()
    
    // Wait a bit more to ensure setup is complete
    await new Promise(resolve => setTimeout(resolve, 500))
    
    console.log('✅ Test environment ready')
  } catch (error) {
    console.error('❌ Test setup failed:', error)
    throw error
  }
})

// Cleanup after all tests
afterAll(async () => {
  try {
    console.log('🧹 Cleaning up test environment...')
    await cleanupTestData()
    await closeTestDb()
    console.log('✅ Test cleanup completed')
  } catch (error) {
    console.error('❌ Test cleanup failed:', error)
  }
})

// Make test data available globally
global.testData = () => testData