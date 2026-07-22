const loginPage = require('../../support/pages/LoginPage');
const adminProductsPage = require('../../support/pages/AdminProductsPage');
const serverestApi = require('../../support/api/serverestApi');
const { buildAdminUser } = require('../../support/factories/userFactory');
const { buildProduct } = require('../../support/factories/productFactory');

describe('Admin product management', () => {
  let cleanupState;

  beforeEach(() => {
    cleanupState = { products: [], users: [] };
  });

  afterEach(() => {
    cy.cleanupResources(cleanupState);
  });

  it('E2E-02 - admin creates a product successfully', () => {
    const adminUser = buildAdminUser();
    const product = buildProduct();
    let token;

    serverestApi.createUser(adminUser).then(({ status, body }) => {
      if (body._id) cleanupState.users.push(body._id);
      expect(status).to.equal(201);
      expect(body.message).to.equal('Cadastro realizado com sucesso');
    });

    cy.intercept('POST', `${Cypress.expose('apiUrl')}/login`).as('login');
    cy.intercept('POST', `${Cypress.expose('apiUrl')}/produtos`, (request) => {
      request.continue((response) => {
        if (response.body?._id) {
          cleanupState.products.push({ id: response.body._id, token });
        }
      });
    }).as('createProduct');

    loginPage.visit();
    loginPage.login(adminUser.email, adminUser.password);

    cy.wait('@login')
      .its('response')
      .then((response) => {
        expect(response.statusCode).to.equal(200);
        expect(response.body.message).to.equal('Login realizado com sucesso');
        expect(response.body.authorization).to.match(/^Bearer\s.+/);
        token = response.body.authorization;
      });
    cy.location('pathname').should('equal', '/admin/home');
    adminProductsPage.welcomeHeading(adminUser.nome).should('be.visible');

    adminProductsPage.openRegistrationForm();
    cy.location('pathname').should('equal', '/admin/cadastrarprodutos');
    cy.contains('h1', 'Cadastro de Produtos').should('be.visible');
    adminProductsPage.createProduct(product);

    cy.wait('@createProduct').then(({ request, response }) => {
      expect(request.body).to.deep.equal({
        ...product,
        preco: String(product.preco),
        quantidade: String(product.quantidade),
      });
      expect(response.statusCode).to.equal(201);
      expect(response.body.message).to.equal('Cadastro realizado com sucesso');
      expect(response.body._id).to.match(/^[a-zA-Z0-9]{16}$/);
    });

    cy.location('pathname').should('equal', '/admin/listarprodutos');
    cy.contains('h1', 'Lista dos Produtos').should('be.visible');
    adminProductsPage.productRow(product.nome).within(() => {
      cy.get('td').eq(0).should('have.text', product.nome);
      cy.get('td').eq(1).should('have.text', String(product.preco));
      cy.get('td').eq(2).should('have.text', product.descricao);
      cy.get('td').eq(3).should('have.text', String(product.quantidade));
    });
  });
});
