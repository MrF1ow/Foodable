import { create } from "zustand";

import { Recipe } from "@/types/recipe";
import { GroceryList } from "@/types/grocery";

export type SavedItemsState = {
  currentItem: Recipe | GroceryList | null;
};

export type SavedItemsActions = {
  setCurrentItem: (item: Recipe | GroceryList) => void;
};

export const createSavedItemsActions = (set: any): SavedItemsActions => ({
  setCurrentItem: (item: Recipe | GroceryList) => {
    set({ currentItem: item });
  },
});

export type SavedItemsStore = SavedItemsState & SavedItemsActions;

export const defaultInitState: SavedItemsState = {
  currentItem: null,
};

export const createSavedItemsStore = (
  initState: SavedItemsState = defaultInitState
) =>
  create<SavedItemsStore>()((set) => ({
    ...initState,
    ...createSavedItemsActions(set),
  }));
