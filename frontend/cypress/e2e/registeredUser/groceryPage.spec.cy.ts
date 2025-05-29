describe("Create list and add item", () => {
  const email = Cypress.env("USER_SIGN_IN_EMAIL");
  const password = Cypress.env("USER_SIGN_IN_PASSWORD");
  const listTitle = `E2E List ${Date.now().toString().slice(-5)}`;
  const itemName = "E2E Bread";

  it("logs in, creates a grocery list, adds an item, and confirms persistence", () => {
    cy.clearCookies();
    cy.visit("/sign-in");

    // Login with real form
    cy.get('input[type="email"]').type(email);
    cy.get('input[type="password"]').type(password);
    cy.get('button[type="submit"]').click();

    // Wait for redirect to /recipe
    cy.url({ timeout: 20000 }).should("include", "/recipe");
    cy.contains("Create Recipe", { timeout: 10000 }).should("be.visible");

    // Navigate to grocery list page
    cy.visit("/grocery-list");
    cy.contains("New List", { timeout: 10000 }).should("be.visible");

    // Create a grocery list
    cy.clickButton("grocery-header-dropdown");
    cy.clickButton("add-grocery-list");
    cy.typeText("new-list-title", listTitle);
    cy.clickButton("select-category");
    cy.get('[role="option"]').contains("New Collection").click();
    cy.clickButton("submit-new-grocery-list");
    cy.contains("New List").should("not.exist");
    cy.contains(listTitle, { timeout: 10000 }).should("be.visible");
    cy.contains("New List").should("not.exist");

    // Add an item
    cy.clickAddItemButton("Bakery");
    cy.contains(listTitle, { timeout: 10000 }).should("be.visible");
    cy.typeText("itemName-input", itemName);
    cy.clickButton("submit-button");
    cy.wait(500);
    cy.clickButton("close-form-button");
    cy.wait(1000);
    cy.contains(itemName, { timeout: 10000 }).should("be.visible");

    // Reload and confirm both list and item persist
    cy.reload();
    cy.contains(listTitle).should("be.visible");
    cy.contains(itemName, { timeout: 10000 }).should("be.visible");

    // Delete the grocery list
    cy.clickButton("grocery-header-dropdown");
    cy.clickButton("edit-grocery-list");
    cy.wait(300);
    cy.clickButton("list-delete");

    // Confirm fallback UI shows
    cy.contains("New List").should("be.visible");
  });
});
