beforeEach(() => {
  cy.visit("/grocery-list", { failOnStatusCode: false });
  cy.wait(500);
});

describe("Visit Grocery Page", () => {
  it("Grocery Page Should Load Successfully", () => {
    cy.shouldBeVisible("New List");
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

  const listTitle = "Cypress Test";
  const newListTitle = "New Cypress Test";

  it("will allow the creation of a grocery list", () => {
    cy.clickButton("list-edit");

    cy.typeText("list-title", listTitle);

    cy.clickButton("list-submit");

    cy.shouldBeVisible(listTitle);
  });

  it("will allow the renaming of a grocery list", () => {
    cy.clickButton("grocery-header");

    cy.contains(listTitle).click();

    cy.wait(500);

    cy.clickButton("list-edit");

    cy.typeText("list-title", newListTitle);

    cy.clickButton("list-submit");
    cy.wait(1000);

    cy.shouldBeVisible(newListTitle);
  });

  it("will allow the deletion of a grocery list", () => {
    cy.clickButton("grocery-header");

    cy.contains(listTitle).click();

    cy.wait(500);

    cy.clickButton("list-edit");

    cy.clickButton("list-delete");

    cy.shouldBeVisible("New List");

    // will put back after race condition is solved

    // cy.clickButton("grocery-header");

    // cy.shouldBeVisible("No lists available");
  });

  it("will remember the items in the saved grocery list", () => {
    const categoryName = "Bakery";
    cy.clickAddItemButton(categoryName);
    cy.shouldBeVisible("Add Item");

    cy.typeText("itemName-input", "Bread");
    cy.typeText("quantity-input", "3{leftarrow}{backspace}");
    cy.clickButton("submit-button");

    cy.shouldBeVisible("Bread");
    cy.shouldBeVisible("3");

    cy.clickButton("list-edit");

    cy.typeText("list-title", listTitle);

    cy.clickButton("list-submit");

    cy.visit("/grocery-list", { failOnStatusCode: false });
    cy.wait(500);

    cy.clickButton("Bakery-accordion");
    cy.shouldBeVisible("No items currently in the Bakery section");

    cy.clickButton("grocery-header");

    cy.contains(listTitle).click();

    cy.wait(500);

    cy.clickButton("Bakery-accordion");
    cy.shouldBeVisible("Bread");
    cy.shouldBeVisible("3");

    cy.deleteCurrentList();
  });

  it("will switch between grocery lists", () => {
    const bakerySection = "Bakery";
    cy.clickAddItemButton(bakerySection);
    cy.shouldBeVisible("Add Item");

    cy.typeText("itemName-input", "Bread");
    cy.typeText("quantity-input", "3{leftarrow}{backspace}");
    cy.clickButton("submit-button");

    cy.shouldBeVisible("Bread");
    cy.shouldBeVisible("3");

    cy.clickButton("list-edit");
    cy.typeText("list-title", "Bread List");
    cy.clickButton("list-submit");

    cy.clickButton("grocery-header");
    cy.contains("New List").click();

    const dairySection = "Dairy";
    cy.clickAddItemButton(dairySection);
    cy.shouldBeVisible("Add Item");

    cy.typeText("itemName-input", "Milk");
    cy.typeText("quantity-input", "2{leftarrow}{backspace}");
    cy.clickButton("submit-button");

    cy.shouldBeVisible("Milk");
    cy.shouldBeVisible("2");

    cy.clickButton("list-edit");
    cy.typeText("list-title", "Milk List");
    cy.clickButton("list-submit");

    cy.clickButton("grocery-header");
    cy.contains("New List").click();

    cy.clickButton("Bakery-accordion");
    cy.shouldBeVisible("No items currently in the Bakery section");

    cy.clickButton("Dairy-accordion");
    cy.shouldBeVisible("No items currently in the Dairy section");

    cy.clickButton("grocery-header");
    cy.contains("Bread List").click();

    cy.shouldBeVisible("Bread List");
    cy.clickButton("Bakery-accordion");
    cy.shouldBeVisible("Bread");
    cy.shouldBeVisible("3");

    cy.clickButton("Dairy-accordion");
    cy.shouldBeVisible("No items currently in the Dairy section");

    cy.clickButton("grocery-header");
    cy.contains("Milk List").click();

    cy.shouldBeVisible("Milk List");
    cy.clickButton("Bakery-accordion");
    cy.shouldBeVisible("No items currently in the Bakery section");

    cy.clickButton("Dairy-accordion");
    cy.shouldBeVisible("Milk");
    cy.shouldBeVisible("2");

    cy.deleteCurrentList();
    cy.deleteList("Bread List");
  });

  it("will allow the deletion of items from a list", () => {
    const bakerySection = "Bakery";
    const itemName = "Bread";
    cy.clickAddItemButton(bakerySection);
    cy.shouldBeVisible("Add Item");

    cy.typeText("itemName-input", itemName);
    cy.typeText("quantity-input", "3{leftarrow}{backspace}");
    cy.clickButton("submit-button");

    cy.shouldBeVisible(itemName);
    cy.shouldBeVisible("3");

    cy.clickButton("list-edit");
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
});
