class LoginPage {
  selectors = {
    email: '[data-testid="email"]',
    password: '[data-testid="senha"]',
    submit: '[data-testid="entrar"]',
    errorMessage: '[role="alert"]',
    logout: '[data-testid="logout"]',
  };

  visit() {
    cy.visit('/login');
  }

  login(email, password) {
    cy.get(this.selectors.email).type(email);
    cy.get(this.selectors.password).type(password, { log: false });
    cy.get(this.selectors.submit).click();
  }

  errorMessage() {
    return cy.get(this.selectors.errorMessage);
  }

  logoutButton() {
    return cy.get(this.selectors.logout);
  }
}

module.exports = new LoginPage();
