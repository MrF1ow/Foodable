import { create } from "zustand";

export type GeneralState = {
  currentPage: string;
  isMobile: boolean;
  splitLayout: boolean;
  clerkVariables: any;
  zipCode: string;
};

export type GeneralActions = {
  setCurrentPage: (currentPage: string) => void;
  setIsMobile: (isMobile: boolean) => void;
  setSplitLayout: (splitLayout: boolean) => void;
  setClerkVariables: (clerkVariables: any) => void;
  setZipCode: (zipCode: string) => void;
};

export type GeneralStore = GeneralState & GeneralActions;

export const defaultInitState: GeneralState = {
  currentPage: "Recipes",
  isMobile: false,
  splitLayout: false,
  clerkVariables: {},
  zipCode: "97330",
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

    setClerkVariables: (clerkVariables: any) =>
      set((state) => ({ ...state, clerkVariables })),
    setZipCode: (zipCode: string) => set((state) => ({ ...state, zipCode })),
  }));
};
