describe("Registered User Recipe Page Integration Tests", () => {
  beforeEach(() => {
    cy.session("registered-user-session", () => {
      cy.visit("/sign-in");
      cy.clerkSignIn({
        strategy: "password",
        identifier: Cypress.env("USER_SIGN_IN_EMAIL"),
        password: Cypress.env("USER_SIGN_IN_PASSWORD"),
      });
    });
  });
  it("Recipe Page Should Load Successfully", () => {
    cy.visit("/recipe", { failOnStatusCode: false });
    cy.wait(500);
    cy.get('[data-testid="grocery-header-dropdown"]').should("be.visible");
  });

  it("Recipe Filter button info", () => {
    cy.visit("/recipe", { failOnStatusCode: false });
    cy.wait(500);
    cy.contains("button", "Filter").click();
    cy.shouldBeVisible("Sort Recipes By");
    cy.shouldBeVisible("Price");
    cy.shouldBeVisible("Time");
    cy.shouldBeVisible("Ingredients");
  });

  it("Groceries to create recipe info: Bakery", () => {
    cy.visit("/recipe", { failOnStatusCode: false });
    cy.wait(500);
    const categoryName = "Bakery";
    cy.clickAddItemButton(categoryName);
    cy.shouldBeVisible("Add Item");
    cy.shouldBeVisible("Item Name");
    cy.shouldBeVisible("Quantity");
    cy.shouldBeVisible("Select Unit");
    cy.shouldBeVisible("Select Category");
  });

  it("Groceries to create recipe info: Meat", () => {
    cy.visit("/recipe", { failOnStatusCode: false });
    cy.wait(500);
    const categoryName = "Meat";
    cy.clickAddItemButton(categoryName);
    cy.shouldBeVisible("Add Item");
    cy.shouldBeVisible("Item Name");
    cy.shouldBeVisible("Quantity");
    cy.shouldBeVisible("Select Unit");
    cy.shouldBeVisible("Select Category");
  });

  it("Groceries to create recipe info: Dairy", () => {
    cy.visit("/recipe", { failOnStatusCode: false });
    cy.wait(500);
    const categoryName = "Dairy";
    cy.clickAddItemButton(categoryName);
    cy.shouldBeVisible("Add Item");
    cy.shouldBeVisible("Item Name");
    cy.shouldBeVisible("Quantity");
    cy.shouldBeVisible("Select Unit");
    cy.shouldBeVisible("Select Category");
  });

  it("Groceries to create recipe info: Frozen", () => {
    cy.visit("/recipe", { failOnStatusCode: false });
    cy.wait(500);
    const categoryName = "Frozen";
    cy.clickAddItemButton(categoryName);
    cy.shouldBeVisible("Add Item");
    cy.shouldBeVisible("Item Name");
    cy.shouldBeVisible("Quantity");
    cy.shouldBeVisible("Select Unit");
    cy.shouldBeVisible("Select Category");
  });

  it("Groceries to create recipe info: Produce", () => {
    cy.visit("/recipe", { failOnStatusCode: false });
    cy.wait(500);
    const categoryName = "Produce";
    cy.clickAddItemButton(categoryName);
    cy.shouldBeVisible("Add Item");
    cy.shouldBeVisible("Item Name");
    cy.shouldBeVisible("Quantity");
    cy.shouldBeVisible("Select Unit");
    cy.shouldBeVisible("Select Category");
  });
});


