"use client";

import React from "react";
import { ThemeProvider } from "next-themes";
import { ClerkProvider } from "@clerk/nextjs";
import { ReactQueryProvider } from "./react-query-provider";
import { UserStoreProvider } from "@/stores/user/store";
import { GeneralStoreProvider } from "@/stores/general/store";
import { GroceryStoreProvider } from "@/stores/grocery/store";
import { RecipeStoreProvider } from "@/stores/recipe/store";
import { SavedItemsStoreProvider } from "@/stores/saved/store";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      {/* TanstackProvider handles server-side state */}
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
    </ClerkProvider>
  );
}
