"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertCircle, Home, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ErrorPage({
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
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 text-center">
      <div className="flex size-16 items-center justify-center rounded-full bg-destructive/10 mb-6">
        <AlertCircle className="size-8 text-destructive" />
      </div>
      <h1 className="font-headline-md text-xl font-bold text-on-surface mb-2">
        Something went wrong
      </h1>
      <p className="text-sm text-on-surface-variant max-w-md mb-8">
        {error.message ?? "An unexpected error occurred. Please try again."}
      </p>
      <div className="flex gap-3">
        <Button variant="outline" onClick={reset} className="gap-1.5">
          <RefreshCw className="size-4" />
          Try Again
        </Button>
        <Link href="/">
          <Button className="gap-1.5">
            <Home className="size-4" />
            Go Home
          </Button>
        </Link>
      </div>
    </div>
  );
}
