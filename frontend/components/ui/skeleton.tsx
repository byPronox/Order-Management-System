export function Skeleton({ className = '' }: { className?: string }) {
  return <span className={`block animate-pulse rounded-md bg-black/[.06] ${className}`} aria-hidden="true" />
}

export function MetricSkeleton() {
  return (
    <div className="rounded-2xl border border-black/[.06] bg-white p-5">
      <Skeleton className="mb-4 h-2 w-24" />
      <Skeleton className="h-8 w-20" />
      <Skeleton className="mt-3 h-2 w-28" />
    </div>
  )
}
