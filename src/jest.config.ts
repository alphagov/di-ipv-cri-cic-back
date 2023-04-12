const dotenv = require('dotenv');
dotenv.config();

export default {
  transform: {
    '^.+\\.ts?$': 'ts-jest'
  },
  testTimeout: 10000,
  clearMocks: true,
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageProvider: 'v8',
  coveragePathIgnorePatterns: ['config.ts', 'node_modules/'],
  testMatch: ['**/tests/**/*.test.ts'],
  setupFiles: [
    './jest.setup.ts'
  ],
  testEnvironment: 'node'
}
