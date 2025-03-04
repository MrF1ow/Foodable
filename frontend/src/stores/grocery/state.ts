// Package Imports
import { create } from "zustand";

// Local Imports
import {
  GroceryItem,
  GroceryList,
  GrocerySectionOptions,
  NewGroceryList,
} from "@/types/grocery";

export type GroceryState = {
  currentList: GroceryList | NewGroceryList | null;

  currentCategories: GrocerySectionOptions[];
  currentSections: GrocerySectionOptions[];
  selectedCategory: GrocerySectionOptions;
  map: Map<string, GroceryItem>;
  currentForm: string;
};

export type GroceryActions = {
  setCurrentList: (list: GroceryList | NewGroceryList) => void;
  setCurrentForm: (
    card: string,
    isMobile: boolean,
    updateSplitLayout?: (split: boolean) => void
  ) => void;
  resetForm: () => void;
  setCurrentSections: (sections: GrocerySectionOptions[]) => void;
  setSelectedCategory: (category: GrocerySectionOptions) => void;
  setCurrentCategories: (categories: GrocerySectionOptions[]) => void;
};

export const createGroceryActions = (set: any, get: any): GroceryActions => ({
  setCurrentList: (list: GroceryList | NewGroceryList) =>
    set((state: GroceryState) => {
      // update the map with the items in the currentList
      const updatedMap = new Map(state.map);

      // if the items array is not present, set it to an empty array
      const items =
        list.items && list.items !== undefined && Array.isArray(list.items)
          ? list.items
          : [];

      items.forEach((item) => {
        updatedMap.set(item.name, item);
      });

      return {
        ...state,
        currentList: { ...list, items },
        map: updatedMap,
      };
    }),

  resetForm: () =>
    set((state: GroceryState) => {
      return {
        ...state,
        currentForm: "",
      };
    }),

  setCurrentSections: (sections: GrocerySectionOptions[]) =>
    set((state: GroceryState) => ({ ...state, currentSections: sections })),

  setCurrentForm: (
    card: string,
    isMobile: boolean,
    updateSplitLayout?: (split: boolean) => void
  ) =>
    set((state: GroceryState) => {
      if (card === "") {
        if (updateSplitLayout) {
          updateSplitLayout(false); // Set splitLayout to false when form is cleared
        }
      } else {
        if (!isMobile) {
          if (updateSplitLayout) {
            updateSplitLayout(true); // Set splitLayout to true when form is opened
          }
        }
      }
      return { ...state, currentForm: card };
    }),
  setCurrentCategories: (categories: GrocerySectionOptions[]) =>
    set((state: GroceryState) => ({ ...state, currentCategories: categories })),
  setSelectedCategory: (category: GrocerySectionOptions) =>
    set((state: GroceryState) => ({ ...state, selectedCategory: category })),
});

export type GroceryStore = GroceryState & GroceryActions;

export const initState: GroceryState = {
  currentList: null,
  currentCategories: [],
  currentSections: [],
  selectedCategory: "Bakery",
  map: new Map(),
  currentForm: "",
};

export const defaultInitState: GroceryState = {
  currentList: null,
  currentCategories: ["Bakery", "Dairy", "Produce", "Meat", "Frozen"],
  currentSections: [],
  selectedCategory: "Bakery",
  map: new Map(),
  currentForm: "",
};

export const createGroceryStore = (
  initState: GroceryState = defaultInitState
) =>
  create<GroceryStore>()((set, get) => ({
    ...initState,
    ...createGroceryActions(set, get),
  }));
