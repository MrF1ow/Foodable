// jest-tests/HelloWorld.test.tsx
import { render, screen } from "@testing-library/react";
import Home from "../src/app/page";

describe("Home page", () => {
  it('renders "Hello World"', () => {
    render(<Home />);

    expect(screen.getByText("Hello World")).toBeInTheDocument();
  });
});
