"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Lightbulb } from "lucide-react";
import { useWallet } from "@/hooks/use-wallet";
import { fetchInsights } from "@/lib/api";
import type { Insight } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { InsightCard } from "@/components/dashboard/insight-card";

const INSIGHT_TYPES = [
  { value: "all", label: "All" },
  { value: "spending_trend", label: "Spending Trend" },
  { value: "income_stability", label: "Income Stability" },
  { value: "top_counterparties", label: "Top Counterparties" },
  { value: "asset_distribution", label: "Asset Distribution" },
  { value: "risk_score", label: "Risk Score" },
];

function SkeletonInsightCard() {
  return (
    <div className="rounded-xl bg-card ring-1 ring-foreground/10 p-4 space-y-3">
      <div className="flex items-center gap-3">
        <div className="size-9 animate-pulse rounded-lg bg-muted" />
        <div className="space-y-2">
          <div className="h-4 w-32 animate-pulse rounded bg-muted" />
          <div className="h-5 w-20 animate-pulse rounded-full bg-muted" />
        </div>
      </div>
      <div className="space-y-2">
        <div className="h-3 w-full animate-pulse rounded bg-muted" />
        <div className="h-3 w-3/4 animate-pulse rounded bg-muted" />
      </div>
    </div>
  );
}

export default function InsightsPage() {
  const { address } = useWallet();
  const [typeFilter, setTypeFilter] = useState("all");

  const { data: insights, isLoading } = useQuery<Insight[]>({
    queryKey: ["insights", address],
    queryFn: () => fetchInsights(address!),
    enabled: !!address,
  });

  const filteredInsights = insights?.filter(
    (insight) => typeFilter === "all" || insight.type === typeFilter
  );

  return (
    <div className="space-y-6">
      {/* Type Filter */}
      <div className="flex flex-wrap gap-2">
        {INSIGHT_TYPES.map(({ value, label }) => (
          <Button
            key={value}
            variant={typeFilter === value ? "default" : "outline"}
            size="xs"
            onClick={() => setTypeFilter(value)}
          >
            {label}
          </Button>
        ))}
      </div>

      {/* Insights Grid */}
      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonInsightCard key={i} />
          ))}
        </div>
      ) : !filteredInsights?.length ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="flex size-12 items-center justify-center rounded-full bg-muted mb-4">
            <Lightbulb className="size-6 text-on-surface-variant" />
          </div>
          <p className="text-sm font-medium text-on-surface">No insights available</p>
          <p className="text-xs text-on-surface-variant mt-1">
            {typeFilter !== "all"
              ? "No insights match the selected type"
              : "Insights will appear once you have transaction data"}
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredInsights.map((insight) => (
            <InsightCard key={insight.id} insight={insight} />
          ))}
        </div>
      )}
    </div>
  );
}
