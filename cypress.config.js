const { defineConfig } = require('cypress');

const DEFAULT_FRONTEND_URL = 'https://front.serverest.dev';
const DEFAULT_API_URL = 'https://serverest.dev';

const normalizeUrl = (url) => url.replace(/\/$/, '');
const apiUrl = normalizeUrl(process.env.CYPRESS_API_URL || DEFAULT_API_URL);

module.exports = defineConfig({
  allowCypressEnv: false,
  expose: {
    apiUrl,
  },
  e2e: {
    baseUrl: normalizeUrl(process.env.CYPRESS_BASE_URL || DEFAULT_FRONTEND_URL),
    specPattern: 'cypress/e2e/**/*.cy.js',
    supportFile: 'cypress/support/e2e.js',
    testIsolation: true,
    retries: {
      runMode: 1,
      openMode: 0,
    },
    setupNodeEvents(on) {
      require('cypress-mochawesome-reporter/plugin')(on);
    },
  },
  reporter: 'cypress-mochawesome-reporter',
  reporterOptions: {
    reportDir: 'cypress/reports',
    charts: true,
    reportPageTitle: 'ServeRest Test Report',
    embeddedScreenshots: true,
    inlineAssets: true,
    saveJson: true,
  },
  screenshotOnRunFailure: true,
  video: true,
  defaultCommandTimeout: 10000,
});
