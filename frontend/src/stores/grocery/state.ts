// Package Imports
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

// Local Imports
import {
  GroceryItem,
  GroceryList,
  GrocerySectionOptions,
  GroceryListIdentifier,
  NewGroceryList,
} from "@/types/grocery";

export type GroceryState = {
  currentList: GroceryList | NewGroceryList | null;
  availableLists: GroceryListIdentifier[];

  // tracks the current categories in the grocery list
  currentCategories: GrocerySectionOptions[];

  // tracks which sections are open in the grocery list
  openSections: GrocerySectionOptions[];
  selectedCategory: GrocerySectionOptions;
  map: Map<string, GroceryItem>;
  storePricesByStore: Map<string, Map<string, number>>;
  storeTotal: number | null;
  isSharedView: boolean;
};

export type GroceryActions = {
  setCurrentList: (list: GroceryList | NewGroceryList) => void;
  setAvailableLists: (lists: GroceryListIdentifier[]) => void;
  setOpenSections: (sections: GrocerySectionOptions[]) => void;
  setSelectedCategory: (category: GrocerySectionOptions) => void;
  setCurrentCategories: (categories: GrocerySectionOptions[]) => void;
  setMap: (map: Map<string, GroceryItem>) => void;
  setStorePricesByStore: (storeId: string, prices: Map<string, number>) => void;
  setStoreTotal: (total: number | null) => void;
  clearStorePrices: () => void;
  clearStoreTotal: () => void;
  setIsSharedView: (isSharedView: boolean) => void;
};

export const createGroceryActions = (set: any): GroceryActions => ({
  setCurrentList: (list: GroceryList | NewGroceryList | undefined | null) =>
    set((state: GroceryState) => {
      // update the map with the items in the currentList
      const updatedMap = new Map<string, GroceryItem>();
      const newCategories = new Set<GrocerySectionOptions>();

      if (!list || list === undefined) {
        return {
          ...state,
          currentList: {
            _id: null,
            creatorId: null,
            title: "",
            items: [],
          } as GroceryList,
          map: updatedMap,
          openSections: [],
        };
      }

      const items =
        list.items && list.items !== undefined && Array.isArray(list.items)
          ? list.items
          : [];

      items.forEach((item) => {
        updatedMap.set(item.name.toLowerCase(), item);
        if (item.category) newCategories.add(item.category);
      });

      console.log("Items:", items);
      console.log("Updated Map:", updatedMap);
      console.log("List:", list);

      return {
        ...state,
        currentList: { ...list, items },
        map: updatedMap,
        openSections: Array.from(newCategories),
      };
    }),

  setAvailableLists: (lists: GroceryListIdentifier[]) =>
    set((state: GroceryState) => {
      return {
        ...state,
        availableLists: lists,
      };
    }),

  setOpenSections: (sections: GrocerySectionOptions[]) =>
    set((state: GroceryState) => ({ ...state, openSections: sections })),

  setCurrentCategories: (categories: GrocerySectionOptions[]) =>
    set((state: GroceryState) => ({ ...state, currentCategories: categories })),
  setSelectedCategory: (category: GrocerySectionOptions) =>
    set((state: GroceryState) => ({ ...state, selectedCategory: category })),
  setMap: (map: Map<string, GroceryItem>) =>
    set((state: GroceryState) => {
      // convert map values to an array to update currentList.items
      const updatedItems = Array.from(map.values());

      console.log(updatedItems); 
      const newSections = Array.from(
        new Set(updatedItems.map((item) => item.category))
      );

      const categories = [...state.currentCategories, ...newSections];

      return {
        ...state,
        openSections: newSections,
        currentCategories: categories,
        map,
        currentList: state.currentList
          ? { ...state.currentList, items: updatedItems }
          : null,
      };
    }),
  setStorePricesByStore: (storeId: string, prices: Map<string, number>) =>
    set((state: GroceryState) => {
      const updated = new Map(state.storePricesByStore); // clone the outer map
      updated.set(storeId, prices); // set the nested map
      return {
        ...state,
        storePricesByStore: updated,
      };
    }),
  setStoreTotal: (total) =>
    set((state: GroceryState) => ({ ...state, storeTotal: total })),
  clearStorePrices: () =>
    set((state: GroceryState) => ({
      ...state,
      storePricesByStore: new Map(),
    })),
  clearStoreTotal: () =>
    set((state: GroceryState) => ({
      ...state,
      storeTotal: null,
    })),

  setIsSharedView: (val: boolean) => set({ isSharedView: val }),
});

export type GroceryStore = GroceryState & GroceryActions;

export const initState: GroceryState = {
  currentList: null,
  availableLists: [],
  currentCategories: [],
  openSections: [],
  selectedCategory: "Bakery",
  map: new Map(),
  storePricesByStore: new Map(),
  storeTotal: null,
  isSharedView: false,
};

export const defaultInitState: GroceryState = {
  currentList: null,
  availableLists: [],
  currentCategories: ["Bakery", "Dairy", "Produce", "Meat", "Frozen"],
  openSections: [],
  selectedCategory: "Bakery",
  map: new Map(),
  storePricesByStore: new Map(),
  storeTotal: null,
  isSharedView: false,
};

export const createGroceryStore = (
  initState: GroceryState = defaultInitState
) =>
  create<GroceryStore>()(
    persist(
      (set) => ({
        ...initState,
        ...createGroceryActions(set),
      }),
      {
        name: "grocery-storage",
        storage: createJSONStorage(() => localStorage),
        partialize: (state) => ({
          ...state,
          map: Object.fromEntries(state.map), // Map -> Object
          storePricesByStore: Object.fromEntries(
            Array.from(state.storePricesByStore).map(([storeId, priceMap]) => [
              storeId,
              Object.fromEntries(priceMap),
            ])
          ),
        }),
        merge: (persistedState, currentState) => {
          const map = new Map<string, GroceryItem>(
            Object.entries((persistedState as any).map || {})
          );
          const storePricesByStore = new Map<string, Map<string, number>>(
            Object.entries(
              (persistedState as any).storePricesByStore || {}
            ).map(([storeId, priceMap]) => [
              storeId,
              new Map(Object.entries(priceMap as Map<string, number>)),
            ])
          );

          return {
            ...currentState,
            ...(persistedState as GroceryState),
            map,
            storePricesByStore,
          };
        },
      }
    )
  );
