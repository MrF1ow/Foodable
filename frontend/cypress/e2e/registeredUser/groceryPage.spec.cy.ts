describe("Registered User Grocery Page", () => {
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
  const listTitle = "Cypress Test";

  it("should create a new grocery list", () => {
    cy.visit("/grocery-list", { failOnStatusCode: false });
    cy.wait(500);
    cy.clickButton("grocery-header-dropdown");
    cy.clickButton("add-grocery-list");
    cy.typeText("new-list-title", listTitle);
    cy.clickButton("select-category");
    cy.get('[role="option"]').contains("New Collection").click();
    cy.clickButton("submit-new-grocery-list");
    cy.shouldBeVisible(listTitle);
  });

  it("should render the category and allow clicking it", () => {
    cy.visit("/grocery-list", { failOnStatusCode: false });
    cy.wait(500);
    const categoryName = "Bakery";
    cy.clickAddItemButton(categoryName);
    cy.shouldBeVisible("Add Item");
    cy.shouldBeVisible("Item Name");
    cy.shouldBeVisible("Quantity");
    cy.shouldBeVisible("Select Unit");
    cy.shouldBeVisible("Select Category");
  });

  it("should render the Find Price button and allow clicking it", () => {
    cy.visit("/grocery-list", { failOnStatusCode: false });
    cy.wait(500);
    cy.clickButton("find-price-button");
    cy.shouldBeVisible("Find Price");
    cy.shouldBeVisible("Select Stores");
    cy.shouldBeVisible("Search By");
  });

  it("should render the AI Helper button and allow clicking it", () => {
    cy.visit("/grocery-list", { failOnStatusCode: false });
    cy.wait(500);
    cy.clickButton("helper-button");
    cy.shouldBeVisible("Grocery List Helper");
  });

  const newListTitle = "New Cypress Test";

  it("will allow the renaming of a grocery list", () => {
    cy.visit("/grocery-list", { failOnStatusCode: false });
    cy.wait(500);

    cy.clickButton("grocery-header-dropdown");
    cy.clickButton("edit-grocery-list");

    cy.typeText("list-title", newListTitle);
    cy.clickButton("select-category");
    cy.get('[role="option"]').contains("New Collection").click();

    cy.clickButton("list-submit");
    cy.wait(1000);

    cy.shouldBeVisible(newListTitle);
  });

  it("will allow the deletion of a grocery list", () => {
    cy.visit("/grocery-list", { failOnStatusCode: false });
    cy.wait(500);

    cy.clickButton("grocery-header-dropdown");
    cy.clickButton("edit-grocery-list");

    cy.wait(500);

    cy.clickButton("list-delete");

    cy.shouldBeVisible("New List");
  });
});
