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
  });

  it("should be able to create a new category", () => {
    cy.visit("/saved", { failOnStatusCode: false });
    cy.wait(500);
    cy.clickButton("add-category-button");
    cy.shouldBeVisible("Create Custom Category");
    cy.typeText("new-category-title", "Cypress Test Category");
    cy.clickButton("new-category-submit");
    cy.contains("span", "Close").closest("button").click();
    cy.shouldBeVisible("Cypress Test Category");
  });

  it("should vist the saved page", () => {
    cy.visit("/saved", { failOnStatusCode: false });
    cy.wait(500);
    cy.shouldBeVisible("Saved");
  });

  it("should show the Cypress Test Category", () => {
    cy.shouldBeVisible("Cypress Test Category");
    cy.clickButton("saved-category-Cypress Test Category");
    cy.shouldBeVisible("No items saved in this category.");
  });

  it("should allow renaming the category", () => {
    cy.clickButton("saved-category-edit-Cypress Test Category");
    cy.typeText("edit-saved-title", "Cypress Test Category Edited");
    cy.clickButton("edit-saved-submit");
    cy.contains("span", "Close").closest("button").click();
    cy.shouldBeVisible("Cypress Test Category Edited");
  });
});
