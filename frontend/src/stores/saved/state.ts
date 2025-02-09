import { create } from "zustand";
import { SavedCategory, SavedItem } from "@/types/saved";

export type SavedItemsState = {
  savedItems: SavedItem[];
  sortedSavedItems: SavedCategory[];
  currentItemIndex: number;
};

export type SavedItemsActions = {
  addSavedCategory: (category: string) => void;
  removeSavedCategory: (category: string) => void;
  updateSavedCategory: (oldCategory: string, newCategory: string) => void;
  setSavedItems: (savedItems: SavedItem[]) => void;
  addSavedItem: (savedItem: SavedItem) => void;
  removeSavedItem: (index: number) => void;
  setCurrentItemIndex: (index: number) => void;
};

export const createSavedItemsActions = (set: any): SavedItemsActions => ({
  addSavedCategory: (category: string) =>
    set((state: SavedItemsState) => {
      const lowerCaseCategory = category.toLowerCase();

      // Prevent duplicates
      if (
        state.sortedSavedItems.some((cat) => cat.title === lowerCaseCategory)
      ) {
        return state;
      }

      return {
        sortedSavedItems: [
          ...state.sortedSavedItems,
          { title: lowerCaseCategory, items: [] },
        ],
      };
    }),

  removeSavedCategory: (category: string) =>
    set((state: SavedItemsState) => ({
      savedItems: state.savedItems.filter((item) => item.category !== category),
      sortedSavedItems: state.sortedSavedItems.filter(
        (cat) => cat.title !== category
      ),
    })),

  updateSavedCategory: (oldCategory: string, newCategory: string) =>
    set((state: SavedItemsState) => {
      const updatedSavedItems = state.savedItems.map((item) =>
        item.category === oldCategory
          ? { ...item, category: newCategory }
          : item
      );

      const updatedSortedSavedItems = state.sortedSavedItems.map((cat) =>
        cat.title === oldCategory ? { ...cat, title: newCategory } : cat
      );

      return {
        savedItems: updatedSavedItems,
        sortedSavedItems: updatedSortedSavedItems,
      };
    }),

  setSavedItems: (savedItems: SavedItem[]) =>
    set((state: SavedItemsState) => ({ ...state, savedItems })),

  addSavedItem: (savedItem: SavedItem) =>
    set((state: SavedItemsState) => {
      const category = savedItem.category.toLowerCase();

      if (
        state.savedItems.some(
          (item) =>
            item.data._id === savedItem.data._id && item.category === category
        )
      ) {
        return state;
      }

      const updatedSavedItems = [...state.savedItems, savedItem];

      let updatedSortedSavedItems = state.sortedSavedItems.map((cat) =>
        cat.title === category
          ? { ...cat, items: [...cat.items, savedItem] }
          : cat
      );

      if (!state.sortedSavedItems.some((cat) => cat.title === category)) {
        updatedSortedSavedItems = [
          ...state.sortedSavedItems,
          { title: category, items: [savedItem] },
        ];
      }

      return {
        savedItems: updatedSavedItems,
        sortedSavedItems: updatedSortedSavedItems,
      };
    }),

  removeSavedItem: (index: number) =>
    set((state: SavedItemsState) => {
      const itemToRemove = state.savedItems[index];
      if (!itemToRemove) return state;

      const updatedSavedItems = state.savedItems.filter((_, i) => i !== index);
      const updatedSortedSavedItems = state.sortedSavedItems.map((cat) =>
        cat.title === itemToRemove.category
          ? { ...cat, items: cat.items.filter((item) => item !== itemToRemove) }
          : cat
      );

      return {
        savedItems: updatedSavedItems,
        sortedSavedItems: updatedSortedSavedItems,
      };
    }),

  setCurrentItemIndex: (index: number) =>
    set((state: SavedItemsState) => ({ ...state, currentItemIndex: index })),
});

export type SavedItemsStore = SavedItemsState & SavedItemsActions;

export const defaultInitState: SavedItemsState = {
  savedItems: [],
  sortedSavedItems: [
    {
      title: "favorites",
      items: [],
    },
  ],
  currentItemIndex: 0,
};

export const createSavedItemsStore = (
  initState: SavedItemsState = defaultInitState
) =>
  create<SavedItemsStore>((set) => ({
    ...initState,
    ...createSavedItemsActions(set),
  }));
