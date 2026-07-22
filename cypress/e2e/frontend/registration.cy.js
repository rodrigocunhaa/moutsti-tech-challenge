const { buildStandardUser } = require('../../support/factories/userFactory');

describe('User registration', () => {
  let cleanupState;

  beforeEach(() => {
    cleanupState = { products: [], users: [] };
  });

  afterEach(() => {
    cy.cleanupResources(cleanupState);
  });

  it('E2E-01 - registers a standard user successfully', () => {
    const user = buildStandardUser();

    cy.intercept('POST', `${Cypress.expose('apiUrl')}/usuarios`, (request) => {
      request.continue((response) => {
        if (response.body?._id) cleanupState.users.push(response.body._id);
      });
    }).as('registerUser');

    cy.visit('/cadastrarusuarios');
    cy.get('[data-testid="nome"]').type(user.nome);
    cy.get('[data-testid="email"]').type(user.email);
    cy.get('[data-testid="password"]').type(user.password, { log: false });
    cy.get('[data-testid="checkbox"]').should('not.be.checked');
    cy.get('[data-testid="cadastrar"]').click();

    cy.wait('@registerUser').then(({ request, response }) => {
      expect(request.body).to.deep.equal(user);
      expect(response.statusCode).to.equal(201);
      expect(response.body.message).to.equal('Cadastro realizado com sucesso');
      expect(response.body._id).to.match(/^[a-zA-Z0-9]{16}$/);
    });

    cy.location('pathname').should('equal', '/home');
    cy.get('[data-testid="home"]').should('be.visible').and('contain.text', 'Home');
    cy.get('[data-testid="logout"]').should('be.visible').and('have.text', 'Logout');
    cy.get('[data-testid="listaProdutos"]').should('exist');
    cy.contains('h4', 'Produtos').should('be.visible');
  });
});
