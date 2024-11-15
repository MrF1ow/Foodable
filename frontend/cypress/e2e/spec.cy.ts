describe("Visit Homepage", () => {
  it("should load the homepage successfully", () => {
    cy.visit("http://localhost:8000");
    cy.contains("Hello World");
  });
});
