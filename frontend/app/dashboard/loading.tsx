import { MetricSkeleton, Skeleton } from "@/components/ui/skeleton";

export default function DashboardLoading() {
  return (
    <div className="flex-1 p-6 lg:p-10">
      <div className="mx-auto max-w-7xl">
        <Skeleton className="h-3 w-32" />
        <Skeleton className="mt-5 h-12 w-80" />
        <Skeleton className="mt-3 h-5 w-[28rem] max-w-full" />
        <div className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <MetricSkeleton key={index} />
          ))}
        </div>
        <div className="mt-6 grid gap-6 lg:grid-cols-[1.6fr_1fr]">
          <Skeleton className="h-80 rounded-3xl" />
          <Skeleton className="h-80 rounded-3xl" />
        </div>
        <Skeleton className="mt-6 h-96 rounded-3xl" />
      </div>
    </div>
  );
}
