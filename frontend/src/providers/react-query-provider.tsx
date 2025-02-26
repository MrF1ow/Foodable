import React, { useRef, useEffect } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { getQueryClient } from "@/app/get-query-client";
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

  const queryClient = getQueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <Toast ref={toastRef} />
      {children}
    </QueryClientProvider>
  );
}
