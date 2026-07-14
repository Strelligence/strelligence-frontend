"use client";

import { Pause, Play, XCircle, Bot, UserPlus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { RecurringPattern } from "@/lib/api";

const STATUS_VARIANT: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  active: "default",
  paused: "secondary",
  cancelled: "destructive",
};

const FREQUENCY_LABEL: Record<string, string> = {
  daily: "Daily",
  weekly: "Weekly",
  monthly: "Monthly",
  yearly: "Yearly",
};

interface RecurringCardProps {
  pattern: RecurringPattern;
  onPause: (id: string) => void;
  onResume: (id: string) => void;
  onCancel: (id: string) => void;
}

export function RecurringCard({
  pattern,
  onPause,
  onResume,
  onCancel,
}: RecurringCardProps) {
  return (
    <Card className="transition-shadow hover:shadow-md">
      <CardContent className="space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1">
            <p className="text-sm font-semibold text-on-surface">
              {pattern.merchant ?? "Unknown Merchant"}
            </p>
            <p className="text-lg font-bold text-on-surface">
              {pattern.amount}{" "}
              <span className="text-sm font-normal text-on-surface-variant">
                {pattern.asset}
              </span>
            </p>
          </div>
          <div className="flex flex-col items-end gap-1.5">
            <Badge variant={STATUS_VARIANT[pattern.status] ?? "outline"}>
              {pattern.status.charAt(0).toUpperCase() + pattern.status.slice(1)}
            </Badge>
            <Badge variant="outline">
              {FREQUENCY_LABEL[pattern.frequency] ?? pattern.frequency}
            </Badge>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs text-on-surface-variant">
          <span className="flex items-center gap-1">
            {pattern.source === "auto-detected" ? (
              <Bot className="size-3" />
            ) : (
              <UserPlus className="size-3" />
            )}
            {pattern.source === "auto-detected" ? "Auto-detected" : "Manual"}
          </span>
          <span>Last: {new Date(pattern.lastDetected).toLocaleDateString()}</span>
        </div>

        {/* Confidence bar */}
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs text-on-surface-variant">Confidence</span>
            <span className="text-xs font-medium text-on-surface">
              {Math.round(pattern.confidence * 100)}%
            </span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-primary transition-all"
              style={{ width: `${pattern.confidence * 100}%` }}
            />
          </div>
        </div>

        {/* Action buttons */}
        {pattern.status !== "cancelled" && (
          <div className="flex gap-2 pt-1">
            {pattern.status === "active" ? (
              <Button
                variant="outline"
                size="xs"
                onClick={() => onPause(pattern.id)}
                className="gap-1"
              >
                <Pause className="size-3" />
                Pause
              </Button>
            ) : (
              <Button
                variant="outline"
                size="xs"
                onClick={() => onResume(pattern.id)}
                className="gap-1"
              >
                <Play className="size-3" />
                Resume
              </Button>
            )}
            <Button
              variant="destructive"
              size="xs"
              onClick={() => onCancel(pattern.id)}
              className="gap-1"
            >
              <XCircle className="size-3" />
              Cancel
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
