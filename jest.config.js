const nextJest = require('next/jest');

// Create Jest config with Next.js settings
const createJestConfig = nextJest({
  // Path to Next.js app
  dir: './',
});

/** @type {import('jest').Config} */
const customJestConfig = {
  // Setup file to run before tests
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],

  // Test environment
  testEnvironment: 'jest-environment-jsdom',

  // Where to find tests
  testMatch: [
    '<rootDir>/src/**/*.test.ts',
    '<rootDir>/src/**/*.test.tsx',
    '<rootDir>/tests/**/*.test.ts',
    '<rootDir>/tests/**/*.test.tsx',
  ],

  // Path aliases (same as tsconfig)
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@/components/(.*)$': '<rootDir>/src/components/$1',
    '^@/lib/(.*)$': '<rootDir>/src/lib/$1',
    '^@/types/(.*)$': '<rootDir>/src/types/$1',
  },

  // Files to collect coverage from
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',           // Exclude type definitions
    '!src/**/*.stories.{ts,tsx}', // Exclude Storybook
    '!src/types/**/*',           // Exclude type files
    '!src/**/index.ts',          // Exclude barrel files
  ],

  // ========================================
  // COVERAGE THRESHOLDS (70% minimum)
  // ========================================
  coverageThreshold: {
    global: {
      branches: 70,    // 70% of if/else branches covered
      functions: 70,   // 70% of functions covered
      lines: 70,       // 70% of lines covered
      statements: 70,  // 70% of statements covered
    },
  },

  // Coverage report formats
  coverageReporters: [
    'text',           // Console output
    'text-summary',   // Summary in console
    'lcov',           // For CI tools
    'html',           // HTML report in coverage/ folder
  ],

  // Coverage output directory
  coverageDirectory: 'coverage',

  // Show verbose output
  verbose: true,

  // Stop on first failure in CI
  bail: process.env.CI ? true : false,

  // Max workers for parallel tests
  maxWorkers: '50%',
};

module.exports = createJestConfig(customJestConfig);