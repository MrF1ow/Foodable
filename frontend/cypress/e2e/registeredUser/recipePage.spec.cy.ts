describe("Registered User Recipe Page", () => {   
    it("Recipe Page Should Load Successfully", () => {
        cy.visit("/recipe", { failOnStatusCode: false });
        cy.wait(5000);
        cy.contains("New List");
    });

    it("Creating a Recipe", () => {
        cy.visit("/recipe", { failOnStatusCode: false });
        cy.wait(500);
        cy.clickButton("create-recipe");
        // cy.contains("button", "Create Recipe", { timeout: 5000 }).click();
        // cy.shouldBeVisible("Recipe Title");
        // cy.shouldBeVisible("Recipe Picture");
        // cy.shouldBeVisible("Click to upload image");
        // cy.shouldBeVisible("Description");
        // cy.shouldBeVisible("Ingredients");
        // cy.shouldBeVisible("Instructions");
        // cy.shouldBeVisible("Submit");
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

})
