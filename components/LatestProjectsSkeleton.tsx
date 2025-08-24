export default function LatestProjectsSkeleton({ count = 3 }: { count?: number }) {
  return (
    <section className="space-y-4">
      <div className="flex items-baseline justify-between">
        <div className="h-7 w-48 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
        <div className="h-5 w-24 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
      </div>
      <div className="grid md:grid-cols-3 gap-6">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="card">
            <div className="h-48 w-full rounded bg-slate-200 dark:bg-slate-700 animate-pulse mb-3" />
            <div className="h-5 w-3/4 bg-slate-200 dark:bg-slate-700 rounded animate-pulse mb-2" />
            <div className="h-4 w-1/2 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
          </div>
        ))}
      </div>
    </section>
  )
}