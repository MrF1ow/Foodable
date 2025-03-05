import { create } from "zustand";

import { SavedItem } from "@/types/saved";

export type SavedItemsState = {
  currentItem: SavedItem | null;
  currentCategories: string[];
};

export type SavedItemsActions = {
  setCurrentItem: (item: SavedItem) => void;
  setCurrentCategories: (categories: string[]) => void;
};

export const createSavedItemsActions = (set: any): SavedItemsActions => ({
  setCurrentItem: (item: SavedItem) => {
    set({ currentItem: item });
  },
  setCurrentCategories: (categories: string[]) => {
    set({ currentCategories: categories });
  },
});

export type SavedItemsStore = SavedItemsState & SavedItemsActions;

export const defaultInitState: SavedItemsState = {
  currentItem: null,
  currentCategories: [],
};

export const createSavedItemsStore = (
  initState: SavedItemsState = defaultInitState
) =>
  create<SavedItemsStore>()((set) => ({
    ...initState,
    ...createSavedItemsActions(set),
  }));
