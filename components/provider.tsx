"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import { useState, useEffect } from "react";
import { useAuthStore } from "@/store/auth.store";

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 30_000,     // 30s
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  const [mounted, setMounted] = useState(false);

  // Initialize Zustand store hydration and check Freighter on mount
  useEffect(() => {
    setMounted(true);
    // Trigger Freighter check when the app mounts (handled by useWallet hook in individual components)
  }, []);

  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <Toaster
        position="bottom-right"
        toastOptions={{
          classNames: {
            toast:
              "rounded-xl border border-outline-variant bg-surface-container-lowest text-on-surface shadow-lg",
            title: "font-label-md text-label-md",
            description: "text-body-sm text-on-surface-variant",
            success: "border-primary/20",
            error: "border-error/20",
          },
        }}
      />
    </QueryClientProvider>
  );
}