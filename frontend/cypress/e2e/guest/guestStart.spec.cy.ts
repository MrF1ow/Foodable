describe("Continue As Guest Option", () => {
    it("User should be able to continue as Guest", () => {
        cy.visit("/", { failOnStatusCode: false });
        
        cy.clickButton("guest-choice")

        cy.url().should("include", "/recipe");
    })
})