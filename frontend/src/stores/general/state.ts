import { FormName } from "@/lib/constants/forms";
import { create } from "zustand";

export type GeneralState = {
  currentPage: string;
  showPortal: boolean;
  showMainPortal: boolean;
  currentForm: FormName | null;
  isMobile: boolean;
  splitLayout: boolean;
  clerkVariables: any;
  zipCode: string;
};

export type GeneralActions = {
  setCurrentPage: (currentPage: string) => void;
  setShowPortal: (showPortal: boolean) => void;
  setShowMainPortal: (showMainPortal: boolean) => void;
  setCurrentForm: (currentForm: FormName | null) => void;
  resetCurrentForm: () => void;
  setIsMobile: (isMobile: boolean) => void;
  setSplitLayout: (splitLayout: boolean) => void;
  setClerkVariables: (clerkVariables: any) => void;
  setZipCode: (zipCode: string) => void;
};

export const createGeneralActions = (set: any): GeneralActions => ({
  // Define actions as part of the store
  setCurrentPage: (currentPage: string) =>
    set((state: GeneralState) => ({ ...state, currentPage })),

  setShowPortal: (showPortal: boolean) =>
    set((state: GeneralState) => ({ ...state, showPortal })),

  setShowMainPortal: (showMainPortal: boolean) =>
    set((state: GeneralState) => ({ ...state, showMainPortal })),

  setCurrentForm: (currentForm: FormName | null) =>
    set((state: GeneralState) => ({ ...state, currentForm })),

  resetCurrentForm: () =>
    set((state: GeneralState) => ({ ...state, currentForm: null })),

  setIsMobile: (isMobile: boolean) =>
    set((state: GeneralState) => ({
      ...state,
      isMobile,
      splitLayout: isMobile ? false : state.splitLayout, // Ensure splitLayout is false when isMobile is true
    })),

  setSplitLayout: (splitLayout: boolean) =>
    set((state: GeneralState) => ({
      ...state,
      splitLayout: state.isMobile ? false : splitLayout, // Prevent enabling splitLayout if isMobile is true
    })),

  setClerkVariables: (clerkVariables: any) =>
    set((state: GeneralState) => ({ ...state, clerkVariables })),
  setZipCode: (zipCode: string) =>
    set((state: GeneralState) => ({ ...state, zipCode })),
});

export type GeneralStore = GeneralState & GeneralActions;

export const defaultInitState: GeneralState = {
  currentPage: "Recipes",
  showPortal: false,
  showMainPortal: false,
  currentForm: null,
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
    ...createGeneralActions(set),
  }));
};
