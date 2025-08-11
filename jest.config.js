module.exports = {
  // Test environment
  testEnvironment: 'node',
  
  // Test file patterns
  testMatch: [
    '**/tests/**/*.test.js',
    '**/tests/**/*.integration.test.js',
    '**/tests/**/*.e2e.test.js'
  ],
  
  // Setup files
  setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],
  
  // Coverage configuration
  collectCoverage: true,
  coverageDirectory: 'coverage',
  collectCoverageFrom: [
    'ai-agents/**/*.js',
    'backend/src/**/*.js',
    '!**/node_modules/**',
    '!**/tests/**',
    '!**/coverage/**',
    '!**/dist/**'
  ],
  
  // Coverage thresholds (based on testing best practices)
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  },
  
  // Test timeout (30 seconds for integration tests)
  testTimeout: 30000,
  
  // Verbose output for debugging
  verbose: process.env.JEST_VERBOSE === 'true',
  
  // Silent mode for cleaner output
  silent: process.env.JEST_SILENT !== 'false',
  
  // Module paths and aliases
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
    '^@tests/(.*)$': '<rootDir>/tests/$1',
    '^@fixtures/(.*)$': '<rootDir>/tests/fixtures/$1'
  },
  
  // Transform configuration  
  transform: {},
  
  // Files to ignore
  testPathIgnorePatterns: [
    '/node_modules/',
    '/dist/',
    '/coverage/'
  ],
  
  // Mock configuration
  clearMocks: true,
  restoreMocks: true,
  
  // Reporter configuration
  reporters: ['default'],
  
  // Error handling
  errorOnDeprecated: true,
  
  // Test execution
  maxWorkers: '50%',
  
  // Global variables available in tests
  globals: {
    TEST_TIMEOUT: 30000,
    PYTHON_AVAILABLE: process.env.PYTHON_AVAILABLE || 'false'
  }
};