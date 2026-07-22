const serverestApi = require('../../support/api/serverestApi');
const { buildAdminUser } = require('../../support/factories/userFactory');
const { buildProduct } = require('../../support/factories/productFactory');

const ACCESS_TOKEN_ERROR =
  'Token de acesso ausente, inválido, expirado ou usuário do token não existe mais';

describe('Product authorization API', () => {
  let cleanupState;

  beforeEach(() => {
    cleanupState = { products: [], users: [] };
  });

  afterEach(() => {
    cy.cleanupResources(cleanupState);
  });

  it('API-03 - requires an authenticated admin to create a product', () => {
    const product = buildProduct();
    const adminUser = buildAdminUser();
    let token;
    let productId;

    serverestApi.createProduct(product, undefined, false).then(({ status, body }) => {
      expect(status).to.equal(401);
      expect(body).to.deep.equal({ message: ACCESS_TOKEN_ERROR });
      expect(body).not.to.have.property('_id');
    });

    serverestApi.createUser(adminUser).then(({ status, body }) => {
      if (body._id) cleanupState.users.push(body._id);
      expect(status).to.equal(201);
      expect(body.message).to.equal('Cadastro realizado com sucesso');
      expect(body._id).to.match(/^[a-zA-Z0-9]{16}$/);
    });

    serverestApi
      .login(adminUser)
      .then(({ status, body }) => {
        expect(status).to.equal(200);
        expect(body.message).to.equal('Login realizado com sucesso');
        expect(body.authorization)
          .to.be.a('string')
          .and.match(/^Bearer\s.+/);
        token = body.authorization;
        return serverestApi.createProduct(product, token);
      })
      .then(({ status, body }) => {
        if (body._id) cleanupState.products.push({ id: body._id, token });
        expect(status).to.equal(201);
        expect(body.message).to.equal('Cadastro realizado com sucesso');
        expect(body._id)
          .to.be.a('string')
          .and.match(/^[a-zA-Z0-9]{16}$/);
        productId = body._id;
        return serverestApi.getProduct(productId);
      })
      .then(({ status, body }) => {
        expect(status).to.equal(200);
        expect(body).to.deep.equal({ ...product, _id: productId });
      });
  });
});
