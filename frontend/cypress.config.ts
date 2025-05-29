import { clerkSetup } from "@clerk/testing/cypress";
import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      return clerkSetup({ config });
    },
    specPattern: [
      "cypress/e2e/**/*.cy.{js,ts,jsx,tsx}",
      "cypress/integration/**/*.cy.{js,ts,jsx,tsx}",
    ],
    baseUrl: "http://localhost:8000",
    viewportHeight: 1080,
    viewportWidth: 1920,
  },
  component: {
    devServer: {
      framework: "next",
      bundler: "webpack",
    },
  },
  env: {
    USER_SIGN_IN_EMAIL: "cypress_guy@gmail.com",
    USER_SIGN_IN_PASSWORD: "IloveCypress#12",
  },
});
