import { create } from "zustand";

import {
  GroceryItem,
  GroceryList,
  GrocerySectionOptions,
} from "@/types/grocery";
import { GroceryMetaData } from "@/types/saved";
import { convertAmount } from "@/utils/listItems";

export type GroceryState = {
  title: string;
  items: GroceryItem[];
  currentCategories: GrocerySectionOptions[];
  map: Map<string, GroceryItem>;
  currentForm: string;
  currentSections: GrocerySectionOptions[];
  selectedCategory: GrocerySectionOptions;
  currentLists: GroceryMetaData[]; //keep track of all of the lists
  groceryLists: GroceryList[]; //all of the information from each list
  currentList: GroceryMetaData | null;
  listDeleted: boolean;
};

export type GroceryActions = {
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
  removeCurrentList: (currentList: string) => void;
  setListDeleted: (listDeleted: boolean) => void;
  updateCurrentListItem(index: number, currentListTitle: string): void;
  setCurrentLists: (lists: GroceryMetaData[]) => void;
  setCurrentList: (list: GroceryMetaData) => void;
  setCurrentGroceryLists: (lists: GroceryList[]) => void;
};

export const createGroceryActions = (set: any): GroceryActions => ({
  setTitle: (title: string) =>
    set((state: GroceryState) => ({ ...state, title })),
  setItems: (items: GroceryItem[]) =>
    set((state: GroceryState) => {
      const newMap = new Map<string, GroceryItem>();

      // Convert the items array to a map
      items.forEach((item) => {
        newMap.set(item.name.toLowerCase(), item);
      });

      return {
        ...state,
        items, // Update items
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

      if (existingItem) {
        const convertedQuantity = convertAmount(
          item.quantity,
          item.unit,
          existingItem.unit
        );
        existingItem.quantity += convertedQuantity;
        newMap = new Map(state.map);
        newMap.set(itemKey, existingItem);

        newItems = state.items.map((i) =>
          i.name.toLowerCase() === itemKey ? existingItem : i
        );
      } else {
        item.checked = false;
        newItems = [...state.items, item];
        newMap = new Map(state.map).set(itemKey, item);
      }
      const newSections = state.currentSections.includes(item.category)
        ? state.currentSections
        : [...state.currentSections, item.category];

      return {
        ...state,
        items: newItems,
        map: newMap,
        currentSections: newSections,
      };
    }),

  removeItem: (name: string) =>
    set((state: GroceryState) => {
      if (!state.map.has(name.toLowerCase())) return state; // Item not found

      const newItems = state.items.filter(
        (item) => item.name.toLowerCase() !== name.toLowerCase()
      );
      const newMap = new Map(state.map);
      newMap.delete(name.toLowerCase());

      return {
        ...state,
        items: newItems,
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
  removeCurrentList: (currentList: string) =>
    set((state: GroceryState) => {
      const newCurrentLists = state.currentLists.filter(
        (list) => list.title.toLowerCase() !== currentList.toLowerCase()
      );

      const updatedGroceryLists = state.groceryLists.filter(
        (item) => item.title.toLowerCase() !== currentList.toLowerCase()
      );

      return {
        currentLists: newCurrentLists,
        savedItems: updatedGroceryLists,
      };
    }),
  setListDeleted: (bool: boolean) => set({ listDeleted: bool }),
  updateCurrentListItem: (index: number, currentListTitle: string) =>
    set((state: GroceryState) => {
      const newCurrentLists = [...state.currentLists];
      const newTitle = currentListTitle;

      newCurrentLists[index].title = newTitle;

      const updatedGroceryLists = state.groceryLists.map((item) =>
        item.title === state.currentLists[index].title
          ? { ...item, category: newTitle }
          : item
      );
      set({ currentList: newCurrentLists[index] });

      return {
        currentLists: newCurrentLists,
        groceryLists: updatedGroceryLists,
      };
    }),
  setCurrentLists: (lists) =>
    set({
      currentLists: [
        { title: "New List", _id: undefined, category: "" },
        ...lists,
      ],
    }),
  setCurrentList: (list: GroceryMetaData) => {
    console.log("Setting current list:", list);
    set((state: GroceryState) => ({ ...state, currentList: list }));
  },
  setCurrentGroceryLists: (lists) => set({ groceryLists: lists }),
});

export type GroceryStore = GroceryState & GroceryActions;

export const defaultInitState: GroceryState = {
  title: "",
  items: [],
  currentForm: "",
  currentCategories: ["Bakery", "Dairy", "Produce", "Meat", "Pantry"],
  currentSections: [],
  map: new Map(),
  selectedCategory: "Bakery",
  currentLists: [],
  groceryLists: [],
  currentList: null,
  listDeleted: false,
};

export const createGroceryStore = (
  initState: GroceryState = defaultInitState
) => {
  return create<GroceryStore>((set) => ({
    ...initState,
    ...createGroceryActions(set),
  }));
};
