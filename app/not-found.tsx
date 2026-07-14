"use client";

import Link from "next/link";
import { FileQuestion, Home, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 text-center">
      <div className="flex size-16 items-center justify-center rounded-full bg-muted mb-6">
        <FileQuestion className="size-8 text-on-surface-variant" />
      </div>
      <h1 className="font-headline-md text-xl font-bold text-on-surface mb-2">
        Page not found
      </h1>
      <p className="text-sm text-on-surface-variant max-w-md mb-8">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <div className="flex gap-3">
        <Button variant="outline" onClick={() => window.history.back()} className="gap-1.5">
          <ArrowLeft className="size-4" />
          Go Back
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
