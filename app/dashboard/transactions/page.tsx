"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Search,
  Filter,
  X,
  Loader2,
} from "lucide-react";
import { useWallet } from "@/hooks/use-wallet";
import { fetchTransactions } from "@/lib/api";
import type { Transaction, TransactionListResponse } from "@/lib/api";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  TransactionDetail,
} from "@/components/dashboard/transaction-detail";

const TYPE_OPTIONS = ["All", "Income", "Expense", "Transfer", "Swap", "Other"];
const ASSET_OPTIONS = ["All", "USDC", "XLM", "EURC"];

const TYPE_BADGE_VARIANT: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  income: "default",
  expense: "destructive",
  transfer: "secondary",
  swap: "outline",
  other: "outline",
};

export default function TransactionsPage() {
  const { address } = useWallet();
  const [typeFilter, setTypeFilter] = useState("All");
  const [assetFilter, setAssetFilter] = useState("All");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("date");
  const [order, setOrder] = useState<"asc" | "desc">("desc");
  const [cursor, setCursor] = useState<string | undefined>(undefined);
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);

  const params = {
    type: typeFilter !== "All" ? typeFilter.toLowerCase() : undefined,
    asset: assetFilter !== "All" ? assetFilter : undefined,
    fromDate: fromDate || undefined,
    toDate: toDate || undefined,
    search: search || undefined,
    sort,
    order,
    cursor,
    limit: 20,
  };

  const { data, isLoading, isFetching } = useQuery<TransactionListResponse>({
    queryKey: ["transactions", address, params],
    queryFn: () => fetchTransactions(address!, params),
    enabled: !!address,
  });

  const toggleSort = (field: string) => {
    if (sort === field) {
      setOrder(order === "asc" ? "desc" : "asc");
    } else {
      setSort(field);
      setOrder("desc");
    }
  };

  const clearFilters = () => {
    setTypeFilter("All");
    setAssetFilter("All");
    setFromDate("");
    setToDate("");
    setSearch("");
    setSort("date");
    setOrder("desc");
    setCursor(undefined);
  };

  const hasActiveFilters =
    typeFilter !== "All" ||
    assetFilter !== "All" ||
    fromDate !== "" ||
    toDate !== "" ||
    search !== "";

  function renderSortIcon(field: string) {
    if (sort !== field) return <ArrowUpDown className="size-3 opacity-50" />;
    return order === "asc" ? (
      <ArrowUp className="size-3 text-primary" />
    ) : (
      <ArrowDown className="size-3 text-primary" />
    );
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-wrap items-end gap-3">
        {/* Search */}
        <div className="flex-1 min-w-[200px]">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-on-surface-variant" />
            <Input
              placeholder="Search hash or counterparty..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        {/* Type filter */}
        <div className="space-y-1">
          <label className="text-xs font-medium text-on-surface-variant">Type</label>
          <div className="flex gap-1">
            {TYPE_OPTIONS.map((t) => (
              <Button
                key={t}
                variant={typeFilter === t ? "default" : "outline"}
                size="xs"
                onClick={() => setTypeFilter(t)}
              >
                {t}
              </Button>
            ))}
          </div>
        </div>

        {/* Asset filter */}
        <div className="space-y-1">
          <label className="text-xs font-medium text-on-surface-variant">Asset</label>
          <div className="flex gap-1">
            {ASSET_OPTIONS.map((a) => (
              <Button
                key={a}
                variant={assetFilter === a ? "default" : "outline"}
                size="xs"
                onClick={() => setAssetFilter(a)}
              >
                {a}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Date range */}
      <div className="flex flex-wrap items-end gap-3">
        <div className="space-y-1">
          <label className="text-xs font-medium text-on-surface-variant">From</label>
          <Input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="w-40"
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-medium text-on-surface-variant">To</label>
          <Input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="w-40"
          />
        </div>
        {hasActiveFilters && (
          <Button variant="ghost" size="xs" onClick={clearFilters} className="gap-1">
            <X className="size-3" />
            Clear filters
          </Button>
        )}
      </div>

      {/* Table */}
      <div className="rounded-xl border border-outline-variant overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead
                className="cursor-pointer select-none"
                onClick={() => toggleSort("date")}
              >
                <span className="flex items-center gap-1">
                  Date {renderSortIcon("date")}
                </span>
              </TableHead>
              <TableHead>Hash</TableHead>
              <TableHead
                className="cursor-pointer select-none"
                onClick={() => toggleSort("type")}
              >
                <span className="flex items-center gap-1">
                  Type {renderSortIcon("type")}
                </span>
              </TableHead>
              <TableHead
                className="cursor-pointer select-none"
                onClick={() => toggleSort("amount")}
              >
                <span className="flex items-center gap-1">
                  Amount {renderSortIcon("amount")}
                </span>
              </TableHead>
              <TableHead>Asset</TableHead>
              <TableHead>Counterparty</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  {Array.from({ length: 6 }).map((_, j) => (
                    <TableCell key={j}>
                      <div className="h-4 w-full animate-pulse rounded bg-muted" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : !data?.transactions?.length ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  <div className="flex flex-col items-center gap-2 text-on-surface-variant">
                    <Filter className="size-8 opacity-50" />
                    <p className="text-sm">No transactions found</p>
                    {hasActiveFilters && (
                      <Button variant="ghost" size="xs" onClick={clearFilters}>
                        Clear filters
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              data.transactions.map((tx) => (
                <TableRow
                  key={tx.hash}
                  className="cursor-pointer"
                  onClick={() => setSelectedTx(tx)}
                >
                  <TableCell className="text-xs text-on-surface-variant">
                    {new Date(tx.date).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <code className="text-xs font-mono text-on-surface">
                      {tx.hash.slice(0, 10)}...
                    </code>
                  </TableCell>
                  <TableCell>
                    <Badge variant={TYPE_BADGE_VARIANT[tx.type] ?? "outline"}>
                      {tx.type}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm font-medium text-on-surface">
                    {tx.amount}
                  </TableCell>
                  <TableCell className="text-sm text-on-surface-variant">
                    {tx.asset}
                  </TableCell>
                  <TableCell>
                    <code className="text-xs font-mono text-on-surface-variant">
                      {tx.counterparty
                        ? `${tx.counterparty.slice(0, 6)}...${tx.counterparty.slice(-4)}`
                        : "N/A"}
                    </code>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <p className="text-xs text-on-surface-variant">
          {data?.total ?? 0} transactions
          {isFetching && !isLoading && (
            <Loader2 className="inline ml-2 size-3 animate-spin" />
          )}
        </p>
        <div className="flex gap-2">
          {cursor && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCursor(undefined)}
            >
              Previous
            </Button>
          )}
          {data?.cursor && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCursor(data.cursor!)}
            >
              Load more
            </Button>
          )}
        </div>
      </div>

      {/* Detail Modal */}
      <TransactionDetail
        transaction={selectedTx}
        open={!!selectedTx}
        onOpenChange={(open) => !open && setSelectedTx(null)}
      />
    </div>
  );
}
