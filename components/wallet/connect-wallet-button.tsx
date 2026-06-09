"use client";

import { Wallet, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import { useWallet } from "@/hooks/use-wallet";
import { cn } from "@/lib/utils";
import { STELLAR_WALLET_INSTALL_URL } from "@/lib/stellar-wallet";

interface ConnectWalletButtonProps {
  /** Visual variant */
  variant?: "primary" | "outline" | "ghost";
  /** Full width */
  fullWidth?: boolean;
  className?: string;
  /** Called after successful connection (before backend JWT exchange) */
  onConnected?: (address: string) => void;
}

export function ConnectWalletButton({
  variant = "primary",
  fullWidth = false,
  className,
  onConnected,
}: ConnectWalletButtonProps) {
  const {
    shortAddress,
    status,
    error,
    isConnected,
    isConnecting,
    hasStellarWallet,
    connect,
    disconnect,
  } = useWallet();

  const handleClick = async () => {
    if (isConnected) {
      disconnect();
      return;
    }
    const connectedAddress = await connect();
    if (connectedAddress && onConnected) {
      onConnected(connectedAddress);
    }
  };

  const base =
    "inline-flex items-center justify-center gap-2 rounded-xl font-label-lg text-label-lg transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-pointer";

  const variants = {
    primary:
      "bg-primary text-on-primary hover:bg-primary/90 shadow-sm px-6 py-3",
    outline:
      "border border-outline bg-transparent text-on-surface hover:bg-surface-container px-6 py-3",
    ghost:
      "text-primary hover:bg-primary-container/20 px-4 py-2",
  };

  const widthClass = fullWidth ? "w-full" : "";

  // No supported Stellar wallet detected in this browser.
  if (!hasStellarWallet && status !== "checking" && status !== "idle") {
    return (
      <a
        href={STELLAR_WALLET_INSTALL_URL}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(base, variants[variant], widthClass, className)}
      >
        <AlertCircle className="size-4" />
        Install Stellar wallet
      </a>
    );
  }

  return (
    <div className={cn("flex flex-col gap-1", fullWidth && "w-full")}>
      <button
        onClick={handleClick}
        disabled={isConnecting}
        className={cn(base, variants[variant], widthClass, className)}
      >
        {isConnecting ? (
          <Loader2 className="size-4 animate-spin" />
        ) : isConnected ? (
          <CheckCircle2 className="size-4" />
        ) : (
          <Wallet className="size-4" />
        )}

        {isConnecting
          ? "Connecting..."
          : isConnected
          ? shortAddress
          : "Connect Wallet"}
      </button>

      {/* Inline error message */}
      {error && status === "error" && (
        <p className="flex items-center gap-1.5 text-label-sm text-error">
          <AlertCircle className="size-3.5 shrink-0" />
          {error}
        </p>
      )}
    </div>
  );
}
