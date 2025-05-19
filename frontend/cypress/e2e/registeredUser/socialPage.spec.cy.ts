describe("Registered User Social Page", () => {
    it("Social Page Should Load Successfully", () => {
        cy.visit("/social", { failOnStatusCode: false });
        cy.wait(5000);
        cy.contains('Following').click();
    });

    it("Social page base information", () => {
        cy.visit("/social", { failOnStatusCode: false });
        cy.wait(500);
        cy.contains('Followers');
        cy.contains('No Followers');
        cy.contains('Following');
        cy.contains('Not Following anyone');
        cy.contains('Recipes');
        cy.contains('No Saved Recipes');
        cy.contains('Lists');
    }); 
})
