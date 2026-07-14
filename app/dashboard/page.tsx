"use client";

import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import {
  TrendingUp,
  TrendingDown,
  ArrowLeftRight,
  Repeat,
  Wallet,
  Lightbulb,
  KeyRound,
} from "lucide-react";
import { useWallet } from "@/hooks/use-wallet";
import {
  fetchWalletSummary,
  fetchRecentTransactions,
  fetchCashflow,
  fetchActiveSubscriptions,
} from "@/lib/api";
import type { Transaction, WalletSummary, CashflowData } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Bar, BarChart, XAxis, YAxis } from "recharts";

function SkeletonCard() {
  return (
    <div className="rounded-xl bg-card ring-1 ring-foreground/10 p-4 space-y-3">
      <div className="h-4 w-24 animate-pulse rounded bg-muted" />
      <div className="h-8 w-32 animate-pulse rounded bg-muted" />
      <div className="h-3 w-20 animate-pulse rounded bg-muted" />
    </div>
  );
}

function SkeletonTransactionRow() {
  return (
    <div className="flex items-center gap-3 py-3 border-b border-outline-variant last:border-0">
      <div className="h-6 w-6 animate-pulse rounded-full bg-muted" />
      <div className="flex-1 space-y-2">
        <div className="h-3 w-20 animate-pulse rounded bg-muted" />
        <div className="h-3 w-16 animate-pulse rounded bg-muted" />
      </div>
      <div className="h-4 w-16 animate-pulse rounded bg-muted" />
    </div>
  );
}

const TYPE_BADGE_VARIANT: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  income: "default",
  expense: "destructive",
  transfer: "secondary",
  swap: "outline",
  other: "outline",
};

export default function DashboardPage() {
  const { address } = useWallet();
  const router = useRouter();

  const { data: summary, isLoading: loadingSummary } = useQuery<WalletSummary>({
    queryKey: ["walletSummary", address],
    queryFn: () => fetchWalletSummary(address!),
    enabled: !!address,
  });

  const { data: transactions, isLoading: loadingTx } = useQuery<Transaction[]>({
    queryKey: ["recentTransactions", address],
    queryFn: () => fetchRecentTransactions(address!),
    enabled: !!address,
  });

  const { data: cashflow, isLoading: loadingCashflow } = useQuery<CashflowData[]>({
    queryKey: ["cashflow", address],
    queryFn: () => fetchCashflow(address!),
    enabled: !!address,
  });

  const { data: subscriptions } = useQuery<number>({
    queryKey: ["subscriptions", address],
    queryFn: () => fetchActiveSubscriptions(address!),
    enabled: !!address,
  });

  const netChange = summary?.netChange24h ?? "0";
  const isPositive = !netChange.startsWith("-");

  return (
    <div className="space-y-6">
      {/* Portfolio Summary */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {loadingSummary ? (
          <>
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </>
        ) : (
          <>
            <Card>
              <CardHeader>
                <CardTitle className="text-on-surface-variant">Total Balance</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-on-surface">
                  {summary?.totalBalance ?? "$0.00"}
                </p>
                <div className="flex items-center gap-1 mt-1">
                  {isPositive ? (
                    <TrendingUp className="size-3 text-green-500" />
                  ) : (
                    <TrendingDown className="size-3 text-red-500" />
                  )}
                  <span
                    className={`text-xs font-medium ${
                      isPositive ? "text-green-500" : "text-red-500"
                    }`}
                  >
                    {netChange} (24h)
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-on-surface-variant">7d Change</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-on-surface">
                  {summary?.netChange7d ?? "0%"}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-on-surface-variant">30d Change</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-on-surface">
                  {summary?.netChange30d ?? "0%"}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-on-surface-variant">Active Subscriptions</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-on-surface">
                  {subscriptions ?? 0}
                </p>
              </CardContent>
            </Card>
          </>
        )}
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Transactions */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Transactions</CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push("/dashboard/transactions")}
            >
              View All
            </Button>
          </CardHeader>
          <CardContent>
            {loadingTx ? (
              <div className="space-y-0">
                <SkeletonTransactionRow />
                <SkeletonTransactionRow />
                <SkeletonTransactionRow />
              </div>
            ) : !transactions?.length ? (
              <p className="py-8 text-center text-sm text-on-surface-variant">
                No transactions yet
              </p>
            ) : (
              <div className="space-y-0">
                {transactions.map((tx) => (
                  <div
                    key={tx.hash}
                    className="flex items-center gap-3 py-3 border-b border-outline-variant last:border-0 cursor-pointer hover:bg-muted/50 rounded-lg px-2 -mx-2 transition-colors"
                    onClick={() => router.push("/dashboard/transactions")}
                  >
                    <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10">
                      <ArrowLeftRight className="size-3.5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-on-surface truncate">
                        {tx.type.charAt(0).toUpperCase() + tx.type.slice(1)}
                      </p>
                      <p className="text-xs text-on-surface-variant font-mono truncate">
                        {tx.hash.slice(0, 10)}...
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <p
                        className={`text-sm font-medium ${
                          tx.type === "income" ? "text-green-500" : "text-on-surface"
                        }`}
                      >
                        {tx.type === "income" ? "+" : ""}{tx.amount} {tx.asset}
                      </p>
                      <p className="text-xs text-on-surface-variant">
                        {new Date(tx.date).toLocaleDateString()}
                      </p>
                    </div>
                    <Badge variant={TYPE_BADGE_VARIANT[tx.type] ?? "outline"}>
                      {tx.type}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Cashflow Mini Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Cashflow (7 Days)</CardTitle>
          </CardHeader>
          <CardContent>
            {loadingCashflow ? (
              <div className="h-[200px] animate-pulse rounded-lg bg-muted" />
            ) : !cashflow?.length ? (
              <p className="py-8 text-center text-sm text-on-surface-variant">
                No cashflow data yet
              </p>
            ) : (
              <ChartContainer
                config={{
                  income: { label: "Income", color: "#22c55e" },
                  expense: { label: "Expense", color: "#ef4444" },
                }}
                className="h-[200px]"
              >
                <BarChart data={cashflow}>
                  <XAxis
                    dataKey="date"
                    tickLine={false}
                    axisLine={false}
                    tick={{ fontSize: 11 }}
                  />
                  <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11 }} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="income" fill="var(--color-income)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="expense" fill="var(--color-expense)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ChartContainer>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Top Assets */}
      {summary?.topAssets && summary.topAssets.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Top Assets</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {summary.topAssets.map((asset) => (
                <div
                  key={asset.code}
                  className="flex items-center justify-between rounded-lg border border-outline-variant p-3"
                >
                  <div className="flex items-center gap-2">
                    <div className="flex size-8 items-center justify-center rounded-full bg-primary/10">
                      <Wallet className="size-3.5 text-primary" />
                    </div>
                    <span className="text-sm font-medium text-on-surface">
                      {asset.code}
                    </span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-on-surface">
                      {asset.balance}
                    </p>
                    <p
                      className={`text-xs ${
                        asset.change.startsWith("-") ? "text-red-500" : "text-green-500"
                      }`}
                    >
                      {asset.change}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push("/dashboard/transactions")}
              className="gap-2"
            >
              <ArrowLeftRight className="size-4" />
              View Transactions
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push("/dashboard/insights")}
              className="gap-2"
            >
              <Lightbulb className="size-4" />
              View Insights
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push("/dashboard/api-keys")}
              className="gap-2"
            >
              <KeyRound className="size-4" />
              API Keys
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push("/dashboard/recurring")}
              className="gap-2"
            >
              <Repeat className="size-4" />
              Recurring Payments
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
