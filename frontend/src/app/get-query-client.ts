import { isServer, QueryClient } from "@tanstack/react-query";

let browserQueryClient: QueryClient | null = null;

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000, // 1 minute
        gcTime: 60 * 1000 * 5, // 5 minutes
      },
    },
  });
}

export function getQueryClient() {
  // If we're on the server, create a new query client
  if (isServer) {
    browserQueryClient = makeQueryClient();
    return browserQueryClient;
  } else {
    if (!browserQueryClient) browserQueryClient = makeQueryClient();
    return browserQueryClient;
  }
}
