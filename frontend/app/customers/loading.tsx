import { MetricSkeleton, Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return <main className="mx-auto max-w-[1440px] px-5 py-6 sm:px-8 lg:px-10 lg:py-9"><div className="border-b border-black/[.07] pb-7"><Skeleton className="h-2 w-40" /><Skeleton className="mt-4 h-12 w-64" /><Skeleton className="mt-3 h-3 w-96 max-w-full" /></div><section className="mt-7 grid gap-3 sm:grid-cols-2 xl:grid-cols-4"><MetricSkeleton /><MetricSkeleton /><MetricSkeleton /><MetricSkeleton /></section><section className="mt-7 overflow-hidden rounded-2xl border border-black/[.07] bg-white p-5"><Skeleton className="h-10 w-full" /><div className="mt-6 space-y-4">{Array.from({ length: 6 }).map((_, index) => <div className="flex items-center gap-4" key={index}><Skeleton className="size-10 rounded-full" /><Skeleton className="h-4 flex-1" /><Skeleton className="h-4 w-24" /><Skeleton className="h-4 w-20" /></div>)}</div></section></main>
}
