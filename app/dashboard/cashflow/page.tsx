"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  PiggyBank,
} from "lucide-react";
import { useWallet } from "@/hooks/use-wallet";
import { fetchCashflowPeriod } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  CashflowAreaChart,
  CashflowBarChart,
  CashflowPieChart,
} from "@/components/dashboard/cashflow-chart";

const PERIODS = [
  { value: "7d" as const, label: "7D" },
  { value: "30d" as const, label: "30D" },
  { value: "90d" as const, label: "90D" },
  { value: "1y" as const, label: "1Y" },
];

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

function SkeletonStat() {
  return (
    <div className="rounded-xl bg-card ring-1 ring-foreground/10 p-4 space-y-2">
      <div className="h-4 w-24 animate-pulse rounded bg-muted" />
      <div className="h-8 w-20 animate-pulse rounded bg-muted" />
    </div>
  );
}

export default function CashflowPage() {
  const { address } = useWallet();
  const [period, setPeriod] = useState<"7d" | "30d" | "90d" | "1y">("30d");

  const { data, isLoading } = useQuery({
    queryKey: ["cashflowPeriod", address, period],
    queryFn: () => fetchCashflowPeriod(address!, period),
    enabled: !!address,
  });

  const comparison = data?.comparison;
  const incomeChange = comparison
    ? ((comparison.currentPeriod.income - comparison.previousPeriod.income) /
        (comparison.previousPeriod.income || 1)) *
      100
    : 0;
  const expenseChange = comparison
    ? ((comparison.currentPeriod.expense - comparison.previousPeriod.expense) /
        (comparison.previousPeriod.expense || 1)) *
      100
    : 0;

  return (
    <div className="space-y-6">
      {/* Period Selector */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-on-surface-variant">Period:</span>
        <div className="flex gap-1 rounded-lg border border-outline-variant p-0.5">
          {PERIODS.map((p) => (
            <Button
              key={p.value}
              variant={period === p.value ? "default" : "ghost"}
              size="xs"
              onClick={() => setPeriod(p.value)}
            >
              {p.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Summary Cards */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {isLoading ? (
          <>
            <SkeletonStat />
            <SkeletonStat />
            <SkeletonStat />
            <SkeletonStat />
          </>
        ) : (
          <>
            <Card>
              <CardHeader>
                <CardTitle className="text-on-surface-variant">Total Income</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-on-surface">
                  {formatCurrency(data?.summary.totalIncome ?? 0)}
                </p>
                {incomeChange !== 0 && (
                  <div className="flex items-center gap-1 mt-1">
                    {incomeChange > 0 ? (
                      <TrendingUp className="size-3 text-green-500" />
                    ) : (
                      <TrendingDown className="size-3 text-red-500" />
                    )}
                    <span
                      className={`text-xs font-medium ${
                        incomeChange > 0 ? "text-green-500" : "text-red-500"
                      }`}
                    >
                      {incomeChange > 0 ? "+" : ""}
                      {incomeChange.toFixed(1)}% vs prev
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-on-surface-variant">Total Expenses</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-on-surface">
                  {formatCurrency(data?.summary.totalExpenses ?? 0)}
                </p>
                {expenseChange !== 0 && (
                  <div className="flex items-center gap-1 mt-1">
                    {expenseChange > 0 ? (
                      <TrendingUp className="size-3 text-red-500" />
                    ) : (
                      <TrendingDown className="size-3 text-green-500" />
                    )}
                    <span
                      className={`text-xs font-medium ${
                        expenseChange > 0 ? "text-red-500" : "text-green-500"
                      }`}
                    >
                      {expenseChange > 0 ? "+" : ""}
                      {expenseChange.toFixed(1)}% vs prev
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-on-surface-variant">Net Cashflow</CardTitle>
              </CardHeader>
              <CardContent>
                <p
                  className={`text-2xl font-bold ${
                    (data?.summary.netCashflow ?? 0) >= 0
                      ? "text-green-500"
                      : "text-red-500"
                  }`}
                >
                  {formatCurrency(data?.summary.netCashflow ?? 0)}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-on-surface-variant">Savings Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-on-surface">
                  {(data?.summary.savingsRate ?? 0).toFixed(1)}%
                </p>
              </CardContent>
            </Card>
          </>
        )}
      </section>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        <CashflowAreaChart data={data?.daily ?? []} loading={isLoading} />
        <CashflowBarChart data={data?.daily ?? []} loading={isLoading} />
      </div>

      <CashflowPieChart data={data?.categories ?? []} loading={isLoading} />
    </div>
  );
}
