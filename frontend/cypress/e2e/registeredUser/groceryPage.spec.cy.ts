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

  it("should add item to a category", () => {
    cy.visit("/grocery-list", { failOnStatusCode: false });
    cy.wait(500);
    const categoryName = "Bakery";
    cy.clickAddItemButton(categoryName);
    cy.shouldBeVisible("Add Item");

    cy.typeText("itemName-input", "Bread");
    cy.typeText("quantity-input", "3{leftarrow}{backspace}");
    cy.clickButton("submit-button");

    cy.shouldBeVisible("Bread");
    cy.shouldBeVisible("3");
  });

  it("should prevent adding an empty item", () => {
    cy.visit("/grocery-list", { failOnStatusCode: false });
    cy.wait(500);
    const categoryName = "Bakery";
    cy.clickAddItemButton(categoryName);
    cy.clickButton("submit-button");
    cy.shouldBeVisible("Item name must be at least 3 characters long");
  });

  it("should allow removing an item", () => {
    cy.visit("/grocery-list", { failOnStatusCode: false });
    cy.wait(500);
    const categoryName = "Dairy";
    cy.clickAddItemButton(categoryName);

    const itemName = "Milk";
    cy.typeText("itemName-input", itemName);
    cy.clickButton("submit-button");
    cy.contains("Milk").should("be.visible");

    cy.clickCheckbox(itemName);
    cy.clickButton("remove-items-button");
    cy.contains("Milk").should("not.exist");
  });

  it("it should change the category through the dropdown", () => {
    cy.visit("/grocery-list", { failOnStatusCode: false });
    cy.wait(500);
    const categoryName = "Bakery";
    cy.clickAddItemButton(categoryName);
    const itemName = "Milk";

    cy.typeText("itemName-input", itemName);

    cy.clickButton("category-dropdown");
    cy.clickButton("Dairy-category-item");

    cy.clickButton("submit-button");
    cy.clickButton("Frozen-accordion");

    cy.shouldBeVisible("No items currently in the Frozen section.");
    cy.shouldBeVisible(itemName);
  });

  it("it should change the units through the dropdown", () => {
    cy.visit("/grocery-list", { failOnStatusCode: false });
    cy.wait(500);
    const categoryName = "Meat";
    cy.clickAddItemButton(categoryName);
    const itemName = "Bacon";

    cy.typeText("itemName-input", itemName);

    cy.clickButton("units-dropdown");
    cy.clickButton("lb-dropdown-item");

    cy.clickButton("submit-button");

    cy.shouldBeVisible(itemName);
    cy.shouldBeVisible("1 lb");
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

  it("will remember the items in the saved grocery list", () => {
    cy.visit("/grocery-list", { failOnStatusCode: false });
    cy.wait(500);
    cy.clickButton("grocery-header-dropdown");
    cy.clickButton("add-grocery-list");
    cy.typeText("new-list-title", "Temporary Cypress List");
    cy.clickButton("select-category");
    cy.get('[role="option"]').contains("New Collection").click();
    cy.clickButton("submit-new-grocery-list");
    cy.get("body").click(0, 0);
    cy.get('[role="option"]').should("not.exist");
    cy.wait(500);

    const categoryName = "Bakery";
    cy.clickAddItemButton(categoryName);
    cy.shouldBeVisible("Add Item");

    cy.typeText("itemName-input", "Bread");
    cy.typeText("quantity-input", "21{leftarrow}{backspace}");
    cy.clickButton("submit-button");

    cy.shouldBeVisible("Bread");
    cy.shouldBeVisible("21");

    cy.clickButton("grocery-header");
    cy.contains(newListTitle).click();
    cy.wait(500);
    cy.shouldBeVisible("Bacon");
    cy.shouldBeVisible("1 lb");

    cy.clickButton("grocery-header");
    cy.contains("Temporary Cypress List").click();

    cy.wait(500);

    cy.clickButton("Bakery-accordion");
    cy.shouldBeVisible("Bread");
    cy.shouldBeVisible("21");

    cy.deleteCurrentList();
  });

  it("will allow the deletion of items from a list", () => {
    cy.visit("/grocery-list", { failOnStatusCode: false });
    cy.wait(500);
    const bakerySection = "Bakery";
    const itemName = "Bread";
    cy.clickAddItemButton(bakerySection);
    cy.shouldBeVisible("Add Item");

    cy.typeText("itemName-input", itemName);
    cy.typeText("quantity-input", "3{leftarrow}{backspace}");
    cy.clickButton("submit-button");

    cy.shouldBeVisible(itemName);
    cy.shouldBeVisible("3");

    cy.clickButton("grocery-header-dropdown");
    cy.clickButton("edit-grocery-list");
    cy.typeText("list-title", listTitle);
    cy.clickButton("list-submit");
    cy.shouldBeVisible(listTitle);

    cy.visit("/grocery-list", { failOnStatusCode: false });
    cy.wait(500);

    cy.clickButton("grocery-header");
    cy.contains(listTitle).click();

    cy.clickButton("Bakery-accordion");

    cy.clickCheckbox(itemName);

    cy.clickButton("remove-items-button");

    cy.visit("/grocery-list", { failOnStatusCode: false });
    cy.wait(500);

    cy.clickButton("grocery-header");
    cy.contains(listTitle).click();

    cy.clickButton("Bakery-accordion");
    cy.contains(itemName).should("not.exist");

    cy.deleteCurrentList();
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
