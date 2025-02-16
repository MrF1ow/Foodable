import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

import {
  GroceryItem,
  GroceryList,
  GrocerySectionOptions,
} from "@/types/grocery";
import {
  GroceryMetaData,
  SavedGroceryMetaData,
  UnsavedGroceryMetaData,
} from "@/types/saved";
import { convertAmount } from "@/utils/listItems";

export type GroceryState = {
  currentList: {
    id: string;
    title: string;
    data: GroceryList | null;
    metadata:
      | GroceryMetaData
      | SavedGroceryMetaData
      | UnsavedGroceryMetaData
      | null;
    items: GroceryItem[]; // The current items in
  };
  currentLists: GroceryMetaData[];
  fullGroceryLists: Record<string, GroceryList>; // The full grocery lists stored in cache

  currentCategories: GrocerySectionOptions[];
  currentSections: GrocerySectionOptions[];
  selectedCategory: GrocerySectionOptions;
  map: Map<string, GroceryItem>;
  currentForm: string;
};

export type GroceryActions = {
  getCurrentMetadata: (id: string) => void;
  getCurrentTitle: (id: string) => void;

  setCurrentList: (list: GroceryMetaData) => void;
  setTitle: (title: string) => void;
  setItems: (items: GroceryItem[]) => void;
  addItem: (item: GroceryItem) => void;
  removeItem: (id: string) => void;
  setCurrentForm: (
    card: string,
    isMobile: boolean,
    updateSplitLayout?: (split: boolean) => void
  ) => void;
  resetForm: () => void;
  setCurrentSections: (sections: GrocerySectionOptions[]) => void;
  addSection: (section: GrocerySectionOptions) => void;
  removeSection: (section: GrocerySectionOptions) => void;
  setSelectedCategory: (category: GrocerySectionOptions) => void;
  setCurrentCategories: (categories: GrocerySectionOptions[]) => void;
  removeCurrentList: (id: string) => void;
  updateCurrentListItem(id: string, newTitle: string): void;
  setCurrentLists: (
    lists: (GroceryMetaData | UnsavedGroceryMetaData)[]
  ) => void;
  setCurrentGroceryListId: (id: string) => void;

  fetchFullGroceryList: (id: string) => Promise<void>;
};

export const createGroceryActions = (set: any, get: any): GroceryActions => ({
  getCurrentMetadata: (id: string): GroceryMetaData | SavedGroceryMetaData =>
    get().currentLists.find(
      (recipe: GroceryMetaData) => recipe._id.toString() === id
    ),

  getCurrentTitle: (id: string): string => {
    const list = get().currentLists.find(
      (recipe: GroceryMetaData) => recipe._id.toString() === id
    );
    return list ? list.title : "";
  },
  setCurrentList: (list: GroceryMetaData) =>
    set((state: GroceryState) => {
      return {
        ...state,
        currentList: {
          id: list._id.toString(),
          title: list.title,
          metadata: list,
        },
      };
    }),
  setTitle: (title: string) =>
    set((state: GroceryState) => {
      return {
        ...state,
        currentList: {
          ...state.currentList,
          title: title,
        },
      };
    }),
  setItems: (items: GroceryItem[]) =>
    set((state: GroceryState) => {
      const newMap = new Map<string, GroceryItem>();

      // Convert the items array to a map
      items.forEach((item) => {
        newMap.set(item.name.toLowerCase(), item);
      });

      return {
        ...state,
        currentList: {
          ...state.currentList,
          items: items, // Update items based on the new items
        },
        map: newMap, // Update map based on the new items
      };
    }),

  resetForm: () =>
    set((state: GroceryState) => {
      return {
        ...state,
        currentForm: "",
      };
    }),

  addItem: (item: GroceryItem) =>
    set((state: GroceryState) => {
      const itemKey = item.name.toLowerCase();
      const existingItem = state.map.get(itemKey);
      let newMap;
      let newItems;

      const items = get().currentList.items;

      if (existingItem) {
        const convertedQuantity = convertAmount(
          item.quantity,
          item.unit,
          existingItem.unit
        );
        existingItem.quantity += convertedQuantity;
        newMap = new Map(state.map);
        newMap.set(itemKey, existingItem);

        newItems = items.map((i: GroceryItem) =>
          i.name.toLowerCase() === itemKey ? existingItem : i
        );
      } else {
        item.checked = false;
        newItems = [...items, item];
        newMap = new Map(state.map).set(itemKey, item);
      }
      const newSections = state.currentSections.includes(item.category)
        ? state.currentSections
        : [...state.currentSections, item.category];

      return {
        ...state,
        currentList: {
          ...state.currentList,
          items: newItems,
        },
        map: newMap,
        currentSections: newSections,
      };
    }),

  removeItem: (name: string) =>
    set((state: GroceryState) => {
      if (!state.map.has(name.toLowerCase())) return state; // Item not found

      const items = get().currentList.items;

      const newItems = items.filter(
        (item: GroceryItem) => item.name.toLowerCase() !== name.toLowerCase()
      );
      const newMap = new Map(state.map);
      newMap.delete(name.toLowerCase());

      return {
        ...state,
        currentList: {
          ...state.currentList,
          items: newItems,
        },
        map: newMap,
      };
    }),

  setCurrentSections: (sections: GrocerySectionOptions[]) =>
    set((state: GroceryState) => ({ ...state, currentSections: sections })),

  addSection: (section: GrocerySectionOptions) =>
    set((state: GroceryState) => {
      // Check if the section already exists in the currentSections
      if (!state.currentSections.includes(section)) {
        return {
          ...state,
          currentSections: [...state.currentSections, section],
        };
      }
      // If it already exists, return the current state
      return state;
    }),

  removeSection: (section: GrocerySectionOptions) =>
    set((state: GroceryState) => {
      return {
        ...state,
        currentCategories: state.currentCategories.filter(
          (category) => category !== section
        ),
      };
    }),

  setCurrentForm: (
    card: string,
    isMobile: boolean,
    updateSplitLayout?: (split: boolean) => void
  ) =>
    set((state: GroceryState) => {
      if (card === "") {
        if (updateSplitLayout) {
          updateSplitLayout(false); // Set splitLayout to false when form is cleared
        }
      } else {
        if (!isMobile) {
          if (updateSplitLayout) {
            updateSplitLayout(true); // Set splitLayout to true when form is opened
          }
        }
      }
      return { ...state, currentForm: card };
    }),
  setCurrentCategories: (categories: GrocerySectionOptions[]) =>
    set((state: GroceryState) => ({ ...state, currentCategories: categories })),
  setSelectedCategory: (category: GrocerySectionOptions) =>
    set((state: GroceryState) => ({ ...state, selectedCategory: category })),
  removeCurrentList: (id: string) => {
    set((state: GroceryState) => {
      const newCurrentLists = state.currentLists.filter(
        (list) => list._id.toString() !== id.toString()
      );

      const updatedFullGroceryLists = { ...state.fullGroceryLists };
      delete updatedFullGroceryLists[id];

      return {
        currentLists: newCurrentLists,
        fullGroceryLists: updatedFullGroceryLists,
      };
    });
  },
  updateCurrentListItem: (id: string, newTitle: string) =>
    set((state: GroceryState) => {
      const foundItem = state.currentLists.find(
        (item: GroceryMetaData) => item._id.toString() === id
      );
      const index = state.currentLists.findIndex(
        (item: GroceryMetaData) => item._id.toString() === id
      );

      if (!foundItem) return state;

      // Update the metadata
      const newItem = { ...foundItem, title: newTitle };

      // Update the current lists
      const updatedCurrentLists = [
        ...state.currentLists.slice(0, index),
        newItem,
        ...state.currentLists.slice(index + 1),
      ];

      // Update the full grocery list
      const updatedFullGroceryLists = {
        ...state.fullGroceryLists,
        [id]: { ...state.fullGroceryLists[id], title: newTitle },
      };

      return {
        currentList: {
          ...state.currentList,
          title: newTitle,
          metadata: newItem,
        },
        currentLists: updatedCurrentLists,
        fullGroceryLists: updatedFullGroceryLists,
      };
    }),
  setCurrentLists: (lists) =>
    set({
      currentLists: [
        { type: "grocery", title: "New List" } as UnsavedGroceryMetaData,
        ...lists,
      ],
    }),

  setCurrentGroceryListId: (id: string) => {
    set((state: GroceryState) => {
      const metadata = state.currentLists.find(
        (list: GroceryMetaData) => list._id.toString() === id
      );
      return {
        currentList: { id: id, metadata },
      };
    });
  },

  fetchFullGroceryList: async (id: string) => {
    if (get().fullGroceryLists[id]) {
      const metadata = get().currentLists.find(
        (list: GroceryMetaData) => list._id.toString() === id
      );
      set((state: GroceryState) => ({
        currentList: { id: id, data: state.fullGroceryLists[id], metadata },
      }));
      return;
    }

    try {
      const response = await fetch(`/api/grocery?id=${id}`);
      const groceryList = await response.json();

      set((state: GroceryState) => ({
        fullGroceryLists: {
          ...state.fullGroceryLists,
          [id]: groceryList,
        },
        currentList: { ...state.currentList, data: groceryList },
      }));
    } catch (error) {
      console.error("Error fetching grocery list", error);
    }
  },
});

export type GroceryStore = GroceryState & GroceryActions;

export const defaultInitState: GroceryState = {
  currentList: {
    id: "",
    title: "",
    data: null,
    metadata: null,
    items: [],
  },
  currentLists: [],
  fullGroceryLists: {},
  currentCategories: ["Bakery", "Dairy", "Produce", "Meat", "Pantry"],
  currentSections: [],
  selectedCategory: "Bakery",
  map: new Map(),
  currentForm: "",
};

export const createGroceryStore = (
  initState: GroceryState = defaultInitState
) =>
  create<GroceryStore>()(
    persist(
      (set, get) => ({
        ...initState,
        ...createGroceryActions(set, get),
      }),
      {
        name: "grocery-list-store",
        storage: createJSONStorage(() => sessionStorage),
        partialize: (state) => ({
          fullGroceryLists: state.fullGroceryLists,
        }),
        // need to figure out merging and rehydration
      }
    )
  );
