import { createContext, useContext, useState } from "react";
import { useStore } from "zustand";
import { createGroceryStore, type GroceryStore } from "@/stores/grocery/state";

export type GroceryStoreApi = ReturnType<typeof createGroceryStore>;

const GroceryStoreContext = createContext<GroceryStoreApi | undefined>(
  undefined
);

export const GroceryStoreProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [store] = useState(() => createGroceryStore());

  return (
    <GroceryStoreContext.Provider value={store}>
      {children}
    </GroceryStoreContext.Provider>
  );
};

export const useGroceryStore = <T,>(
  selector: (state: GroceryStore) => T
): T => {
  const store = useContext(GroceryStoreContext);
  if (!store) {
    throw new Error(
      "useGroceryStore must be used within a GroceryStoreProvider"
    );
  }
  return useStore(store, selector);
};
