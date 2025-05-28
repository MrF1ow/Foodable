import { render, screen } from "@testing-library/react";
import HomePage from "../page";
import "@testing-library/jest-dom";

describe("Home page", () => {
  it('renders "Foodable" as the main heading', () => {
    render(<HomePage />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "Foodable"
    );
  });

  it('renders "Making Food More Doable." as the subheading', () => {
    render(<HomePage />);
    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent(
      "Making Food More Doable."
    );
  });

  it("renders Login and Sign Up buttons", () => {
    render(<HomePage />);
    expect(screen.getByText("Login")).toBeInTheDocument();
    expect(screen.getByText("Sign Up")).toBeInTheDocument();
  });

  it('renders the "Continue As Guest" link', () => {
    render(<HomePage />);
    expect(screen.getByText("Continue As Guest")).toBeInTheDocument();
  });
});
