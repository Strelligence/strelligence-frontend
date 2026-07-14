"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ArrowLeftRight,
  Lightbulb,
  MoreHorizontal,
} from "lucide-react";
import { cn } from "@/lib/utils";

const MOBILE_ITEMS = [
  { label: "Home", href: "/dashboard", icon: LayoutDashboard },
  { label: "Transactions", href: "/dashboard/transactions", icon: ArrowLeftRight },
  { label: "Insights", href: "/dashboard/insights", icon: Lightbulb },
  { label: "More", href: "#more", icon: MoreHorizontal },
];

interface MobileNavProps {
  onMoreClick: () => void;
}

export function MobileNav({ onMoreClick }: MobileNavProps) {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-outline-variant bg-background/95 backdrop-blur-sm lg:hidden">
      <div className="flex items-center justify-around py-2">
        {MOBILE_ITEMS.map(({ label, href, icon: Icon }) => {
          const isActive =
            href === "#more"
              ? false
              : pathname === href || pathname.startsWith(href + "/");
          const isMore = href === "#more";

          return (
            <button
              key={label}
              onClick={isMore ? onMoreClick : undefined}
              className={cn(
                "flex flex-col items-center gap-0.5 px-3 py-1 text-xs transition-colors",
                isActive
                  ? "text-primary"
                  : "text-on-surface-variant hover:text-on-surface"
              )}
            >
              <Icon className="size-5" />
              <span>{label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
