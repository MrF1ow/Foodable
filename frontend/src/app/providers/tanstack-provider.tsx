"use client";

import React, { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

interface TanstackProviderProps {
  children: React.ReactNode;
}

export const TanstackProvider = ({
  children,
}: TanstackProviderProps): JSX.Element => {
  // Create a new query client for each instance of the provider
  const [queryClient] = useState(() => new QueryClient());
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};
