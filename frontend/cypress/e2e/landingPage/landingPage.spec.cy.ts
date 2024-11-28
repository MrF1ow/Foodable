describe("Visit Landing Page", () => {
  it("Landing Page Should Load Successfully", () => {
    cy.visit("http://localhost:8000", { failOnStatusCode: false });
    cy.wait(2000);

    cy.contains("Foodable");
    cy.contains("Making Food More Doable.");

    cy.get('a[href="/sign-in"]').should("be.visible").click();
    cy.url().should("include", "/sign-in");

    cy.visit("http://localhost:8000", { failOnStatusCode: false });
    cy.wait(2000);

    cy.get('a[href="/sign-up"]').should("be.visible").click();
    cy.url().should("include", "/sign-up");
  });

  it("Should Display Logo on Large Screens", () => {
    cy.viewport(1280, 800);
    cy.visit("http://localhost:8000", { failOnStatusCode: false });
    cy.wait(2000);

    cy.get('img[alt="Logo"]').should("be.visible");
  });

  it("Should Hide Logo on Smaller Screens", () => {
    cy.visit("http://localhost:8000", { failOnStatusCode: false });
    cy.wait(2000);

    cy.viewport(768, 800);
    cy.reload();

    cy.get('img[alt="Logo"]').should("not.exist");
  });
});
