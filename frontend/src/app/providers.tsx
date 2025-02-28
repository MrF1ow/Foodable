"use client";

import { UserStoreProvider } from "@/stores/user/store";
import { GeneralStoreProvider } from "@/stores/general/store";
import { GroceryStoreProvider } from "@/stores/grocery/store";
import { RecipeStoreProvider } from "@/stores/recipe/store";
import { SavedItemsStoreProvider } from "@/stores/saved/store";
import { ThemeProvider } from "@/providers/theme-provider";
import { ReactQueryProvider } from "@/providers/react-query-provider";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ReactQueryProvider>
      <GeneralStoreProvider>
        <SavedItemsStoreProvider>
          <RecipeStoreProvider>
            <GroceryStoreProvider>
              {/* UserStoreProvider handles client-side state */}
              <UserStoreProvider>
                <ThemeProvider
                  attribute="class"
                  defaultTheme="system"
                  enableSystem
                  disableTransitionOnChange
                >
                  {children}
                </ThemeProvider>
              </UserStoreProvider>
            </GroceryStoreProvider>
          </RecipeStoreProvider>
        </SavedItemsStoreProvider>
      </GeneralStoreProvider>
    </ReactQueryProvider>
  );
}
