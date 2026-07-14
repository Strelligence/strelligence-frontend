"use client";

import { useState } from "react";
import {
  BarChart3,
  DollarSign,
  Users,
  PieChart,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Insight } from "@/lib/api";

const INSIGHT_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  spending_trend: BarChart3,
  income_stability: DollarSign,
  top_counterparties: Users,
  asset_distribution: PieChart,
  risk_score: AlertTriangle,
};

const INSIGHT_COLORS: Record<string, string> = {
  spending_trend: "bg-blue-500/10 text-blue-500",
  income_stability: "bg-green-500/10 text-green-500",
  top_counterparties: "bg-purple-500/10 text-purple-500",
  asset_distribution: "bg-amber-500/10 text-amber-500",
  risk_score: "bg-red-500/10 text-red-500",
};

const INSIGHT_BADGE_VARIANT: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  spending_trend: "default",
  income_stability: "secondary",
  top_counterparties: "outline",
  asset_distribution: "default",
  risk_score: "destructive",
};

interface InsightCardProps {
  insight: Insight;
}

export function InsightCard({ insight }: InsightCardProps) {
  const [expanded, setExpanded] = useState(false);
  const Icon = INSIGHT_ICONS[insight.type] ?? BarChart3;
  const colorClass = INSIGHT_COLORS[insight.type] ?? "bg-muted text-on-surface-variant";

  return (
    <Card className="transition-shadow hover:shadow-md">
      <CardHeader>
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className={`flex size-9 items-center justify-center rounded-lg ${colorClass}`}>
              <Icon className="size-4" />
            </div>
            <div>
              <CardTitle className="text-on-surface">{insight.title}</CardTitle>
              <Badge
                variant={INSIGHT_BADGE_VARIANT[insight.type] ?? "outline"}
                className="mt-1"
              >
                {insight.type.replace(/_/g, " ")}
              </Badge>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm text-on-surface-variant leading-relaxed">
          {insight.description}
        </p>

        {/* Metadata */}
        {insight.metadata && Object.keys(insight.metadata).length > 0 && (
          <div>
            <button
              onClick={() => setExpanded(!expanded)}
              className="flex items-center gap-1 text-xs font-medium text-on-surface-variant hover:text-on-surface transition-colors"
            >
              Metadata
              {expanded ? <ChevronUp className="size-3" /> : <ChevronDown className="size-3" />}
            </button>
            {expanded && (
              <pre className="mt-2 text-xs font-mono text-on-surface bg-muted rounded-lg px-3 py-2 overflow-x-auto max-h-40 overflow-y-auto">
                {JSON.stringify(insight.metadata, null, 2)}
              </pre>
            )}
          </div>
        )}

        {/* Timestamp */}
        <p className="text-xs text-on-surface-variant">
          {new Date(insight.createdAt).toLocaleDateString(undefined, {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </p>
      </CardContent>
    </Card>
  );
}
