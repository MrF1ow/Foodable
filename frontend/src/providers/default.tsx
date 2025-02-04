"use client";

import React, { useEffect } from "react";
import { ThemeProvider } from "next-themes";
import { ClerkProvider } from "@clerk/nextjs";
import { TanstackProvider } from "./tanstack-provider";
import { ReactQueryProvider } from "./react-query-provider";
import { UserStoreProvider } from "@/stores/user/store";
import { GeneralStoreProvider } from "@/stores/general/store";
import { GroceryStoreProvider } from "@/stores/grocery/store";
import { RecipeStoreProvider } from "@/stores/recipe/store";
import { SavedItemsStoreProvider } from "@/stores/saved/store";

export function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Initialize theme based on localStorage or system preference
    const storedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;

    if (storedTheme === "dark" || (!storedTheme && prefersDark)) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

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
