"use client";

import * as React from "react";
import { ClerkProvider } from "@clerk/nextjs";
import { TanstackProvider } from "@/app/providers/tanstack-provider";
import { UserStoreProvider } from "@/app/providers/user-store-provider";

export function Providers({ children }: { children: React.ReactNode }) {
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
