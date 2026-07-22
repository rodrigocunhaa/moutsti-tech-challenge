Cypress.Commands.add('cleanupResources', ({ products, users }) => {
  products.forEach(({ id, token }) => {
    cy.request({
      method: 'DELETE',
      url: `${Cypress.expose('apiUrl')}/produtos/${id}`,
      headers: { Authorization: token },
      failOnStatusCode: false,
      log: false,
    });
  });

  users.forEach((userId) => {
    cy.request({
      method: 'DELETE',
      url: `${Cypress.expose('apiUrl')}/usuarios/${userId}`,
      failOnStatusCode: false,
      log: false,
    });
  });
});
