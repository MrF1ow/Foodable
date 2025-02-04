"use client";

import { type ReactNode, createContext, useRef, useContext } from "react";
import { useStore } from "zustand";

import {
  type SavedItemsStore,
  createSavedItemsStore,
} from "@/stores/saved/state";

export type SavedItemsStoreApi = ReturnType<typeof createSavedItemsStore>;

export const SavedItemsStoreContext = createContext<
  SavedItemsStoreApi | undefined
>(undefined);

export interface SavedItemsStoreProviderProps {
  children: ReactNode;
}

export const SavedItemsStoreProvider = ({
  children,
}: SavedItemsStoreProviderProps) => {
  const storeRef = useRef<SavedItemsStoreApi | undefined>(undefined);
  if (!storeRef.current) {
    storeRef.current = createSavedItemsStore();
  }

  return (
    <SavedItemsStoreContext.Provider value={storeRef.current}>
      {children}
    </SavedItemsStoreContext.Provider>
  );
};

export const useSavedItemsStore = <T,>(
  selector: (store: SavedItemsStore) => T
): T => {
  const context = useContext(SavedItemsStoreContext);

  if (!context) {
    throw new Error(
      "useSavedItemsStore must be used within a SavedItemsStoreProvider"
    );
  }

  return useStore(context, selector);
};
