import { render, screen } from "@testing-library/react";
import RecipePage from "../src/app/recipe/page";
import "@testing-library/jest-dom";

describe("Recipe page", () => {
  it("renders Search Bar", () => {
    render(<RecipePage />);
    expect(screen.getByPlaceholderText("Find Recipes ...")).toBeInTheDocument();
  });
});
