"use client";

import { type ReactNode, createContext, useRef, useContext } from "react";
import { useStore } from "zustand";

import { type GeneralStore, createGeneralStore } from "@/stores/general/state";

export type GeneralStoreApi = ReturnType<typeof createGeneralStore>;

export const GeneralStoreContext = createContext<GeneralStoreApi | undefined>(
  undefined
);

export interface GeneralStoreProviderProps {
  children: ReactNode;
}

export const GeneralStoreProvider = ({
  children,
}: GeneralStoreProviderProps) => {
  const storeRef = useRef<GeneralStoreApi | undefined>(undefined);
  if (!storeRef.current) {
    storeRef.current = createGeneralStore();
  }

  return (
    <GeneralStoreContext.Provider value={storeRef.current}>
      {children}
    </GeneralStoreContext.Provider>
  );
};

export const useGeneralStore = <T,>(
  selector: (store: GeneralStore) => T
): T => {
  const context = useContext(GeneralStoreContext);

  if (!context) {
    throw new Error(
      "useGeneralStore must be used within a GeneralStoreProvider"
    );
  }

  return useStore(context, selector);
};
