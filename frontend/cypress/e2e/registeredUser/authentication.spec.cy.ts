import { setupClerkTestingToken } from '@clerk/testing/cypress';

describe('User Sign In', () => {
    beforeEach(() => {
        setupClerkTestingToken();
    });

    it('User Should Be Able To Sign In', () => {
        cy.visit(`/sign-in`)
        cy.clerkSignIn({
            strategy: 'password',
            identifier: Cypress.env('USER_SIGN_IN_EMAIL'),
            password: Cypress.env('USER_SIGN_IN_PASSWORD')
        });
        cy.visit('/grocery-list')
        cy.get('[data-testid="list-edit"]').should('be.visible');

        cy.visit('/recipe')
        cy.get('[data-testid="create-recipe"]').should('be.visible');

    });

});