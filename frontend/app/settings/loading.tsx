import { Skeleton } from "@/components/ui/skeleton";

export default function SettingsLoading() {
  return (
    <main className="min-h-screen bg-[#fdf8f8] p-6 lg:p-10">
      <div className="mx-auto max-w-6xl">
        <Skeleton className="h-3 w-32" />
        <Skeleton className="mt-5 h-12 w-64" />
        <Skeleton className="mt-3 h-5 w-96 max-w-full" />
        <div className="mt-10 grid gap-6 lg:grid-cols-[220px_1fr]">
          <Skeleton className="h-72 rounded-3xl" />
          <div className="space-y-6">
            <Skeleton className="h-96 rounded-3xl" />
            <Skeleton className="h-72 rounded-3xl" />
          </div>
        </div>
      </div>
    </main>
  );
}
