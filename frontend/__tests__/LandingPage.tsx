// jest-tests/HelloWorld.test.tsx
import { render, screen } from "@testing-library/react";
import Home from "../src/app/page";
import "@testing-library/jest-dom";

describe("Home page", () => {
  it('renders "Foodable" as the main heading', () => {
    render(<Home />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "Foodable"
    );
  });

  it('renders "Making Food More Doable." as the subheading', () => {
    render(<Home />);
    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent(
      "Making Food More Doable."
    );
  });

  it("renders Login and Sign Up buttons", () => {
    render(<Home />);
    expect(screen.getByText("Login")).toBeInTheDocument();
    expect(screen.getByText("Sign Up")).toBeInTheDocument();
  });

  it('renders the "Continue As Guest" link', () => {
    render(<Home />);
    expect(screen.getByText("Continue As Guest")).toBeInTheDocument();
  });
});
