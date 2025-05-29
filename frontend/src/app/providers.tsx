"use client";

import { UserStoreProvider } from "@/stores/user/store";
import { GeneralStoreProvider } from "@/stores/general/store";
import { GroceryStoreProvider } from "@/stores/grocery/store";
import { RecipeStoreProvider } from "@/stores/recipe/store";
import { SavedItemsStoreProvider } from "@/stores/saved/store";
import { SocialStoreProvider } from "@/stores/social/store";
import { ThemeProvider } from "@/providers/theme-provider";
import { ReactQueryProvider } from "@/providers/react-query-provider";
import { Toast } from "primereact/toast";
import { TOAST_SEVERITY } from "@/lib/constants/ui";
import { useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";

let globalToast: React.RefObject<Toast | null> = { current: null };

const severityStyles = {
  [TOAST_SEVERITY.SUCCESS]:
    "bg-green-100 text-green-800 border border-green-300",
  [TOAST_SEVERITY.ERROR]: "bg-red-100 text-red-800 border border-red-300",
  [TOAST_SEVERITY.INFO]: "bg-blue-100 text-blue-800 border border-blue-300",
  [TOAST_SEVERITY.WARN]:
    "bg-yellow-100 text-yellow-800 border border-yellow-300",
  [TOAST_SEVERITY.SECONDARY]:
    "bg-gray-100 text-gray-800 border border-gray-300",
  [TOAST_SEVERITY.CONTRAST]: "bg-black text-white border border-white",
};

export const showToast = (
  severity: TOAST_SEVERITY,
  summary: string,
  detail: string,
  life: number = 5000,
) => {
  if (globalToast?.current) {
    globalToast.current.clear();
    globalToast.current.show({
      severity,
      summary,
      detail,
      life,
      closable: false, // Disable the default X button
      content: (
        <div
          className={`relative p-4 rounded-md shadow-md w-full max-w-sm border ${severityStyles[severity]}`}
        >
          <button
            onClick={() => globalToast.current?.clear()}
            className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
          >
            &times;
          </button>
          <strong className="block font-semibold">{summary}</strong>
          <p className="text-sm mt-1">{detail}</p>
        </div>
      ),
    });
  }
};

export default function Providers({
  children,
  isUser,
}: {
  children: React.ReactNode;
  isUser: boolean;
}) {
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
        <UserStoreProvider isUser={isUser}>
          <SocialStoreProvider>
            <SavedItemsStoreProvider>
              <RecipeStoreProvider>
                <GroceryStoreProvider>
                  {/* UserStoreProvider handles client-side state */}
                  <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                    disableTransitionOnChange
                  >
                    <Toast ref={toastRef} />
                    {children}
                  </ThemeProvider>
                </GroceryStoreProvider>
              </RecipeStoreProvider>
            </SavedItemsStoreProvider>
          </SocialStoreProvider>
        </UserStoreProvider>
      </GeneralStoreProvider>
    </ReactQueryProvider>
  );
}
