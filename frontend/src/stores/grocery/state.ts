import { create } from "zustand";

import { GroceryItem, GrocerySectionOptions } from "@/types/grocery";

export type GroceryState = {
  title: string;
  items: GroceryItem[];
  currentCategories: GrocerySectionOptions[];
  map: Map<string, GroceryItem>;
};

export type GroceryActions = {
  setTitle: (title: string) => void;
  setItems: (items: GroceryItem[]) => void;
  setCurrentCategories: (categories: GrocerySectionOptions[]) => void;
};

export const createGroceryActions = (set: any): GroceryActions => ({
  setTitle: (title: string) =>
    set((state: GroceryState) => ({ ...state, title })),
  setItems: (items: GroceryItem[]) =>
    set((state: GroceryState) => {
      const newMap = new Map<string, GroceryItem>();

      // Convert the items array to a map
      items.forEach((item) => {
        newMap.set(item.name.toLowerCase(), item);
      });

      return {
        ...state,
        items, // Update items
        map: newMap, // Update map based on the new items
      };
    }),
  setCurrentCategories: (categories: GrocerySectionOptions[]) =>
    set((state: GroceryState) => ({ ...state, currentCategories: categories })),
});

export type GroceryStore = GroceryState & GroceryActions;

export const initGroceryStore = (): GroceryState => {
  return {
    title: "",
    items: [],
    currentCategories: ["Bakery", "Dairy", "Produce", "Meat", "Pantry"],
    map: new Map(),
  };
};

export const defaultInitState: GroceryState = {
  title: "",
  items: [],
  currentCategories: ["Bakery", "Dairy", "Produce", "Meat", "Pantry"],
  map: new Map(),
};

export const createGroceryStore = (
  initState: GroceryState = defaultInitState
) => {
  return create<GroceryStore>((set) => ({
    ...initState,
    ...createGroceryActions(set),
  }));
};
