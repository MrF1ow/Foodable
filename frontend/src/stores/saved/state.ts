import { set } from "node_modules/cypress/types/lodash";
import { create } from "zustand";

export type SavedItemsState = {
  searchQuery: string;
  currentItemType: "recipe" | "groceryList" | null;
  currentCategories: string[];
};

export type SavedItemsActions = {
  setSearchQuery: (query: string) => void;
  setCurrentItemType: (type: "recipe" | "groceryList" | null) => void;
  setCurrentCategories: (categories: string[]) => void;
};

export const createSavedItemsActions = (set: any): SavedItemsActions => ({
  setSearchQuery: (query) => {
    set({ searchQuery: query });
  },
  setCurrentItemType: (type) => {
    set({ currentItemType: type });
  },
  setCurrentCategories: (categories: string[]) => {
    set({ currentCategories: [...new Set(categories)] });
  },
});

export type SavedItemsStore = SavedItemsState & SavedItemsActions;

export const defaultInitState: SavedItemsState = {
  searchQuery: "",
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
