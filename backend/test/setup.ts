// Test setup file for Vitest
import { beforeAll } from 'vitest'

// Set up test environment variables
beforeAll(() => {
  // Set required environment variables for tests
  process.env.JWT_SECRET = 'test-jwt-secret-key-for-testing-only'
  process.env.NODE_ENV = 'test'
  
  // Database configuration for tests
  process.env.DB_HOST = 'localhost'
  process.env.DB_PORT = '5432'
  process.env.DB_USER = 'postgres'
  process.env.DB_PASSWORD = 'postgres'
  process.env.DB_NAME = 'auto_order_test'
})

