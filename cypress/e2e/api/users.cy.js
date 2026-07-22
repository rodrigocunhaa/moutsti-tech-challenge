const serverestApi = require('../../support/api/serverestApi');
const { buildStandardUser } = require('../../support/factories/userFactory');

const USER_CREATED_MESSAGE = 'Cadastro realizado com sucesso';
const DUPLICATED_EMAIL_MESSAGE = 'Este email já está sendo usado';

describe('Users API', () => {
  let cleanupState;

  beforeEach(() => {
    cleanupState = { products: [], users: [] };
  });

  afterEach(() => {
    cy.cleanupResources(cleanupState);
  });

  it('API-01 - creates and retrieves a user successfully', () => {
    const user = buildStandardUser();
    let userId;

    serverestApi
      .createUser(user)
      .then(({ status, body }) => {
        if (body._id) cleanupState.users.push(body._id);
        expect(status).to.equal(201);
        expect(body.message).to.equal(USER_CREATED_MESSAGE);
        expect(body._id)
          .to.be.a('string')
          .and.match(/^[a-zA-Z0-9]{16}$/);
        userId = body._id;
        return serverestApi.getUser(userId);
      })
      .then(({ status, body }) => {
        expect(status).to.equal(200);
        expect(body).to.deep.equal({ ...user, _id: userId });
      });
  });

  it('API-02 - rejects duplicate email registration', () => {
    const originalUser = buildStandardUser();
    const duplicatedUser = {
      ...buildStandardUser(),
      nome: 'Duplicate User',
      email: originalUser.email,
    };
    let originalUserId;

    serverestApi
      .createUser(originalUser)
      .then(({ status, body }) => {
        if (body._id) cleanupState.users.push(body._id);
        expect(status).to.equal(201);
        expect(body.message).to.equal(USER_CREATED_MESSAGE);
        originalUserId = body._id;
        return serverestApi.createUser(duplicatedUser, false);
      })
      .then(({ status, body }) => {
        expect(status).to.equal(400);
        expect(body).to.deep.equal({ message: DUPLICATED_EMAIL_MESSAGE });
        expect(body).not.to.have.property('_id');
        return serverestApi.getUsersByEmail(originalUser.email);
      })
      .then(({ status, body }) => {
        expect(status).to.equal(200);
        expect(body.usuarios).to.be.an('array');

        const matchingUsers = body.usuarios.filter(({ email }) => email === originalUser.email);
        expect(matchingUsers).to.have.length(1);
        expect(matchingUsers[0]).to.deep.equal({ ...originalUser, _id: originalUserId });
      });
  });
});
