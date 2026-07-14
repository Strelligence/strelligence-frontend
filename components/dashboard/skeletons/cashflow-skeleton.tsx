import { Skeleton } from "@/components/ui/skeleton";

export function CashflowSkeleton() {
  return (
    <div className="space-y-6">
      {/* Period selector */}
      <div className="flex items-center gap-2">
        <Skeleton className="h-4 w-12" />
        <Skeleton className="h-8 w-48 rounded-lg" />
      </div>

      {/* Summary cards */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-xl bg-card ring-1 ring-foreground/10 p-4 space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-8 w-20" />
          </div>
        ))}
      </section>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i} className="rounded-xl bg-card ring-1 ring-foreground/10 p-4 space-y-4">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-[300px] w-full rounded-lg" />
          </div>
        ))}
      </div>

      <div className="rounded-xl bg-card ring-1 ring-foreground/10 p-4 space-y-4">
        <Skeleton className="h-5 w-36" />
        <Skeleton className="h-[300px] w-full rounded-lg" />
      </div>
    </div>
  );
}
