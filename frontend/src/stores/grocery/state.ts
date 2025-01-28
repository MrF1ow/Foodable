import { create } from "zustand";

import { GroceryItem } from "@/types/grocery";

export type GroceryState = {
  title: string;
  items: GroceryItem[];
};

export type GroceryActions = {
  setTitle: (title: string) => void;
  setItems: (items: GroceryItem[]) => void;
};

export type GroceryStore = GroceryState & GroceryActions;

export const initGroceryStore = (): GroceryState => {
  return {
    title: "",
    items: [],
  };
};

export const defaultInitState: GroceryState = {
  title: "",
  items: [],
};

export const createGroceryStore = (
  initState: GroceryState = defaultInitState
) => {
  return create<GroceryStore>((set) => ({
    ...initState,

    // Define actions as part of the store
    setTitle: (title: string) => set((state) => ({ ...state, title })),

    setItems: (items: GroceryItem[]) => set((state) => ({ ...state, items })),
  }));
};
