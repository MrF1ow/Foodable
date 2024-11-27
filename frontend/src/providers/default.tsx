"use client";

import * as React from "react";
import { ClerkProvider } from "@clerk/nextjs";
import { TanstackProvider } from "./tanstack-provider";
import { UserStoreProvider } from "./user-store-provider";

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
