import { defineConfig } from 'cypress';

export default defineConfig({
  env: {
    apiBaseUrl: 'http://localhost:3000',
  },
  e2e: {
    baseUrl: 'http://localhost:5173',
    supportFile: 'cypress/support/e2e.ts',
    specPattern: 'cypress/e2e/**/*.cy.ts',
    video: false,
    retries: { runMode: 1, openMode: 0 }, // CI에서만 1회 재시도
  },
});
