describe("Visit Grocery Page", () => {
  beforeEach(() => {
    cy.visit("/grocery-list", { failOnStatusCode: false });
  });

  it("Grocery Page Should Load Successfully", () => {
    cy.shouldBeVisible("Grocery List");
  });

  it("should render the category and allow clicking it", () => {
    const categoryName = "Bakery";
    cy.clickAddItemButton(categoryName);
    cy.shouldBeVisible("Add Item");
    cy.shouldBeVisible("Item Name");
    cy.shouldBeVisible("Quantity");
    cy.shouldBeVisible("Select Unit");
    cy.shouldBeVisible("Select Category");
  });

  it("should render the Find Price button and allow clicking it", () => {
    cy.clickButton("find-price-button");
    cy.shouldBeVisible("Find Price");
    cy.shouldBeVisible("Select Stores");
    cy.shouldBeVisible("Search By");
  });

  it("should render the AI Helper button and allow clicking it", () => {
    cy.clickButton("helper-button");
    cy.shouldBeVisible("Grocery List Helper");
  });

  it("should add item to a category", () => {
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
    const categoryName = "Bakery";
    cy.clickAddItemButton(categoryName);
    cy.clickButton("submit-button");
    cy.shouldBeVisible("Item name must be at least 3 characters long");
  });

  it("should allow removing an item", () => {
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
    const categoryName = "Bakery";
    cy.clickAddItemButton(categoryName);
    const itemName = "Milk";

    cy.typeText("itemName-input", itemName);

    cy.clickButton("category-dropdown");
    cy.clickButton("Dairy-category-item");

    cy.clickButton("submit-button");
    cy.clickButton("Bakery-accordion");

    cy.shouldBeVisible("No items currently in the Bakery section.");
    cy.shouldBeVisible(itemName);
  });

  it("it should change the units through the dropdown", () => {
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
});
