// Package Imports
import { create } from "zustand";

// Local Imports
import {
  GroceryItem,
  GroceryList,
  GrocerySectionOptions,
  GroceryListIdentifier,
  NewGroceryList,
} from "@/types/grocery";

export type GroceryState = {
  currentList: GroceryList | NewGroceryList | null;
  availableLists: GroceryListIdentifier[];

  // tracks the current categories in the grocery list
  currentCategories: GrocerySectionOptions[];

  // tracks which sections are open in the grocery list
  currentSections: GrocerySectionOptions[];
  selectedCategory: GrocerySectionOptions;
  map: Map<string, GroceryItem>;
  currentForm: string;
};

export type GroceryActions = {
  setCurrentList: (list: GroceryList | NewGroceryList) => void;
  setAvailableLists: (lists: GroceryListIdentifier[]) => void;
  setCurrentForm: (
    card: string,
    isMobile: boolean,
    updateSplitLayout?: (split: boolean) => void
  ) => void;
  resetForm: () => void;
  setCurrentSections: (sections: GrocerySectionOptions[]) => void;
  setSelectedCategory: (category: GrocerySectionOptions) => void;
  setCurrentCategories: (categories: GrocerySectionOptions[]) => void;
  setMap: (map: Map<string, GroceryItem>) => void;
};

export const createGroceryActions = (set: any): GroceryActions => ({
  setCurrentList: (list: GroceryList | NewGroceryList | undefined | null) =>
    set((state: GroceryState) => {
      // update the map with the items in the currentList
      const updatedMap = new Map<string, GroceryItem>();

      if (!list || list === undefined) {
        return {
          ...state,
          currentList: {
            _id: null,
            creatorId: null,
            title: "",
            items: [],
          } as GroceryList,
          map: updatedMap,
        };
      }

      const items =
        list.items && list.items !== undefined && Array.isArray(list.items)
          ? list.items
          : [];

      items.forEach((item) => {
        updatedMap.set(item.name.toLowerCase(), item);
      });

      return {
        ...state,
        currentList: { ...list, items },
        map: updatedMap,
      };
    }),

  setAvailableLists: (lists: GroceryListIdentifier[]) =>
    set((state: GroceryState) => {
      return {
        ...state,
        availableLists: lists,
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
  setMap: (map: Map<string, GroceryItem>) =>
    set((state: GroceryState) => {
      // convert map values to an array to update currentList.items
      const updatedItems = Array.from(map.values());

      const newSections = Array.from(
        new Set(updatedItems.map((item) => item.category))
      );

      const categories = [...state.currentCategories, ...newSections];

      return {
        ...state,
        currentCategories: categories,
        map,
        currentList: state.currentList
          ? { ...state.currentList, items: updatedItems }
          : null,
      };
    }),
});

export type GroceryStore = GroceryState & GroceryActions;

export const initState: GroceryState = {
  currentList: null,
  availableLists: [],
  currentCategories: [],
  currentSections: [],
  selectedCategory: "Bakery",
  map: new Map(),
  currentForm: "",
};

export const defaultInitState: GroceryState = {
  currentList: null,
  availableLists: [],
  currentCategories: ["Bakery", "Dairy", "Produce", "Meat", "Frozen"],
  currentSections: [],
  selectedCategory: "Bakery",
  map: new Map(),
  currentForm: "",
};

export const createGroceryStore = (
  initState: GroceryState = defaultInitState
) =>
  create<GroceryStore>()((set) => ({
    ...initState,
    ...createGroceryActions(set),
  }));
