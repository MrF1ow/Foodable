import React from "react";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  within,
} from "@testing-library/react";
import "@testing-library/jest-dom";
import GroceryPage from "../src/app/grocery-list/page";
import { GroceryStoreProvider } from "@/stores/grocery/store";
import { GeneralStoreProvider } from "@/stores/general/store";
import { RecipeStoreProvider } from "@/stores/recipe/store";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

describe("GroceryPage Unit/Integration Tests", () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    });

    render(
      <QueryClientProvider client={queryClient}>
        <RecipeStoreProvider>
          <GroceryStoreProvider>
            <GeneralStoreProvider>
              <GroceryPage />
            </GeneralStoreProvider>
          </GroceryStoreProvider>
        </RecipeStoreProvider>
      </QueryClientProvider>
    );
  });

  it("renders the Grocery List header", () => {
    expect(screen.getByText("New List")).toBeInTheDocument();
  });

  it("renders a list of categories", () => {
    expect(screen.getByText("Bakery")).toBeInTheDocument();
    expect(screen.getByText("Dairy")).toBeInTheDocument();
    expect(screen.getByText("Produce")).toBeInTheDocument();
    expect(screen.getByText("Meat")).toBeInTheDocument();
    expect(screen.getByText("Pantry")).toBeInTheDocument();
  });

  it("renders the Add Item button", () => {
    const addItemButton = screen.getByTestId("Bakery-add-item-button");
    expect(addItemButton).toBeInTheDocument();
  });

  it("opens the Add Item form when the Add Item button is clicked", async () => {
    const addItemButton = screen.getByTestId("Bakery-add-item-button");
    fireEvent.click(addItemButton);

    await waitFor(() => {
      expect(screen.getByText("Add Item")).toBeInTheDocument();
    });

    expect(screen.getByLabelText("Item Name")).toBeInTheDocument();
    expect(screen.getByLabelText("Quantity")).toBeInTheDocument();
    expect(screen.getByText("Select Unit")).toBeInTheDocument();
    expect(screen.getByText("Select Category")).toBeInTheDocument();
  });

  it("displays an error when submitting an empty item", async () => {
    const addItemButton = screen.getByTestId("Bakery-add-item-button");
    fireEvent.click(addItemButton);

    const submitButton = screen.getByTestId("submit-button");
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText("Item name must be at least 3 characters long")
      ).toBeInTheDocument();
    });
  });

  it("adds a new item and displays it in the list", async () => {
    const addItemButton = screen.getByTestId("Bakery-add-item-button");
    fireEvent.click(addItemButton);

    const itemNameInput = screen.getByTestId("itemName-input");
    const quantityInput = screen.getByTestId("quantity-input");

    fireEvent.change(itemNameInput, { target: { value: "Bread" } });
    fireEvent.change(quantityInput, { target: { value: "3" } });

    const submitButton = screen.getByTestId("submit-button");
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText("Bread")).toBeInTheDocument();
      expect(screen.getByText(/3 pcs/i)).toBeInTheDocument();
    });
  });

  it("closes the Add Item form when the close button is clicked", async () => {
    const addItemButton = screen.getByTestId("Bakery-add-item-button");
    fireEvent.click(addItemButton);
    await waitFor(() => {
      expect(screen.getByText("Add Item")).toBeInTheDocument();
    });
    const closeButton = screen.getByTestId("close-form-button");
    fireEvent.click(closeButton);
    await waitFor(() => {
      expect(screen.queryByText("Add Item")).not.toBeInTheDocument();
    });
  });

  it("removes an item from the list when the remove action is triggered", async () => {
    const addItemButton = screen.getByTestId("Bakery-add-item-button");
    fireEvent.click(addItemButton);
    const itemNameInput = screen.getByTestId("itemName-input");
    const quantityInput = screen.getByTestId("quantity-input");
    fireEvent.change(itemNameInput, { target: { value: "Bread" } });
    fireEvent.change(quantityInput, { target: { value: "3" } });
    const submitButton = screen.getByTestId("submit-button");
    fireEvent.click(submitButton);
    await waitFor(() => {
      expect(screen.getByText("Bread")).toBeInTheDocument();
      expect(screen.getByText(/3 pcs/i)).toBeInTheDocument();
    });

    const checkbox = screen.getByTestId("Bread-checkbox");
    fireEvent.click(checkbox);

    const removeButton = screen.getByTestId("remove-items-button");
    fireEvent.click(removeButton);
    await waitFor(() => {
      expect(screen.queryByText("Bread")).not.toBeInTheDocument();
    });
  });

  it("doesnt remove an item from the list that isnt checked when the remove action is triggered", async () => {
    const addItemButton = screen.getByTestId("Bakery-add-item-button");
    fireEvent.click(addItemButton);
    const itemNameInput = screen.getByTestId("itemName-input");
    const quantityInput = screen.getByTestId("quantity-input");
    fireEvent.change(itemNameInput, { target: { value: "Bread" } });
    fireEvent.change(quantityInput, { target: { value: "3" } });
    const submitButton = screen.getByTestId("submit-button");
    fireEvent.click(submitButton);
    await waitFor(() => {
      expect(screen.getByText("Bread")).toBeInTheDocument();
      expect(screen.getByText(/3 pcs/i)).toBeInTheDocument();
    });

    const removeButton = screen.getByTestId("remove-items-button");
    fireEvent.click(removeButton);
    await waitFor(() => {
      expect(screen.queryByText("Bread")).toBeInTheDocument();
    });
  });
});
