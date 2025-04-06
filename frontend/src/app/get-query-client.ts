import { QueryClient } from "@tanstack/react-query";

// server-only
export function createServerQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000, // 1 minute
        gcTime: 60 * 1000 * 5, // 5 minutes
      },
    },
  });
}

let clientQueryClient: QueryClient | null = null;

export function getClientQueryClient() {
  if (!clientQueryClient) {
    clientQueryClient = new QueryClient({
      defaultOptions: {
        queries: {
          staleTime: 60 * 1000,
          gcTime: 60 * 1000 * 5,
        },
      },
    });
  }

  return clientQueryClient;
}
