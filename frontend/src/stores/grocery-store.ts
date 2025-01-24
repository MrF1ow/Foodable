import { createStore } from "zustand/vanilla";

import { GroceryItem } from "@/types";

export type GroceryState = {
  groceryItems: GroceryItem[];
  addItem: (item: GroceryItem) => void;
  toggleItem: (index: number) => void;
};

export type GroceryActions = {
  setGroceryItems: (groceryItems: GroceryItem[]) => void;
};

export type GroceryStore = GroceryState & GroceryActions;

export const initGroceryStore = (): GroceryState => {
  return {
    groceryItems: [],
    addItem: () => {},
    toggleItem: () => {},
  };
};

export const defaultInitState: GroceryState = {
  groceryItems: [],
  addItem: () => {},
  toggleItem: () => {},
};

export const createGroceryStore = (
  initState: GroceryState = defaultInitState
) => {
  return createStore<GroceryState>((set) => ({
    ...initState,

    // Define actions as part of the store
    setGroceryItems: (groceryItems: GroceryItem[]) =>
      set((state) => ({ ...state, groceryItems })),
    addItem: (item: GroceryItem) =>
      set((state) => ({
        ...state,
        groceryItems: [...state.groceryItems, item],
      })),
    toggleItem: (index: number) => {
      set((state) => {
        const updated = [...state.groceryItems];
        updated[index] = {
          ...updated[index],
          checked: !updated[index].checked,
        };
        return { groceryItems: updated };
      });
    },
  }));
};
