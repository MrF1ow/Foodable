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
  updateCurrentListItem(index: number, currentList: string): void;
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

      if (isAlreadySaved) return state;

      return {
        currentLists: [...state.currentLists, currentList],
      };
    }),
  removeCurrentList: (currentList: string) =>
    set((state: SavedItemsState) => {
      const newCurrentLists = state.currentLists.filter(
        (list) => list.toLowerCase() !== currentList.toLowerCase()
      );

      const updatedSavedItems = state.savedItems.filter(
        (item) => item.category.toLowerCase() !== currentList.toLowerCase()
      );

      return {
        currentLists: newCurrentLists,
        savedItems: updatedSavedItems,
      };
    }),
  setSavedItems: (savedItems: SavedItem[]) =>
    set((state: SavedItemsState) => ({ ...state, savedItems })),
  updateCurrentListItem: (index: number, currentList: string) =>
    set((state: SavedItemsState) => {
      const newCurrentLists = [...state.currentLists];
      const newCategory = currentList.toLowerCase();

      // Update the current list name
      newCurrentLists[index] = newCategory;

      // Update the category of all saved items that belong to this list
      const updatedSavedItems = state.savedItems.map((item) =>
        item.category === state.currentLists[index]
          ? { ...item, category: newCategory }
          : item
      );

      return { currentLists: newCurrentLists, savedItems: updatedSavedItems };
    }),
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
