import { defineConfig } from 'cypress';
import { addMatchImageSnapshotPlugin } from 'cypress-image-snapshot/plugin';

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
    setupNodeEvents(on, config) {
      process.env.TEST_ENV = 'e2e';
      addMatchImageSnapshotPlugin(on, config);
      return config;
    },
  },
});
