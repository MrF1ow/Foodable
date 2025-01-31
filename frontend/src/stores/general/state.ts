import { create } from "zustand";

export type GeneralState = {
  currentPage: string;
  isMobile: boolean;
  splitLayout: boolean;
  recipePageFilters: {
    price: number;
    time: number;
    ingredients: number;
  };
};

export type GeneralActions = {
  setCurrentPage: (currentPage: string) => void;
  setIsMobile: (isMobile: boolean) => void;
  setSplitLayout: (splitLayout: boolean) => void;
  setRecipePageFilters: (filters: {
    price: number;
    time: number;
    ingredients: number;
  }) => void;
};

export type GeneralStore = GeneralState & GeneralActions;

export const initGeneralStore = (): GeneralState => {
  return {
    currentPage: "Recipes",
    isMobile: false,
    splitLayout: false,
    recipePageFilters: {
      price: 0,
      time: 0,
      ingredients: 0,
    },
  };
};

export const defaultInitState: GeneralState = {
  currentPage: "Recipes",
  isMobile: false,
  splitLayout: false,
  recipePageFilters: {
    price: 0,
    time: 0,
    ingredients: 0,
  },
};

export const createGeneralStore = (
  initState: GeneralState = defaultInitState
) => {
  return create<GeneralStore>()((set) => ({
    ...initState,

    // Define actions as part of the store
    setCurrentPage: (currentPage: string) =>
      set((state) => ({ ...state, currentPage })),

    setIsMobile: (isMobile: boolean) =>
      set((state) => ({
        ...state,
        isMobile,
        splitLayout: isMobile ? false : state.splitLayout, // Ensure splitLayout is false when isMobile is true
      })),

    setSplitLayout: (splitLayout: boolean) =>
      set((state) => ({
        ...state,
        splitLayout: state.isMobile ? false : splitLayout, // Prevent enabling splitLayout if isMobile is true
      })),

    setRecipePageFilters: (filters: {
      price: number;
      time: number;
      ingredients: number;
    }) => set((state) => ({ ...state, recipePageFilters: filters })),
  }));
};
