"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Menu } from "lucide-react";
import { useWallet } from "@/hooks/use-wallet";
import { Sidebar } from "@/components/dashboard/sidebar";
import { MobileNav } from "@/components/dashboard/mobile-nav";
import { MoreMenu } from "@/components/dashboard/more-menu";
import { Button } from "@/components/ui/button";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { isConnected, isConnecting } = useWallet();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);

  useEffect(() => {
    if (!isConnecting && !isConnected) {
      router.push("/connect");
    }
  }, [isConnected, isConnecting, router]);

  if (isConnecting) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <div className="size-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <p className="text-sm text-on-surface-variant">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isConnected) return null;

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex flex-1 flex-col lg:pl-64 pb-16 lg:pb-0">
        <header className="sticky top-0 z-20 flex h-14 items-center gap-4 border-b border-outline-variant bg-background/80 backdrop-blur-sm px-4 lg:px-6">
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden"
          >
            <Menu className="size-5" />
          </Button>
          <h1 className="font-headline-md text-base font-medium text-on-surface">
            Dashboard
          </h1>
        </header>

        <main className="flex-1 p-4 lg:p-6">{children}</main>
      </div>

      <MobileNav onMoreClick={() => setMoreOpen(true)} />
      <MoreMenu open={moreOpen} onClose={() => setMoreOpen(false)} />
    </div>
  );
}
