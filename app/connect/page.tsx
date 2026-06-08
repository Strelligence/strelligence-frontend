"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Wallet,
  Shield,
  Zap,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ExternalLink,
} from "lucide-react";
import { useWallet } from "@/hooks/use-wallet";

export default function ConnectPage() {
  const router = useRouter();
  const {
    status,
    error,
    isConnected,
    isConnecting,
    isFreighterInstalled,
    shortAddress,
    connect,
  } = useWallet();

  // Redirect to dashboard once connected
  useEffect(() => {
    if (isConnected) {
      // Small delay so the user sees the success state
      const t = setTimeout(() => router.push("/dashboard"), 1200);
      return () => clearTimeout(t);
    }
  }, [isConnected, router]);

  const steps = [
    {
      icon: Shield,
      title: "Non-custodial",
      description: "We never hold your keys. Your wallet stays yours.",
    },
    {
      icon: Zap,
      title: "Instant sync",
      description:
        "Your transaction history is indexed immediately after connecting.",
    },
    {
      icon: Wallet,
      title: "Works with Freighter",
      description:
        "The official Stellar browser wallet. Secure and open-source.",
    },
  ];

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 py-16">
      {/* Card */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md rounded-2xl border border-outline-variant bg-surface-container-lowest p-8 shadow-xl"
      >
        {/* Logo */}
        <div className="mb-8 text-center">
          <span className="font-headline-md text-2xl font-bold text-primary">
            Strelligence
          </span>
          <p className="mt-2 text-body-md text-on-surface-variant">
            Connect your Stellar wallet to get started
          </p>
        </div>

        {/* Status area */}
        <AnimatePresence mode="wait">
          {isConnected ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-8 flex flex-col items-center gap-3 rounded-xl bg-primary/5 p-6 text-center"
            >
              <CheckCircle2 className="size-10 text-primary" />
              <div>
                <p className="font-label-lg text-on-surface">
                  Wallet connected
                </p>
                <p className="mt-1 font-mono text-sm text-on-surface-variant">
                  {shortAddress}
                </p>
              </div>
              <p className="text-body-sm text-on-surface-variant">
                Redirecting to your dashboard...
              </p>
            </motion.div>
          ) : (
            <motion.div key="connect" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {/* Not installed warning */}
              {!isFreighterInstalled && status !== "checking" && (
                <div className="mb-6 rounded-xl border border-error/20 bg-error-container/30 p-4">
                  <p className="text-body-sm text-on-surface">
                    Freighter wallet extension is not installed.
                  </p>
                  <a
                    href="https://freighter.app"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-flex items-center gap-1 text-label-sm text-primary hover:underline"
                  >
                    Install Freighter <ExternalLink className="size-3" />
                  </a>
                </div>
              )}

              {/* Error message */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 flex gap-3 rounded-xl border border-error/20 bg-error-container/30 p-4"
                >
                  <AlertCircle className="mt-0.5 size-4 shrink-0 text-error" />
                  <p className="text-body-sm text-on-surface">{error}</p>
                </motion.div>
              )}

              {/* Connect button */}
              <button
                onClick={connect}
                disabled={isConnecting}
                className="flex w-full items-center justify-center gap-2.5 rounded-xl bg-primary px-6 py-4 font-label-lg text-label-lg text-on-primary shadow-sm transition-all hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isConnecting ? (
                  <>
                    <Loader2 className="size-5 animate-spin" />
                    Connecting to Freighter...
                  </>
                ) : (
                  <>
                    <Wallet className="size-5" />
                    Connect Freighter Wallet
                  </>
                )}
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Steps */}
        {!isConnected && (
          <div className="mt-8 space-y-4 border-t border-outline-variant pt-6">
            {steps.map(({ icon: Icon, title, description }) => (
              <div key={title} className="flex gap-3">
                <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary-container/30">
                  <Icon className="size-4 text-primary" />
                </div>
                <div>
                  <p className="font-label-md text-label-md text-on-surface">
                    {title}
                  </p>
                  <p className="text-body-sm text-on-surface-variant">
                    {description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Footer note */}
      <p className="mt-6 text-center text-label-sm text-on-surface-variant">
        By connecting, you agree to our{" "}
        <a href="#" className="text-primary hover:underline">
          Terms of Service
        </a>{" "}
        and{" "}
        <a href="#" className="text-primary hover:underline">
          Privacy Policy
        </a>
        .
      </p>
    </div>
  );
}