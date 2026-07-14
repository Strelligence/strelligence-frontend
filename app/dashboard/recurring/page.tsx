"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Repeat, RefreshCw } from "lucide-react";
import { useWallet } from "@/hooks/use-wallet";
import { toast } from "sonner";
import { fetchRecurringPatterns, updateRecurringPattern } from "@/lib/api";
import type { RecurringPattern } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RecurringCard } from "@/components/dashboard/recurring-card";

const STATUS_TABS = ["all", "active", "paused", "cancelled"] as const;

function SkeletonRecurringCard() {
  return (
    <div className="rounded-xl bg-card ring-1 ring-foreground/10 p-4 space-y-3">
      <div className="flex justify-between">
        <div className="space-y-2">
          <div className="h-4 w-28 animate-pulse rounded bg-muted" />
          <div className="h-6 w-20 animate-pulse rounded bg-muted" />
        </div>
        <div className="space-y-2 items-end">
          <div className="h-5 w-16 animate-pulse rounded-full bg-muted" />
          <div className="h-5 w-14 animate-pulse rounded-full bg-muted" />
        </div>
      </div>
      <div className="h-1.5 w-full animate-pulse rounded-full bg-muted" />
    </div>
  );
}

export default function RecurringPage() {
  const { address } = useWallet();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<"all" | "active" | "paused" | "cancelled">("all");

  const { data, isLoading } = useQuery({
    queryKey: ["recurring", address, activeTab],
    queryFn: () =>
      fetchRecurringPatterns(address!, {
        status: activeTab === "all" ? undefined : activeTab,
      }),
    enabled: !!address,
  });

  const mutate = useMutation({
    mutationFn: ({ id, status }: { id: string; status: "active" | "paused" | "cancelled" }) =>
      updateRecurringPattern(address!, id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["recurring", address] });
      toast.success("Pattern updated");
    },
    onError: () => toast.error("Failed to update pattern"),
  });

  const patterns: RecurringPattern[] = data?.patterns ?? [];

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {isLoading ? (
          <>
            <div className="rounded-xl bg-card ring-1 ring-foreground/10 p-4 animate-pulse">
              <div className="h-4 w-24 rounded bg-muted mb-2" />
              <div className="h-8 w-16 rounded bg-muted" />
            </div>
            <div className="rounded-xl bg-card ring-1 ring-foreground/10 p-4 animate-pulse">
              <div className="h-4 w-24 rounded bg-muted mb-2" />
              <div className="h-8 w-16 rounded bg-muted" />
            </div>
            <div className="rounded-xl bg-card ring-1 ring-foreground/10 p-4 animate-pulse">
              <div className="h-4 w-24 rounded bg-muted mb-2" />
              <div className="h-8 w-16 rounded bg-muted" />
            </div>
          </>
        ) : (
          <>
            <Card>
              <CardHeader>
                <CardTitle className="text-on-surface-variant">Total Active</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-on-surface">
                  {data?.totalActive ?? 0}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-on-surface-variant">Monthly Cost</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-on-surface">
                  {data?.totalMonthlyCost ?? "$0"}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-on-surface-variant">Total Patterns</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-on-surface">{patterns.length}</p>
              </CardContent>
            </Card>
          </>
        )}
      </section>

      {/* Status Tabs */}
      <div className="flex gap-2">
        {STATUS_TABS.map((tab) => (
          <Button
            key={tab}
            variant={activeTab === tab ? "default" : "outline"}
            size="xs"
            onClick={() => setActiveTab(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </Button>
        ))}
      </div>

      {/* Patterns Grid */}
      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <SkeletonRecurringCard key={i} />
          ))}
        </div>
      ) : !patterns.length ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="flex size-12 items-center justify-center rounded-full bg-muted mb-4">
            <Repeat className="size-6 text-on-surface-variant" />
          </div>
          <p className="text-sm font-medium text-on-surface">No recurring patterns</p>
          <p className="text-xs text-on-surface-variant mt-1">
            Recurring patterns will be auto-detected from your transactions
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {patterns.map((pattern) => (
            <RecurringCard
              key={pattern.id}
              pattern={pattern}
              onPause={(id) => mutate.mutate({ id, status: "paused" })}
              onResume={(id) => mutate.mutate({ id, status: "active" })}
              onCancel={(id) => mutate.mutate({ id, status: "cancelled" })}
            />
          ))}
        </div>
      )}
    </div>
  );
}
