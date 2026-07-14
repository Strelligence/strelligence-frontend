"use client";

import { Component, type ReactNode } from "react";
import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;

      return (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="flex size-12 items-center justify-center rounded-full bg-destructive/10 mb-4">
            <AlertCircle className="size-6 text-destructive" />
          </div>
          <h3 className="text-sm font-medium text-on-surface mb-1">
            Something went wrong
          </h3>
          <p className="text-xs text-on-surface-variant max-w-sm mb-4">
            {this.state.error?.message ?? "An unexpected error occurred"}
          </p>
          <Button variant="outline" size="sm" onClick={this.handleRetry} className="gap-1.5">
            <RefreshCw className="size-3.5" />
            Try Again
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}
