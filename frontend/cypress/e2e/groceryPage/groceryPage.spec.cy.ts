describe("Visit Grocery Page", () => {
  beforeEach(() => {
    cy.visit("/grocery-list", { failOnStatusCode: false });
  });

  it("Grocery Page Should Load Successfully", () => {
    cy.contains("Grocery List").should("be.visible");
  });

  it("should render the Find and allow clicking it", () => {
    cy.get('[data-testid="add-item-button"]').first().click();
    cy.contains("Add Item").should("be.visible");
  });

  it("should add item to a category", () => {
    cy.get('[data-testid="add-item-button"]').first().click();
    cy.contains("Add Item").should("be.visible");

    cy.get('[data-testid="itemName-input"]').type("Bread");
    cy.get('[data-testid="quantity-input"]').type("3{leftarrow}{backspace}");
    cy.get('[data-testid="submit-button"]').click();

    cy.contains("Bread").should("be.visible");
    cy.contains(3).should("be.visible");
  });
});
