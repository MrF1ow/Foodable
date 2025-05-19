describe("Guest Recipe Page", () => {
    it("Recipe Page Should Load Successfully", () => {
        cy.visit("/recipe", { failOnStatusCode: false });
        cy.wait(5000);
        cy.contains("New List");
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

    it("Recipe Filter button info", () => {
        cy.visit("/recipe", { failOnStatusCode: false });
        cy.wait(500);
        cy.contains("button", "Filter").click();
        cy.shouldBeVisible("Sort Recipes By");
        cy.shouldBeVisible("Price");
        cy.shouldBeVisible("Time");
        cy.shouldBeVisible("Ingredients");
    });
});

