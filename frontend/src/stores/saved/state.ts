import { create } from "zustand";
import { SavedItem } from "@/types/saved";

export type SavedItemsState = {
  currentLists: string[];
  savedItems: SavedItem[];
};

export type SavedItemsActions = {
  setCurrentLists: (currentLists: string[]) => void;
  addCurrentList: (currentList: string) => void;
  removeCurrentList: (currentList: string) => void;
  setSavedItems: (savedItems: SavedItem[]) => void;
  addSavedItem: (savedItem: SavedItem) => void;
  removeSavedItem: (index: number) => void;
};

export const createSavedItemsActions = (set: any): SavedItemsActions => ({
  setCurrentLists: (currentLists: string[]) =>
    set((state: SavedItemsState) => ({ ...state, currentLists })),
  addCurrentList: (currentList: string) =>
    set((state: SavedItemsState) => {
      const isAlreadySaved = state.currentLists.includes(
        currentList.toLowerCase()
      );

      if (isAlreadySaved) return state; // Prevent duplicate entry

      return {
        currentLists: [...state.currentLists, currentList.toLowerCase()],
      };
    }),
  removeCurrentList: (currentList: string) =>
    set((state: SavedItemsState) => {
      const newCurrentLists = [...state.currentLists];
      const index = newCurrentLists.indexOf(currentList.toLowerCase());
      newCurrentLists.splice(index, 1);
      return { currentLists: newCurrentLists };
    }),
  setSavedItems: (savedItems: SavedItem[]) =>
    set((state: SavedItemsState) => ({ ...state, savedItems })),
  addSavedItem: (savedItem: SavedItem) =>
    set((state: SavedItemsState) => {
      const isAlreadySaved = state.savedItems.some(
        (item) => item.data.id === savedItem.data.id
      );

      if (isAlreadySaved) return state; // Prevent duplicate entry

      return { savedItems: [...state.savedItems, savedItem] };
    }),
  removeSavedItem: (index: number) =>
    set((state: SavedItemsState) => {
      const newSavedItems = [...state.savedItems];
      newSavedItems.splice(index, 1);
      return { savedItems: newSavedItems };
    }),
});

export type SavedItemsStore = SavedItemsState & SavedItemsActions;

export const initSavedItemsStore = (): SavedItemsState => {
  return {
    currentLists: ["Favorites"],
    savedItems: [],
  };
};

export const defaultInitState: SavedItemsState = {
  currentLists: ["Favorites"],
  savedItems: [],
};

export const createSavedItemsStore = (
  initState: SavedItemsState = defaultInitState
) =>
  create<SavedItemsStore>((set) => ({
    ...initState,
    ...createSavedItemsActions(set),
  }));
