"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchTransactions } from "@/lib/api";
import type { Transaction } from "@/lib/api";

interface UseInfiniteTransactionsParams {
  address: string | null;
  type?: string;
  asset?: string;
  fromDate?: string;
  toDate?: string;
  search?: string;
  sort?: string;
  order?: "asc" | "desc";
}

export function useInfiniteTransactions({
  address,
  type,
  asset,
  fromDate,
  toDate,
  search,
  sort = "date",
  order = "desc",
}: UseInfiniteTransactionsParams) {
  return useInfiniteQuery({
    queryKey: ["infiniteTransactions", address, type, asset, fromDate, toDate, search, sort, order],
    queryFn: ({ pageParam }) =>
      fetchTransactions(address!, {
        type,
        asset,
        fromDate,
        toDate,
        search,
        sort,
        order,
        cursor: pageParam,
        limit: 20,
      }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.cursor ?? undefined,
    enabled: !!address,
  });
}

export function flattenTransactions(
  data: { pages: { transactions: Transaction[] }[] } | undefined
): Transaction[] {
  return data?.pages.flatMap((page) => page.transactions) ?? [];
}
