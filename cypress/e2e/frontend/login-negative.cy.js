const loginPage = require('../../support/pages/LoginPage');
const serverestApi = require('../../support/api/serverestApi');
const { buildStandardUser } = require('../../support/factories/userFactory');

const INVALID_CREDENTIALS_MESSAGE = 'Email e/ou senha inválidos';

describe('Login validation', () => {
  let cleanupState;

  beforeEach(() => {
    cleanupState = { products: [], users: [] };
  });

  afterEach(() => {
    cy.cleanupResources(cleanupState);
  });

  it('E2E-03 - rejects login with an incorrect password', () => {
    const user = buildStandardUser();
    const incorrectPassword = `${user.password}-incorrect`;

    serverestApi.createUser(user).then(({ status, body }) => {
      if (body._id) cleanupState.users.push(body._id);
      expect(status).to.equal(201);
      expect(body.message).to.equal('Cadastro realizado com sucesso');
    });

    cy.intercept('POST', `${Cypress.expose('apiUrl')}/login`).as('rejectedLogin');

    loginPage.visit();
    loginPage.login(user.email, incorrectPassword);

    cy.wait('@rejectedLogin')
      .its('response')
      .then((response) => {
        expect(response.statusCode).to.equal(401);
        expect(response.body).to.deep.equal({ message: INVALID_CREDENTIALS_MESSAGE });
      });

    loginPage
      .errorMessage()
      .should('be.visible')
      .invoke('text')
      .then((text) => expect(text.replace('×', '').trim()).to.equal(INVALID_CREDENTIALS_MESSAGE));
    cy.location('pathname').should('equal', '/login');
    loginPage.logoutButton().should('not.exist');
    cy.location('pathname').should('not.match', /^\/(admin\/)?home$/);
  });
});
