import { create } from "zustand";

export type GeneralState = {
  currentPage: string;
  isMobile: boolean;
  recipePageFilters: {
    price: number;
    time: number;
    ingredients: number;
  };
};

export type GeneralActions = {
  setCurrentPage: (currentPage: string) => void;
  setIsMobile: (isMobile: boolean) => void;
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
      set((state) => ({ ...state, isMobile })),

    setRecipePageFilters: (filters: {
      price: number;
      time: number;
      ingredients: number;
    }) => set((state) => ({ ...state, recipePageFilters: filters })),
  }));
};
