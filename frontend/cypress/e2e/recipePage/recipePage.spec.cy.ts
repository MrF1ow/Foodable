describe("Visit Recipe Page", () => {
  it("Recipe Page Should Load Successfully", () => {
    cy.visit("/recipe", { failOnStatusCode: false });
    cy.wait(2000);

    cy.contains("Your List");
  });
});
