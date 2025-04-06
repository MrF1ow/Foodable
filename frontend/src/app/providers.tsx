"use client";

import { UserStoreProvider } from "@/stores/user/store";
import { GeneralStoreProvider } from "@/stores/general/store";
import { GroceryStoreProvider } from "@/stores/grocery/store";
import { RecipeStoreProvider } from "@/stores/recipe/store";
import { SavedItemsStoreProvider } from "@/stores/saved/store";
import { ThemeProvider } from "@/providers/theme-provider";
import { ReactQueryProvider } from "@/providers/react-query-provider";
import { Toast } from "primereact/toast";
import { TOAST_SEVERITY } from "@/lib/constants/ui";
import { useEffect, useRef } from "react";

let globalToast: React.RefObject<Toast | null> = { current: null };

export const showToast = (
  severity: TOAST_SEVERITY,
  summary: string,
  detail: string,
  life: number = 5000
) => {
  globalToast?.current?.show({ severity, summary, detail, life });
};

export default function Providers({ children }: { children: React.ReactNode }) {
  const toastRef = useRef<Toast | null>(null);
  useEffect(() => {
    globalToast = toastRef; // Assign global reference when component mounts
    return () => {
      globalToast.current = null; // Cleanup to prevent memory leaks
    };
  }, []);
  return (
    <ReactQueryProvider>
      {/* GeneralStoreProvider handles global state */}
      {/* SavedItemsStoreProvider handles saved items state */}
      {/* RecipeStoreProvider handles recipe state */}
      {/* GroceryStoreProvider handles grocery list state */}
      {/* UserStoreProvider handles client-side state */}
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
                  <Toast ref={toastRef} />
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
