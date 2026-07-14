import { Skeleton } from "@/components/ui/skeleton";

export function TransactionsSkeleton() {
  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-wrap items-end gap-3">
        <div className="flex-1 min-w-[200px]">
          <Skeleton className="h-8 w-full rounded-lg" />
        </div>
        <div className="space-y-1">
          <Skeleton className="h-3 w-8" />
          <div className="flex gap-1">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-6 w-14 rounded-lg" />
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-end gap-3">
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i} className="space-y-1">
            <Skeleton className="h-3 w-10" />
            <Skeleton className="h-8 w-40 rounded-lg" />
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="rounded-xl border border-outline-variant overflow-hidden">
        <div className="flex gap-4 px-4 py-3 border-b border-outline-variant">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-4 flex-1" />
          ))}
        </div>
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="flex gap-4 px-4 py-3 border-b border-outline-variant last:border-0"
          >
            {Array.from({ length: 6 }).map((_, j) => (
              <Skeleton key={j} className="h-4 flex-1" />
            ))}
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-3 w-32" />
        <div className="flex gap-2">
          <Skeleton className="h-8 w-20 rounded-lg" />
          <Skeleton className="h-8 w-24 rounded-lg" />
        </div>
      </div>
    </div>
  );
}
