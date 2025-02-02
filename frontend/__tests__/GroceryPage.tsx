import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import GroceryList from "@/app/grocery-list/page";
import { GroceryStoreProvider } from "@/stores/grocery/store";
import { GeneralStoreProvider } from "@/stores/general/store";
import { RecipeStoreProvider } from "@/stores/recipe/store";
import "@testing-library/jest-dom";

describe("Grocery List page", () => {
  it("renders the title on the page", () => {
    render(
      <RecipeStoreProvider>
        <GroceryStoreProvider>
          <GeneralStoreProvider>
            <GroceryList />
          </GeneralStoreProvider>
        </GroceryStoreProvider>
      </RecipeStoreProvider>
    );
    const title = screen.getByText("Grocery List");
    expect(title).toBeInTheDocument();
  });

  it("renders the Add Item form when the plus button is clicked", async () => {
    render(
      <RecipeStoreProvider>
        <GroceryStoreProvider>
          <GeneralStoreProvider>
            <GroceryList />
          </GeneralStoreProvider>
        </GroceryStoreProvider>
      </RecipeStoreProvider>
    );
    const addItemButtons = await screen.findAllByTestId("add-item-button");
    fireEvent.click(addItemButtons[0]);

    await waitFor(() => {
      expect(screen.getByText("Add Item")).toBeInTheDocument();
    });
  });

  it("renders the Grocery Helper form when the Helper button is clicked", async () => {
    render(
      <RecipeStoreProvider>
        <GroceryStoreProvider>
          <GeneralStoreProvider>
            <GroceryList />
          </GeneralStoreProvider>
        </GroceryStoreProvider>
      </RecipeStoreProvider>
    );
    const helperButton = await screen.findByTestId("helper-button");
    fireEvent.click(helperButton);

    await waitFor(() => {
      expect(screen.getByText("Grocery List Helper")).toBeInTheDocument();
      expect(
        screen.getByPlaceholderText("Lets Talk Food...")
      ).toBeInTheDocument();
    });
  });
});
