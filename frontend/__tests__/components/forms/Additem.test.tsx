import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AddItem from "@/components/forms/AddItem";
import { FormName } from "@/lib/constants/forms";
import { useUserStore } from "@/stores/user/store";
import { useGroceryStore } from "@/stores/grocery/store";
import { useGeneralStore } from "@/stores/general/store";

// Mock zustand stores
jest.mock("@/stores/user/store", () => ({
  useUserStore: jest.fn(),
}));

jest.mock("@/stores/grocery/store", () => ({
  useGroceryStore: jest.fn(),
}));

jest.mock("@/stores/general/store", () => ({
  useGeneralStore: jest.fn(),
}));

// Mock hooks
jest.mock("@/server/hooks/groceryListHooks", () => ({
  useUpdateGroceryList: () => ({
    updateGroceryList: jest.fn(),
  }),
}));

jest.mock("@/server/hooks/krogerHooks", () => ({
  useFetchKrogerProducts: () => ({
    krogerProducts: { data: [] },
    isLoadingKrogerProducts: false,
    refetchKrogerProducts: jest.fn(),
    errorKrogerProducts: null,
  }),
}));

// Mock utility
jest.mock("@/lib/items/grocery-map", () => ({
  insertItemIntoGroceryMap: jest.fn(
    () =>
      new Map([
        [
          "item",
          {
            name: "Milk",
            quantity: 1,
            unit: "pcs",
            category: "Dairy",
            checked: false,
          },
        ],
      ])
  ),
}));

describe("AddItem integration", () => {
  const mockSetCurrentForm = jest.fn();

  beforeEach(() => {
    (useUserStore as jest.Mock).mockReturnValue(true);
    (useGroceryStore as jest.Mock).mockReturnValue({
      currentList: { _id: "123", items: [] },
      map: new Map(),
      selectedCategory: "Dairy",
      setCurrentList: jest.fn(),
      setMap: jest.fn(),
      setSelectedCategory: jest.fn(),
    });
    (useGeneralStore as jest.Mock).mockReturnValue({
      isMobile: false,
      setShowPortal: jest.fn(),
      setSplitLayout: jest.fn(),
    });
  });

  it("fills out and submits the form", async () => {
    render(<AddItem setCurrentForm={mockSetCurrentForm} />);

    const nameInput = screen.getByTestId("itemName-input");
    const quantityInput = screen.getByTestId("quantity-input");
    const unitDropdown = screen.getByTestId("units-dropdown");
    const categoryDropdown = screen.getByTestId("category-dropdown");
    const submitButton = screen.getByTestId("submit-button");

    await userEvent.type(nameInput, "Milk");
    await userEvent.type(quantityInput, "1");
    fireEvent.click(unitDropdown);
    const unitOption = screen.getByTestId("pcs-dropdown-item");
    fireEvent.click(unitOption);
    fireEvent.click(categoryDropdown);
    const categoryOption = screen.getByTestId("Dairy-category-item");
    fireEvent.click(categoryOption);

    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByTestId("itemName-input")).toHaveValue("Milk");
    });
  });
});
