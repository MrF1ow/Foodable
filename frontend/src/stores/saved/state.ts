import { create } from "zustand";

import { SavedItem } from "@/types/saved";

export type SavedItemsState = {
  currentItemType: "recipe" | "groceryList" | null;
  currentCategories: string[];
};

export type SavedItemsActions = {
  setCurrentItemType: (type: "recipe" | "groceryList" | null) => void;
  setCurrentCategories: (categories: string[]) => void;
};

export const createSavedItemsActions = (set: any): SavedItemsActions => ({
  setCurrentItemType: (type) => {
    set({ currentItemType: type });
  },
  setCurrentCategories: (categories: string[]) => {
    set({ currentCategories: [...new Set(categories)] });
  },
});

export type SavedItemsStore = SavedItemsState & SavedItemsActions;

export const defaultInitState: SavedItemsState = {
  currentItemType: null,
  currentCategories: [],
};

export const createSavedItemsStore = (
  initState: SavedItemsState = defaultInitState
) =>
  create<SavedItemsStore>()((set) => ({
    ...initState,
    ...createSavedItemsActions(set),
  }));
