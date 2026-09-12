import { Skeleton } from "@/components/ui/skeleton"

export default function OrdersLoading() {
  return <main className="mx-auto max-w-[1440px] px-5 py-9 sm:px-8 lg:px-10"><Skeleton className="h-2 w-28" /><Skeleton className="mt-5 h-12 w-56" /><Skeleton className="mt-3 h-4 w-80" /><div className="mt-8 grid gap-3 sm:grid-cols-3">{[1,2,3].map((item) => <div key={item} className="rounded-2xl border border-black/[.06] bg-white p-5"><Skeleton className="h-2 w-24" /><Skeleton className="mt-4 h-8 w-20" /><Skeleton className="mt-3 h-2 w-32" /></div>)}</div><div className="mt-7 rounded-2xl border border-black/[.07] bg-white p-5"><Skeleton className="h-9 w-full" /><div className="mt-6 space-y-5">{[1,2,3,4,5].map((item) => <Skeleton key={item} className="h-8 w-full" />)}</div></div></main>
}
