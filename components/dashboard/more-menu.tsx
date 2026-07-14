"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Settings,
  KeyRound,
  Webhook,
  Repeat,
  LineChart,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const MORE_ITEMS = [
  { label: "Recurring Payments", href: "/dashboard/recurring", icon: Repeat },
  { label: "Cashflow", href: "/dashboard/cashflow", icon: LineChart },
  { label: "API Keys", href: "/dashboard/api-keys", icon: KeyRound },
  { label: "Webhooks", href: "/dashboard/webhooks", icon: Webhook },
  { label: "Settings", href: "/dashboard/settings", icon: Settings },
];

interface MoreMenuProps {
  open: boolean;
  onClose: () => void;
}

export function MoreMenu({ open, onClose }: MoreMenuProps) {
  const pathname = usePathname();

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm lg:hidden"
          />
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-x-0 bottom-0 z-50 max-h-[70vh] rounded-t-2xl bg-background border-t border-outline-variant lg:hidden overflow-y-auto"
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-outline-variant">
              <h2 className="font-headline-md text-base font-medium text-on-surface">
                More
              </h2>
              <button
                onClick={onClose}
                className="p-1 rounded-lg hover:bg-muted transition-colors"
              >
                <X className="size-5 text-on-surface-variant" />
              </button>
            </div>
            <nav className="p-2">
              {MORE_ITEMS.map(({ label, href, icon: Icon }) => {
                const isActive = pathname === href;
                return (
                  <Link
                    key={href}
                    href={href}
                    onClick={onClose}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition-colors",
                      isActive
                        ? "bg-primary/10 text-primary"
                        : "text-on-surface-variant hover:bg-muted hover:text-on-surface"
                    )}
                  >
                    <Icon className="size-5" />
                    {label}
                  </Link>
                );
              })}
            </nav>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
