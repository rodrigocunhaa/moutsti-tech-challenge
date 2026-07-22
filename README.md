# ServeRest Cypress Test Automation

This project contains a small Cypress test suite for the public [ServeRest](https://serverest.dev/) application. It covers three frontend scenarios and three API scenarios with independent test data and cleanup.

## Technologies

- JavaScript
- Cypress
- GitHub Actions

## Test Scenarios

### Frontend

- **E2E-01:** Register a standard user successfully.
- **E2E-02:** Log in as an admin and create a product successfully.
- **E2E-03:** Reject login when the password is incorrect.

### API

- **API-01:** Create a user and retrieve it by ID.
- **API-02:** Reject a second user with the same email.
- **API-03:** Reject product creation without a token, then create and retrieve it with an admin token.

Every test creates unique data and removes the users and products it creates. The suite does not depend on existing records or execution order.

## Project Structure

```text
.github/workflows/ci.yml
cypress/
├── e2e/
│   ├── api/
│   │   ├── product-authorization.cy.js
│   │   └── users.cy.js
│   └── frontend/
│       ├── admin-product.cy.js
│       ├── login-negative.cy.js
│       └── registration.cy.js
└── support/
    ├── api/serverestApi.js
    ├── factories/
    │   ├── productFactory.js
    │   └── userFactory.js
    ├── pages/
    │   ├── AdminProductsPage.js
    │   └── LoginPage.js
    ├── commands.js
    └── e2e.js
```

## Prerequisites

- Node.js 24 (the exact version is defined in `.nvmrc`)
- npm
- Network access to `https://front.serverest.dev` and `https://serverest.dev`

## Installation

```bash
nvm use
npm ci
```

The default frontend and API URLs are defined in `cypress.config.js`. They can be overridden when needed:

```bash
CYPRESS_BASE_URL=https://front.serverest.dev \
CYPRESS_API_URL=https://serverest.dev \
npm run test:all
```

## Running the Tests

```bash
npm run cy:open
npm run test:e2e
npm run test:api
npm run test:all
npm run lint
npm run format:check
npm run verify
```

- `cy:open` opens Cypress in interactive mode.
- `test:e2e` runs the three frontend scenarios.
- `test:api` runs the three API scenarios.
- `test:all` runs all six scenarios.
- `lint` and `format:check` run the static checks.
- `verify` runs the complete local validation: lint, formatting, and all six tests.

Headless runs generate an HTML report at `cypress/reports/index.html`. Reports, screenshots, and videos are ignored by Git.

## GitHub Actions

The workflow in `.github/workflows/ci.yml` runs on pushes to `main` and on pull requests. It installs dependencies with `npm ci`, runs the static checks, executes all six tests, uploads the HTML report, and uploads screenshots and videos when a test fails.
