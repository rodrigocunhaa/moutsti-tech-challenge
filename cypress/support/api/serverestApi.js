class ServerestApi {
  createUser(user, failOnStatusCode = true) {
    return cy.request({
      method: 'POST',
      url: `${Cypress.expose('apiUrl')}/usuarios`,
      body: user,
      failOnStatusCode,
    });
  }

  getUser(userId) {
    return cy.request(`${Cypress.expose('apiUrl')}/usuarios/${userId}`);
  }

  getUsersByEmail(email) {
    return cy.request(`${Cypress.expose('apiUrl')}/usuarios?email=${encodeURIComponent(email)}`);
  }

  login({ email, password }) {
    return cy.request({
      method: 'POST',
      url: `${Cypress.expose('apiUrl')}/login`,
      body: { email, password },
      log: false,
    });
  }

  createProduct(product, token, failOnStatusCode = true) {
    return cy.request({
      method: 'POST',
      url: `${Cypress.expose('apiUrl')}/produtos`,
      body: product,
      headers: token ? { Authorization: token } : undefined,
      failOnStatusCode,
      log: !token,
    });
  }

  getProduct(productId) {
    return cy.request(`${Cypress.expose('apiUrl')}/produtos/${productId}`);
  }
}

module.exports = new ServerestApi();
