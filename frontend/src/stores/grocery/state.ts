import { create } from "zustand";

import { GroceryItem } from "@/types/grocery";

export type GroceryState = {
  title: string;
  items: GroceryItem[];
  map: Map<string, GroceryItem>;
  selectedCategory: string;
};

export type GroceryActions = {
  setTitle: (title: string) => void;
  setItems: (items: GroceryItem[]) => void;
  setSelectedCategory: (category: string) => void;
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
  setSelectedCategory: (category: string) =>
    set((state: GroceryState) => ({ ...state, selectedCategory: category })),
});

export type GroceryStore = GroceryState & GroceryActions;

export const initGroceryStore = (): GroceryState => {
  return {
    title: "",
    items: [],
    map: new Map(),
    selectedCategory: "",
  };
};

export const defaultInitState: GroceryState = {
  title: "",
  items: [],
  map: new Map(),
  selectedCategory: "",
};

export const createGroceryStore = (
  initState: GroceryState = defaultInitState
) => {
  return create<GroceryStore>((set) => ({
    ...initState,
    ...createGroceryActions(set),
  }));
};
