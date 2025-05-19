describe("Registered User Saved Page", () => {
  beforeEach(() => {
    cy.session("registered-user-session", () => {
      cy.visit("/sign-in");
      cy.clerkSignIn({
        strategy: "password",
        identifier: Cypress.env("USER_SIGN_IN_EMAIL"),
        password: Cypress.env("USER_SIGN_IN_PASSWORD"),
      });
    });
    cy.visit("/saved", { failOnStatusCode: false });
  });

  it("should vist the saved page", () => {
    cy.shouldBeVisible("Saved");
  });

  it("should be able to create a new category", () => {
    cy.clickButton("add-category-button");
    cy.shouldBeVisible("Create Custom Category");
    cy.typeText("new-category-title", "Cypress Test Category");
    cy.clickButton("new-category-submit");
    cy.contains("span", "Close").closest("button").click();
    cy.shouldBeVisible("Cypress Test Category");
  });

  it("should show the Cypress Test Category", () => {
    cy.createSavedList();
    cy.shouldBeVisible("Cypress Test Category");
    cy.clickButton("saved-category-Cypress Test Category");
    cy.shouldBeVisible("No items saved in this category.");
  });

  it("should be able to add a recipe to a category", () => {
    cy.visit("/recipe", { failOnStatusCode: false });
    cy.clickButton("recipe-box-Chocolate Cake");
    cy.clickButton("unsaved-bookmark");
    cy.typeText("new-category-name", "Cypress Test Category");
    cy.clickButton("add-category");
    cy.clickButton("select-category");
    cy.get('[role="option"]').contains("Cypress Test Category").click();
    cy.clickButton("save-bookmark");
    cy.visit("/saved", { failOnStatusCode: false });
    cy.shouldBeVisible("Cypress Test Category");
    cy.clickButton("saved-category-Cypress Test Category");
    cy.shouldBeVisible("Chocolate Cake");
  });

  it("Should be able to view the recipe in the saved page", () => {
    cy.shouldBeVisible("Cypress Test Category");
    cy.clickButton("saved-category-Cypress Test Category");
    cy.clickButton("recipe-box-Chocolate Cake");
    cy.shouldBeVisible("Description");
  });

  it("should be able to delete a category", () => {
    cy.clickButton("saved-category-edit-Cypress Test Category");
    cy.clickButton("edit-saved-delete");
    cy.contains("Cypress Test Category").should("not.exist");
  });
});
