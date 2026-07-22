const eslint = require('@eslint/js');
const cypress = require('eslint-plugin-cypress');
const globals = require('globals');

module.exports = [
  {
    ignores: [
      'node_modules/**',
      'cypress/reports/**',
      'cypress/screenshots/**',
      'cypress/videos/**',
    ],
  },
  eslint.configs.recommended,
  {
    files: ['cypress/**/*.js', 'cypress.config.js', 'eslint.config.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'commonjs',
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.mocha,
        cy: 'readonly',
        Cypress: 'readonly',
        expect: 'readonly',
      },
    },
    plugins: {
      cypress,
    },
    rules: {
      'cypress/no-assigning-return-values': 'error',
      'cypress/no-force': 'error',
      'cypress/no-unnecessary-waiting': 'error',
      'cypress/unsafe-to-chain-command': 'error',
    },
  },
];
