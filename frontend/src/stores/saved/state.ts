import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

import { SavedCategory, MainMetaData } from "@/types/saved";
import { Recipe } from "@/types/recipe";
import { GroceryList } from "@/types/grocery";

export type SavedItemsState = {
  currentItem: Recipe | GroceryList | null;
  savedItems: MainMetaData[];
  fullSavedDataCache: {
    recipes: Record<string, Recipe>;
    groceryLists: Record<string, GroceryList>;
  };
  sortedSavedItems: SavedCategory[];
  currentItemId: string;
  currentItemType: "recipe" | "grocery" | "";
};

export type SavedItemsActions = {
  addSavedCategory: (category: string) => void;
  removeSavedCategory: (category: string) => void;
  updateSavedCategory: (oldCategory: string, newCategory: string) => void;
  setSavedItems: (savedItems: MainMetaData[]) => void;
  addSavedItem: (savedItem: MainMetaData) => void;
  removeSavedItem: (index: number) => void;
  setCurrentItemId: (id: string) => void;
  cacheFullData: (id: string) => Promise<void>;
};

export const createSavedItemsActions = (
  set: any,
  get: any
): SavedItemsActions => ({
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

  setCurrentItemId: (id: string) => {
    set((state: SavedItemsState) => {
      const foundItem = state.savedItems.find(
        (item) => item._id.toString() === id
      );
      const itemType = foundItem?.type === "recipe" ? "recipe" : "grocery";
      console.log("Setting current item:", id, itemType);
      return { ...state, currentItemId: id, currentItemType: itemType };
    });

    setTimeout(() => {
      const currentItemType = get().currentItemType;
      if (currentItemType !== "") {
        get().cacheFullData(id);
      } else {
        console.error("Type not set yet!");
      }
    }, 0);
  },

  cacheFullData: async (id: string) => {
    const type = get().currentItemType;

    if (type === "recipe") {
      if (get().fullSavedDataCache.recipes[id]) {
        set(() => ({ currentItem: get().fullSavedDataCache.recipes[id] }));
        return;
      }
    } else if (type === "grocery") {
      if (get().fullSavedDataCache.groceryLists[id]) {
        set(() => ({ currentItem: get().fullSavedDataCache.groceryLists[id] }));
        return;
      }
    }

    try {
      const response = await fetch(
        type === "recipe" ? `/api/recipes?id=${id}` : `/api/grocery?id=${id}`
      );
      if (!response.ok) throw new Error("Failed to fetch data");

      const data = await response.json();
      set((state: SavedItemsState) => ({
        currentItem: data,
        fullSavedDataCache: {
          ...state.fullSavedDataCache,
          [type === "recipe" ? "recipes" : "groceryLists"]: {
            ...state.fullSavedDataCache[
              type === "recipe" ? "recipes" : "groceryLists"
            ],
            [id]: data,
          },
        },
      }));
    } catch (error) {
      console.error(`Error fetching ${type}:`, error);
    }
  },
});

export type SavedItemsStore = SavedItemsState & SavedItemsActions;

export const defaultInitState: SavedItemsState = {
  currentItem: null,
  savedItems: [],
  sortedSavedItems: [{ title: "favorites", items: [] }],
  currentItemId: "",
  fullSavedDataCache: {
    recipes: {},
    groceryLists: {},
  },
  currentItemType: "",
};

export const createSavedItemsStore = (
  initState: SavedItemsState = defaultInitState
) =>
  create<SavedItemsStore>()(
    persist(
      (set, get) => ({
        ...initState,
        ...createSavedItemsActions(set, get),
      }),
      {
        name: "saved-items-store",
        storage: createJSONStorage(() => sessionStorage),
        partialize: (state) => ({
          sortedSavedItems: state.sortedSavedItems,
          fullSavedDataCache: state.fullSavedDataCache,
        }),
        merge(persistedState: any, currentState) {
          return {
            ...currentState,
            sortedSavedItems: persistedState.sortedSavedItems,
            fullSavedDataCache: persistedState.fullSavedDataCache,
          };
        },
      }
    )
  );
