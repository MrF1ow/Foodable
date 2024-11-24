"use client";

import * as React from "react";
import { ClerkProvider } from "@clerk/nextjs";
import { UserStoreProvider } from "@/providers/user-store-provider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <UserStoreProvider>{children}</UserStoreProvider>
    </ClerkProvider>
  );
}
