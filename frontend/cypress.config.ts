import { clerkSetup } from "@clerk/testing/cypress";
import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      return clerkSetup({ config });
    },
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
});
