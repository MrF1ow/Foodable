"use client";

import { type ReactNode, createContext, useRef, useContext } from "react";
import { useStore } from "zustand";

import { type GroceryStore, createGroceryStore } from "@/stores/grocery/state";

export type GroceryStoreApi = ReturnType<typeof createGroceryStore>;

export const GroceryStoreContext = createContext<GroceryStoreApi | undefined>(
  undefined
);

export interface GroceryStoreProviderProps {
  children: ReactNode;
}

export const GroceryStoreProvider = ({
  children,
}: GroceryStoreProviderProps) => {
  const storeRef = useRef<GroceryStoreApi | undefined>(undefined);
  if (!storeRef.current) {
    storeRef.current = createGroceryStore();
  }

  return (
    <GroceryStoreContext.Provider value={storeRef.current}>
      {children}
    </GroceryStoreContext.Provider>
  );
};

export const useGroceryStore = <T,>(
  selector: (store: GroceryStore) => T
): T => {
  const context = useContext(GroceryStoreContext);

  if (!context) {
    throw new Error(
      "useGroceryStore must be used within a GroceryStoreProvider"
    );
  }

  return useStore(context, selector);
};
