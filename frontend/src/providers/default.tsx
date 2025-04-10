import React from "react";
import { ReactQueryProvider } from "./react-query-provider";
import { UserStoreProvider } from "@/stores/user/store";
import { GeneralStoreProvider } from "@/stores/general/store";
import { GroceryStoreProvider } from "@/stores/grocery/store";
import { RecipeStoreProvider } from "@/stores/recipe/store";
import { SavedItemsStoreProvider } from "@/stores/saved/store";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ReactQueryProvider>
      <GeneralStoreProvider>
        <SavedItemsStoreProvider>
          <RecipeStoreProvider>
            <GroceryStoreProvider>
              {/* UserStoreProvider handles client-side state */}
              <UserStoreProvider>{children}</UserStoreProvider>
            </GroceryStoreProvider>
          </RecipeStoreProvider>
        </SavedItemsStoreProvider>
      </GeneralStoreProvider>
    </ReactQueryProvider>
  );
}
