"use client";

import { type ReactNode, createContext, useRef, useContext } from "react";
import { useStore } from "zustand";

import { type UserStore, createUserStore, defaultInitState } from "@/stores/user/state";

export type UserStoreApi = ReturnType<typeof createUserStore>;

export const UserStoreContext = createContext<UserStoreApi | undefined>(
  undefined
);

export interface UserStoreProviderProps {
  children: ReactNode;
  isUser?: boolean;
}

export const UserStoreProvider = ({ children, isUser = false }: UserStoreProviderProps) => {
  const storeRef = useRef<UserStoreApi | undefined>(undefined);
  if (!storeRef.current) {
    const initialState = {
      ...defaultInitState,
      isUser,
    }
    storeRef.current = createUserStore(initialState);
  }

  return (
    <UserStoreContext.Provider value={storeRef.current}>
      {children}
    </UserStoreContext.Provider>
  );
};

export const useUserStore = <T,>(selector: (store: UserStore) => T): T => {
  const context = useContext(UserStoreContext);

  if (!context) {
    throw new Error("useUserStore must be used within a UserStoreProvider");
  }

  return useStore(context, selector);
};
