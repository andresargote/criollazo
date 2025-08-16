import { config } from 'dotenv';
import { resolve } from 'path';
import { afterAll, beforeAll } from 'vitest';

// Load environment variables for testing
config({ path: resolve(__dirname, '../.env.test') });

// Global test setup
beforeAll(async () => {
  // Setup test database connection if needed
});

afterAll(async () => {
  // Cleanup test database connection if needed
});

// Global test utilities
global.console = {
  ...console,
  // Uncomment to suppress console.log during tests
  // log: jest.fn(),
  // debug: jest.fn(),
  // info: jest.fn(),
  // warn: jest.fn(),
  // error: jest.fn(),
};
