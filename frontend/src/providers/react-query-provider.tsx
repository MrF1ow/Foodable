import React, { useRef, useEffect } from "react";
import {
  MutationCache,
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { Toast } from "primereact/toast";
import { TOAST_SEVERITY } from "@/lib/constants/ui";

let globalToast: React.RefObject<Toast | null> = { current: null };

export const showToast = (
  severity: TOAST_SEVERITY,
  summary: string,
  detail: string,
  life: number = 5000
) => {
  globalToast?.current?.show({ severity, summary, detail, life });
};

export function ReactQueryProvider({ children }: React.PropsWithChildren) {
  const toastRef = useRef<Toast | null>(null);

  useEffect(() => {
    globalToast = toastRef; // Assign global reference when component mounts
    return () => {
      globalToast.current = null; // Cleanup to prevent memory leaks
    };
  }, []);

  const queryClient = new QueryClient({
    queryCache: new QueryCache({
      onError: (error: any) => {
        console.error(JSON.stringify(error));
      },
    }),
    mutationCache: new MutationCache({
      onError: (error: any) => {
        console.error(JSON.stringify(error));
      },
    }),
  });

  return (
    <QueryClientProvider client={queryClient}>
      <Toast ref={toastRef} />
      {children}
    </QueryClientProvider>
  );
}
