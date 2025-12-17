describe('Flujo mínimo: Registro, Login y Carrito', () => {
  const randomSuffix = Math.floor(Math.random() * 100000);
  const email = `test${randomSuffix}@mail.com`;
  const password = 'Test1234';

  it('Registra, hace login y añade producto al carrito', () => {
    // 1. Registro
    cy.visit('/register');

    cy.get('[data-cy="register-name"]').type('Usuario Test');
    cy.get('[data-cy="register-email"]').type(email);
    cy.get('[data-cy="register-password"]').type(password);

    cy.get('[data-cy="register-submit"]').click();

    // Esperar redirección al login
    cy.url().should('include', '/login');

    // 2. Login
    cy.get('[data-cy="login-email"]').type(email);
    cy.get('[data-cy="login-password"]').type(password);

    cy.get('[data-cy="login-submit"]').click();

    // Esperar a que el login termine y guarde el token
    cy.window().its('localStorage').invoke('getItem', 'user_session').should('exist');
    cy.url().should('not.include', '/login');

    // 3. Añadir producto al carrito
    cy.visit('/products');

    // Esperar a que carguen productos y hacer click en añadir
    cy.get('[data-cy="add-to-cart"]', { timeout: 10000 }).first().click();

    // Pequeña pausa para que el backend procese
    cy.wait(1000);

    // 4. Verificar el carrito
    cy.visit('/cart');

    cy.get('[data-cy="cart-item"]', { timeout: 10000 }).should('have.length.at.least', 1);
    cy.get('[data-cy="cart-total"]').invoke('text').should((text) => {
      const clean = text.replace(/[^0-9.,]/g, '').replace(',', '.');
      const value = parseFloat(clean);
      expect(value).to.be.greaterThan(0);
    });
  });
});
