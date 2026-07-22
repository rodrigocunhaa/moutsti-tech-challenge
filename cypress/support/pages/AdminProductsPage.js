class AdminProductsPage {
  selectors = {
    registerProductNavigation: '[data-testid="cadastrar-produtos"]',
    name: '[data-testid="nome"]',
    price: '[data-testid="preco"]',
    description: '[data-testid="descricao"]',
    quantity: '[data-testid="quantity"]',
    submit: '[data-testid="cadastarProdutos"]',
    productRows: 'tbody tr',
  };

  welcomeHeading(adminName) {
    return cy.contains('h1', `Bem Vindo ${adminName}`);
  }

  openRegistrationForm() {
    cy.get(this.selectors.registerProductNavigation).click();
  }

  createProduct(product) {
    cy.get(this.selectors.name).type(product.nome);
    cy.get(this.selectors.price).type(String(product.preco));
    cy.get(this.selectors.description).type(product.descricao);
    cy.get(this.selectors.quantity).type(String(product.quantidade));
    cy.get(this.selectors.submit).click();
  }

  productRow(productName) {
    return cy.contains(this.selectors.productRows, productName);
  }
}

module.exports = new AdminProductsPage();
