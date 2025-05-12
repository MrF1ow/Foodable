describe("Restricted Pages Should ONLY show Auth Options", () => {
    it("Saved Page Should Only Show Auth Options", () => {
        cy.visit("/saved", { failOnStatusCode: false });
        
        cy.get('[data-testid="auth-options"]').should('be.visible');
    })

    it("Social Page Should Only Show Auth Options", () => {
        cy.visit("/social", { failOnStatusCode: false });
        
        cy.get('[data-testid="auth-options"]').should('be.visible');
    })

    it("Settings Page Should Only Show Auth Options", () => {
        cy.visit("/settings", { failOnStatusCode: false });
        
        cy.get('[data-testid="auth-options"]').should('be.visible');
    })
})