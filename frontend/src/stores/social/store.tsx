"use client";

import { type ReactNode, createContext, useRef, useContext } from "react";
import { useStore } from "zustand";

import { type SocialStore, createSocialStore } from "@/stores/social/state";

export type SocialStoreApi = ReturnType<typeof createSocialStore>;

export const SocialStoreContext = createContext<SocialStoreApi | undefined>(
  undefined
);

export interface SocialStoreProviderProps {
  children: ReactNode;
}

export const SocialStoreProvider = ({ children }: SocialStoreProviderProps) => {
  const storeRef = useRef<SocialStoreApi | undefined>(undefined);
  if (!storeRef.current) {
    storeRef.current = createSocialStore();
  }

  return (
    <SocialStoreContext.Provider value={storeRef.current}>
      {children}
    </SocialStoreContext.Provider>
  );
};

export const useSocialStore = <T,>(
  selector: (store: SocialStore) => T
): T => {
  const context = useContext(SocialStoreContext);

  if (!context) {
    throw new Error(
      "useSocialStore must be used within a SocialStoreProvider"
    );
  }

  return useStore(context, selector);
};
