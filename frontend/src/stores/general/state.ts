import { create } from "zustand";

export type GeneralState = {
  currentPage: string;
  isMobile: boolean;
};

export type GeneralActions = {
  setCurrentPage: (currentPage: string) => void;
  setIsMobile: (isMobile: boolean) => void;
};

export type GeneralStore = GeneralState & GeneralActions;

export const initGeneralStore = (): GeneralState => {
  return {
    currentPage: "Recipes",
    isMobile: false,
  };
};

export const defaultInitState: GeneralState = {
  currentPage: "Recipes",
  isMobile: false,
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
  }));
};
