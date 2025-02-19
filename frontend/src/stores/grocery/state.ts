import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

import {
  GroceryItem,
  GroceryList,
  GrocerySectionOptions,
  NewGroceryList,
} from "@/types/grocery";
import {
  GroceryMetaData,
  SavedGroceryMetaData,
  UnsavedGroceryMetaData,
} from "@/types/saved";
import { convertAmount } from "@/utils/listItems";

export type GroceryState = {
  currentList: {
    data: GroceryList | NewGroceryList;
    metadata: GroceryMetaData | SavedGroceryMetaData | null;
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
  getCurrentMetadata: (
    id?: string
  ) => GroceryMetaData | SavedGroceryMetaData | undefined;
  getCurrentTitle: (id: string) => void;
  getCurrentData: (id?: string) => GroceryList | NewGroceryList | null;
  getCurrentItems: (id?: string) => GroceryItem[];

  setCurrentList: (list: GroceryMetaData) => void;
  setTitle: (title: string) => void;
  setItems: (items: GroceryItem[], id?: string) => void;
  addItem: (item: GroceryItem, id?: string) => void;
  removeItem: (name: string, id?: string) => void;
  replaceList: (id: string, newData: GroceryMetaData) => void;
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
  setNewCurrentList: (
    data?: GroceryList,
    metadata?: GroceryMetaData,
    items?: GroceryItem[]
  ) => void;
  setCurrentLists: (lists?: GroceryMetaData[]) => void;
  addList: (list: GroceryMetaData) => void;
  removeList: (id: string) => void;
  setCurrentGroceryListId: (id?: string) => void;

  fetchFullGroceryList: (id: string) => Promise<void>;
};

export const createGroceryActions = (set: any, get: any): GroceryActions => ({
  getCurrentMetadata: (
    id?: string
  ): GroceryMetaData | SavedGroceryMetaData | undefined => {
    if (!id) return get().currentLists[0];
    return get().currentLists.find(
      (list: GroceryMetaData) => list._id?.toString() === id
    );
  },

  getCurrentTitle: (id: string): string => {
    const list = get().currentLists.find(
      (list: GroceryMetaData) => list._id?.toString() === id
    );
    return list ? list.title : "";
  },

  getCurrentData: (id?: string): GroceryList | NewGroceryList | null => {
    console.log("Getting current data with id:", id);
    console.log("Current List:", get().currentList);
    if (!id) return get().currentList.data;
    console.log("Full Grocery Lists:", get().fullGroceryLists);
    return get().fullGroceryLists[id] as GroceryList;
  },

  getCurrentItems: (id?: string): GroceryItem[] => {
    if (!id) return get().currentList.data.items;
    const foundData = get().fullGroceryLists[id];
    return foundData ? foundData.items : [];
  },

  setCurrentList: (list: GroceryMetaData) =>
    set((state: GroceryState) => {
      return {
        ...state,
        currentList: {
          id: list._id?.toString(),
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
  setItems: (items: GroceryItem[], id?: string) =>
    set((state: GroceryState) => {
      const newMap = new Map<string, GroceryItem>();

      // Convert the items array to a map
      items.forEach((item) => {
        newMap.set(item.name.toLowerCase(), item);
      });

      if (!id) {
        return {
          ...state,
          currentList: {
            ...state.currentList,
            data: {
              ...state.currentList.data,
              items: items,
            },
          },
          map: newMap,
        };
      }

      return {
        ...state,
        currentList: {
          ...state.currentList,
          data: {
            ...state.currentList.data,
            items: items, // Update items based on the new items
          },
        },
        // Update the full grocery list with the new items
        fullGroceryLists: {
          ...state.fullGroceryLists,
          [id]: {
            ...state.fullGroceryLists[id],
            items: items,
          },
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

  addItem: (item: GroceryItem, id?: string) =>
    set((state: GroceryState) => {
      const itemKey = item.name.toLowerCase();
      const existingItem = state.map.get(itemKey);
      let newMap;
      let newItems;

      const items = get().currentList.data.items;

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

      console.log("New Items", newItems);

      if (!id) {
        return {
          ...state,
          currentList: {
            ...state.currentList,
            data: {
              ...state.currentList.data,
              items: newItems,
            },
          },
          map: newMap,
          currentSections: newSections,
        };
      }

      return {
        ...state,
        currentList: {
          ...state.currentList,
          data: {
            ...state.currentList.data,
            items: newItems,
          },
        },
        fullGroceryLists: {
          ...state.fullGroceryLists,
          [id]: {
            ...state.fullGroceryLists[id],
            items: newItems,
          },
        },
        map: newMap,
        currentSections: newSections,
      };
    }),

  removeItem: (name: string, id?: string) =>
    set((state: GroceryState) => {
      if (!state.map.has(name.toLowerCase())) return state; // Item not found

      const items = get().currentList.data.items;

      const newItems = items.filter(
        (item: GroceryItem) => item.name.toLowerCase() !== name.toLowerCase()
      );
      const newMap = new Map(state.map);
      newMap.delete(name.toLowerCase());

      if (!id) {
        return {
          ...state,
          currentList: {
            ...state.currentList,
            data: {
              ...state.currentList.data,
              items: newItems,
            },
          },
          map: newMap,
        };
      }

      return {
        ...state,
        currentList: {
          ...state.currentList,
          data: {
            ...state.currentList.data,
            items: newItems,
          },
        },
        fullGroceryLists: {
          ...state.fullGroceryLists,
          [id]: {
            ...state.fullGroceryLists[id],
            items: newItems,
          },
        },
        map: newMap,
      };
    }),

  replaceList: (id: string, newData: GroceryMetaData) =>
    set((state: GroceryState) => {
      const index = state.currentLists.findIndex(
        (list: GroceryMetaData) => list._id?.toString() === id
      );

      if (index === -1) return state;

      const newLists = [
        ...state.currentLists.slice(0, index),
        newData,
        ...state.currentLists.slice(index + 1),
      ];

      return {
        currentLists: newLists,
        currentList: {
          id: id,
          metadata: newData,
        },
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
        (list) => list._id?.toString() !== id.toString()
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
        (item: GroceryMetaData) => item._id?.toString() === id
      );
      const index = state.currentLists.findIndex(
        (item: GroceryMetaData) => item._id?.toString() === id
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
  // Set the current list to a new list
  setNewCurrentList: (data?: GroceryList, metadata?: GroceryMetaData) => {
    set({
      currentList: {
        data:
          data ||
          ({
            _id: null,
            title: "New List",
            creatorId: "000000000000000000000000",
            items: [],
          } as NewGroceryList),
        metadata:
          metadata ||
          ({
            type: "grocery",
            title: "New List",
            _id: null,
          } as GroceryMetaData),
      },
    });
  },
  // Set the current lists to the any lists passed in
  setCurrentLists: (lists) =>
    set({
      currentLists: [
        {
          type: "grocery",
          title: "New List",
          _id: null,
        } as UnsavedGroceryMetaData,
        ...(lists ?? []),
      ],
    }),

  addList: (list: GroceryMetaData) => {
    set((state: GroceryState) => {
      return {
        currentLists: [...state.currentLists, list],
      };
    });
  },

  removeList: (id: string) => {
    set((state: GroceryState) => {
      return {
        currentLists: state.currentLists.filter(
          (list: GroceryMetaData) => list._id?.toString() !== id
        ),
      };
    });
  },

  setCurrentGroceryListId: (id?: string) => {
    set((state: GroceryState) => {
      if (!id) {
        console.log("Setting current list to null");
        return {
          currentList: {
            data: {
              _id: null,
              title: "New List",
              creatorId: "000000000000000000000000",
              items: [],
            },
            metadata: {
              type: "grocery",
              title: "New List",
              _id: null,
            },
          },
        };
      }
      console.log("Setting current list to id:", id);
      const metadata = state.currentLists.find(
        (list: GroceryMetaData) => list._id?.toString() === id
      );
      return {
        currentList: { ...state.currentList, metadata },
      };
    });
  },

  fetchFullGroceryList: async (id: string) => {
    if (!id) return;

    console.log("Fetching grocery list with id:", id);
    if (get().fullGroceryLists[id]) {
      const metadata = get().currentLists.find(
        (list: GroceryMetaData) => list._id?.toString() === id
      );
      set((state: GroceryState) => ({
        currentList: { id: id, data: state.fullGroceryLists[id], metadata },
      }));
      console.log("Current List After Fetch from Cache:", get().currentList);
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
        currentList: {
          ...state.currentList,
          data: groceryList,
        },
      }));

      console.log("Current List After Fetch:", get().currentList);
    } catch (error) {
      console.error("Error fetching grocery list", error);
    }
  },
});

export type GroceryStore = GroceryState & GroceryActions;

export const initState: GroceryState = {
  currentList: {
    data: {
      _id: null,
      title: "New List",
      creatorId: "000000000000000000000000",
      items: [],
    },
    metadata: null,
  },
  currentLists: [],
  fullGroceryLists: {},
  currentCategories: [],
  currentSections: [],
  selectedCategory: "Bakery",
  map: new Map(),
  currentForm: "",
};

export const defaultInitState: GroceryState = {
  currentList: {
    data: {
      _id: null,
      title: "New List",
      creatorId: "000000000000000000000000",
      items: [],
    },
    metadata: {
      type: "grocery",
      title: "New List",
      _id: null,
    },
  },
  currentLists: [
    { type: "grocery", title: "New List", _id: null } as GroceryMetaData,
  ],
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
