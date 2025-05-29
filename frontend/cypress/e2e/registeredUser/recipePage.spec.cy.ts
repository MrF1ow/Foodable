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

  it("Creating a Recipe", () => {
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
    cy.visit("/recipe");

    cy.clickButton("create-recipe");

    cy.get('input[name="title"]').type("Test Pancake Recipe");
    cy.get('textarea[name="description"]').type("Fluffy pancakes for test.");

    cy.get('input[name="ingredient-0-name"]').type("Flour");
    cy.get('input[name="ingredient-0-quantity"]').type("2");
    cy.get('select[name="ingredient-0-unit"]').select("cups");

    cy.get('textarea[name="instructions"]').type(
      "Mix ingredients. Cook on medium heat.",
    );

    cy.clickButton("submit-recipe");

    // Wait for navigation or confirmation
    cy.contains("Recipe created successfully");
    cy.contains("Test Pancake Recipe");
  });

  it("E2E: Filters apply and persist correctly", () => {
    cy.visit("/recipe");

    cy.contains("button", "Filter").click();
    cy.get('input[type="checkbox"][value="Time"]').check();
    cy.get('input[type="checkbox"][value="Ingredients"]').check();

    cy.clickButton("apply-filters");

    // Simulate reloading
    cy.reload();

    // Assert filters are still applied
    cy.get('input[type="checkbox"][value="Time"]').should("be.checked");
    cy.get('input[type="checkbox"][value="Ingredients"]').should("be.checked");

    // Validate filtered results are showing
    cy.get(".recipe-card").should("exist");
  });

  it("E2E: Form shows validation errors on empty submission", () => {
    cy.visit("/recipe");

    cy.clickButton("create-recipe");

    // Submit without filling fields
    cy.clickButton("submit-recipe");

    // Expect validation messages
    cy.contains("Recipe title is required");
    cy.contains("At least one ingredient is required");
    cy.contains("Instructions are required");
  });

  it("E2E: Add Bakery item while creating recipe", () => {
    cy.visit("/recipe");

    const categoryName = "Bakery";
    cy.clickAddItemButton(categoryName);

    cy.get('input[name="itemName"]').type("Sourdough Bread");
    cy.get('input[name="quantity"]').type("1");
    cy.get('select[name="unit"]').select("loaf");
    cy.get('select[name="category"]').select("Bakery");

    cy.clickButton("add-item-confirm");

    // Confirm it's added
    cy.contains("Sourdough Bread");
  });
});
