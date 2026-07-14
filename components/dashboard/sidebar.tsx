"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  ArrowLeftRight,
  Lightbulb,
  Repeat,
  LineChart,
  KeyRound,
  Webhook,
  Settings,
  LogOut,
  X,
} from "lucide-react";
import { useWallet } from "@/hooks/use-wallet";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { label: "Transactions", href: "/dashboard/transactions", icon: ArrowLeftRight },
  { label: "Insights", href: "/dashboard/insights", icon: Lightbulb },
  { label: "Recurring Payments", href: "/dashboard/recurring", icon: Repeat },
  { label: "Cashflow", href: "/dashboard/cashflow", icon: LineChart },
  { label: "API Keys", href: "/dashboard/api-keys", icon: KeyRound },
  { label: "Webhooks", href: "/dashboard/webhooks", icon: Webhook },
  { label: "Settings", href: "/dashboard/settings", icon: Settings },
];

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

export function Sidebar({ open, onClose }: SidebarProps) {
  const pathname = usePathname();
  const { shortAddress, disconnect } = useWallet();

  const sidebarContent = (
    <div className="flex h-full flex-col bg-surface-container-lowest border-r border-outline-variant">
      <div className="flex items-center justify-between px-4 py-5 border-b border-outline-variant">
        <span className="font-headline-md text-lg font-bold text-primary">
          Strelligence
        </span>
        <button
          onClick={onClose}
          className="lg:hidden p-1 rounded-lg hover:bg-muted transition-colors"
        >
          <X className="size-5 text-on-surface-variant" />
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1" aria-label="Dashboard navigation">
        {NAV_ITEMS.map(({ label, href, icon: Icon }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              onClick={onClose}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-on-surface-variant hover:bg-muted hover:text-on-surface"
              )}
            >
              <Icon className="size-4 shrink-0" aria-hidden="true" />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-outline-variant p-4 space-y-3">
        {shortAddress && (
          <p className="text-xs font-mono text-on-surface-variant truncate">
            {shortAddress}
          </p>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={disconnect}
          className="w-full justify-start gap-2 text-on-surface-variant hover:text-error"
        >
          <LogOut className="size-4" />
          Disconnect
        </Button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex lg:w-64 lg:shrink-0 lg:flex-col fixed inset-y-0 left-0 z-30">
        {sidebarContent}
      </aside>

      {/* Mobile overlay */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 z-50 w-64 lg:hidden"
            >
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
