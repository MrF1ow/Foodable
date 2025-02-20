import { create } from "zustand";

export type GeneralState = {
  currentPage: string;
  isMobile: boolean;
  splitLayout: boolean;
};

export type GeneralActions = {
  setCurrentPage: (currentPage: string) => void;
  setIsMobile: (isMobile: boolean) => void;
  setSplitLayout: (splitLayout: boolean) => void;
};

export type GeneralStore = GeneralState & GeneralActions;

export const initGeneralStore = (): GeneralState => {
  return {
    currentPage: "Recipes",
    isMobile: false,
    splitLayout: false,
  };
};

export const defaultInitState: GeneralState = {
  currentPage: "Recipes",
  isMobile: false,
  splitLayout: false,
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
  }));
};
