/// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//
export {};

declare global {
  namespace Cypress {
    interface Chainable {
      shouldBeVisible(element: string): Chainable<void>;
      clickAddItemButton(categoryName: string): Chainable<void>;
      clickButton(testId: string): Chainable<void>;
      typeText(testId: string, text: string): Chainable<void>;
      clickCheckbox(itemName: string): Chainable<void>;
    }
  }
}

Cypress.Commands.add("shouldBeVisible", (element: string) => {
  cy.contains(element).should("be.visible");
});

Cypress.Commands.add("clickAddItemButton", (categoryName: string) => {
  cy.get(`[data-testid="${categoryName}-add-item-button"]`).click();
});

Cypress.Commands.add("clickButton", (testId: string) => {
  cy.get(`[data-testid="${testId}"]`).click();
});

Cypress.Commands.add("typeText", (testId: string, text: string) => {
  cy.get(`[data-testid="${testId}"]`).type(text);
});

Cypress.Commands.add("clickCheckbox", (itemName: string) => {
  cy.get("[data-testid=" + itemName + "-checkbox]").click();
});
