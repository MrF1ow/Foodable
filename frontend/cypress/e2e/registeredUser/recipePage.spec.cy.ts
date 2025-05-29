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

describe("Registered User Recipe Page E2E Tests", () => {
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

  it("E2E: Logged-in user can create and view a new recipe", () => {
     cy.visit("/recipe", { failOnStatusCode: false });
    cy.wait(500);
    cy.clickButton("create-recipe");
    cy.get('[data-testid="recipe-title-input"]')
      .type("Test Recipe Title")
      .should("have.value", "Test Recipe Title");
    cy.get('[data-testid="recipe-image-input"]').selectFile(
      "cypress/fixtures/sample.jpg",
      { force: true },
    );

    cy.get('img[alt="Recipe Preview"]').should("be.visible");

    cy.get('[data-testid="recipe-description-input"]')
      .type("This is a test description")
      .should("have.value", "This is a test description");

    // Ingredient
    cy.get('[data-testid="ingredient-0-name"]').type("Flour");

    cy.get('[data-testid="ingredient-0-quantity"]').clear().type("4");

    cy.get('[data-testid="recipe-unit-dropdown"]').first().click();
    cy.get('[data-testid="ingredient-cup"]').click();
    cy.get('[data-testid="recipe-unit-dropdown"]').should("contain", "cup");

    cy.get('[data-testid="category-dropdown"]').first().click();
    cy.get('[data-testid="Produce-category-recipe-form"]').click();
    cy.get('[data-testid="category-dropdown"]').should("contain", "Produce");

    cy.get('[data-testid="instruction-0-step"]')
      .clear()
      .type("Mix all ingredients");

    cy.get('[data-testid="submit-recipe-button"]').click();

    cy.visit("/saved", { failOnStatusCode: false });
    cy.wait(500);

    cy.get('[data-testid="saved-category-My Items"]').click();

    cy.shouldBeVisible("Test Recipe Title");
  });
 });
