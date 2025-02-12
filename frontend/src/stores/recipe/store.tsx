"use client";

import { type ReactNode, createContext, useRef, useContext } from "react";
import { useStore } from "zustand";

import { type RecipeStore, createRecipeStore } from "@/stores/recipe/state";

export type RecipeStoreApi = ReturnType<typeof createRecipeStore>;

export const RecipeStoreContext = createContext<RecipeStoreApi | undefined>(
  undefined
);

export interface RecipeStoreProviderProps {
  children: ReactNode;
}

export const RecipeStoreProvider = ({ children }: RecipeStoreProviderProps) => {
  const storeRef = useRef<RecipeStoreApi | undefined>(undefined);
  if (!storeRef.current) {
    storeRef.current = createRecipeStore();
  }

  return (
    <RecipeStoreContext.Provider value={storeRef.current}>
      {children}
    </RecipeStoreContext.Provider>
  );
};

export const useRecipeStore = <T,>(selector: (store: RecipeStore) => T): T => {
  const context = useContext(RecipeStoreContext);

  if (!context) {
    throw new Error("useRecipeStore must be used within a RecipeStoreProvider");
  }

  return useStore(context, selector);
};




