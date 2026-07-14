"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertCircle, Home, RefreshCw, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="flex size-16 items-center justify-center rounded-full bg-destructive/10 mb-6">
        <AlertCircle className="size-8 text-destructive" />
      </div>
      <h1 className="font-headline-md text-xl font-bold text-on-surface mb-2">
        Dashboard Error
      </h1>
      <p className="text-sm text-on-surface-variant max-w-md mb-8">
        {error.message ?? "Something went wrong in the dashboard."}
      </p>
      <div className="flex gap-3">
        <Button variant="outline" onClick={reset} className="gap-1.5">
          <RefreshCw className="size-4" />
          Try Again
        </Button>
        <Link href="/dashboard">
          <Button variant="outline" className="gap-1.5">
            <LayoutDashboard className="size-4" />
            Dashboard
          </Button>
        </Link>
        <Link href="/">
          <Button className="gap-1.5">
            <Home className="size-4" />
            Home
          </Button>
        </Link>
      </div>
    </div>
  );
}
