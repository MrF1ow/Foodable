import { create } from "zustand";

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
  currentCategories: ["New Collection"],
};

export const createSavedItemsStore = (
  initState: SavedItemsState = defaultInitState
) =>
  create<SavedItemsStore>()((set) => ({
    ...initState,
    ...createSavedItemsActions(set),
  }));
