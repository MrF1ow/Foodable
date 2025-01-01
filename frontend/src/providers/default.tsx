"use client";

import React, { useEffect } from "react";
import { ClerkProvider } from "@clerk/nextjs";
import { TanstackProvider } from "./tanstack-provider";
import { UserStoreProvider } from "./user-store-provider";

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
      <TanstackProvider>
        {/* UserStoreProvider handles client-side state */}
        <UserStoreProvider>{children}</UserStoreProvider>
      </TanstackProvider>
    </ClerkProvider>
  );
}
