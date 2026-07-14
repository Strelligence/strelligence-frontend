"use client";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  Pie,
  PieChart,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsiveChart, useChartConfig } from "@/components/ui/responsive-chart";
import type { CashflowDailyData, CashflowCategory } from "@/lib/api";

const PIE_COLORS = [
  "#6c1850",
  "#8b5cf6",
  "#ec4899",
  "#f59e0b",
  "#22c55e",
  "#3b82f6",
  "#ef4444",
  "#14b8a6",
];

function ChartSkeleton({ height = 300 }: { height?: number }) {
  return <div className="animate-pulse rounded-lg bg-muted" style={{ height }} />;
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

interface AreaChartSectionProps {
  data: CashflowDailyData[];
  loading?: boolean;
}

export function CashflowAreaChart({ data, loading }: AreaChartSectionProps) {
  const { tickFontSize, margin } = useChartConfig();

  if (loading) return <ChartSkeleton />;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Income vs Expense</CardTitle>
      </CardHeader>
      <CardContent>
        <div role="img" aria-label="Area chart showing income versus expense over time">
          <ResponsiveChart mobileHeight={200} desktopHeight={300}>
            <AreaChart data={data} margin={margin}>
              <defs>
                <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: tickFontSize }}
                interval="preserveStartEnd"
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: tickFontSize }}
                tickFormatter={formatCurrency}
                width={60}
              />
              <Tooltip
                formatter={(value: number) => formatCurrency(value)}
                contentStyle={{ fontSize: 12 }}
              />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Area
                type="monotone"
                dataKey="income"
                stroke="#22c55e"
                fill="url(#incomeGrad)"
                name="Income"
              />
              <Area
                type="monotone"
                dataKey="expense"
                stroke="#ef4444"
                fill="url(#expenseGrad)"
                name="Expense"
              />
            </AreaChart>
          </ResponsiveChart>
        </div>
      </CardContent>
    </Card>
  );
}

interface BarChartSectionProps {
  data: CashflowDailyData[];
  loading?: boolean;
}

export function CashflowBarChart({ data, loading }: BarChartSectionProps) {
  const { tickFontSize, margin } = useChartConfig();

  if (loading) return <ChartSkeleton />;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Daily Totals</CardTitle>
      </CardHeader>
      <CardContent>
        <div role="img" aria-label="Bar chart showing daily income and expense totals">
          <ResponsiveChart mobileHeight={200} desktopHeight={300}>
            <BarChart data={data} margin={margin}>
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: tickFontSize }}
                interval="preserveStartEnd"
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: tickFontSize }}
                tickFormatter={formatCurrency}
                width={60}
              />
              <Tooltip
                formatter={(value: number) => formatCurrency(value)}
                contentStyle={{ fontSize: 12 }}
              />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Bar dataKey="income" fill="#22c55e" name="Income" radius={[4, 4, 0, 0]} />
              <Bar dataKey="expense" fill="#ef4444" name="Expense" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveChart>
        </div>
      </CardContent>
    </Card>
  );
}

interface PieChartSectionProps {
  data: CashflowCategory[];
  loading?: boolean;
}

export function CashflowPieChart({ data, loading }: PieChartSectionProps) {
  const { isMobile } = useChartConfig();

  if (loading) return <ChartSkeleton height={300} />;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Expense Breakdown</CardTitle>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <p className="py-8 text-center text-sm text-on-surface-variant">
            No expense data available
          </p>
        ) : (
          <div role="img" aria-label="Pie chart showing expense breakdown by category">
            <ResponsiveChart mobileHeight={250} desktopHeight={300}>
              <PieChart>
                <Pie
                  data={data}
                  dataKey="amount"
                  nameKey="category"
                  cx="50%"
                  cy="50%"
                  outerRadius={isMobile ? 70 : 100}
                  label={
                    isMobile
                      ? false
                      : ({ category, percentage }) =>
                          `${category} (${percentage.toFixed(0)}%)`
                  }
                  labelLine={false}
                >
                  {data.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={PIE_COLORS[index % PIE_COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number) => formatCurrency(value)}
                  contentStyle={{ fontSize: 12 }}
                />
                <Legend wrapperStyle={{ fontSize: 12 }} />
              </PieChart>
            </ResponsiveChart>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
