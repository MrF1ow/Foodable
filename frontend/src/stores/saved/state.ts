import { create } from "zustand";
import { SavedCategory, MainMetaData } from "@/types/saved";
import { Recipe } from "@/types/recipe";
import { GroceryList } from "@/types/grocery";

export type SavedItemsState = {
  savedItems: MainMetaData[];
  fullSavedDataCache: {
    recipes: Record<string, Recipe>;
    groceryLists: Record<string, GroceryList>;
  };
  sortedSavedItems: SavedCategory[];
  currentItemId: string;
  currentItemType?: "recipe" | "grocery";
};

export type SavedItemsActions = {
  addSavedCategory: (category: string) => void;
  removeSavedCategory: (category: string) => void;
  updateSavedCategory: (oldCategory: string, newCategory: string) => void;
  setSavedItems: (savedItems: MainMetaData[]) => void;
  addSavedItem: (savedItem: MainMetaData) => void;
  removeSavedItem: (index: number) => void;
  setCurrentItemId: (id: string) => void;
  cacheFullData: (data: Recipe | GroceryList) => void;
};

export const createSavedItemsActions = (set: any): SavedItemsActions => ({
  addSavedCategory: (category: string) =>
    set((state: SavedItemsState) => {
      const lowerCaseCategory = category.toLowerCase();
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

  setSavedItems: (savedItems: MainMetaData[]) =>
    set((state: SavedItemsState) => ({ ...state, savedItems })),

  addSavedItem: (savedItem: MainMetaData) =>
    set((state: SavedItemsState) => {
      const category = savedItem.category.toLowerCase();
      if (
        state.savedItems.some(
          (item) => item._id === savedItem._id && item.category === category
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
          ? {
              ...cat,
              items: cat.items.filter((item) => item._id !== itemToRemove._id),
            }
          : cat
      );
      return {
        savedItems: updatedSavedItems,
        sortedSavedItems: updatedSortedSavedItems,
      };
    }),

  setCurrentItemId: (id: string) =>
    set((state: SavedItemsState) => {
      const foundItem = state.savedItems.find(
        (item) => item._id.toString() === id
      );
      const itemType = foundItem?.category === "recipe" ? "recipe" : "grocery";
      return { ...state, currentItemId: id, currentItemType: itemType };
    }),

  cacheFullData: (data: Recipe | GroceryList) =>
    set((state: SavedItemsState) => {
      if ("ingredients" in data) {
        return {
          fullDataCache: {
            ...state.fullSavedDataCache,
            recipes: {
              ...state.fullSavedDataCache.recipes,
              [data._id?.toString() || data.id]: data,
            },
          },
        };
      } else {
        return {
          fullSavedDataCache: {
            ...state.fullSavedDataCache,
            groceryLists: {
              ...state.fullSavedDataCache.groceryLists,
              [data._id?.toString() || data.id]: data,
            },
          },
        };
      }
    }),
});

export type SavedItemsStore = SavedItemsState & SavedItemsActions;

export const defaultInitState: SavedItemsState = {
  savedItems: [],
  sortedSavedItems: [{ title: "favorites", items: [] }],
  currentItemId: "",
  fullSavedDataCache: {
    recipes: {},
    groceryLists: {},
  },
};

export const createSavedItemsStore = (
  initState: SavedItemsState = defaultInitState
) =>
  create<SavedItemsStore>((set) => ({
    ...initState,
    ...createSavedItemsActions(set),
  }));
