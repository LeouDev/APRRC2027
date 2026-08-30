function SkeletonBlock({ className }: { className: string }) {
  return <div className={`animate-pulse rounded-2xl bg-slate-200 ${className}`} />;
}

export default function DashboardLoading() {
  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="h-7 w-64 animate-pulse rounded-lg bg-slate-200" />
          <div className="mt-2 h-4 w-72 animate-pulse rounded-lg bg-slate-200" />
        </div>
        <div className="h-9 w-32 animate-pulse rounded-lg bg-slate-200" />
      </div>

      <SkeletonBlock className="h-20" />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {Array.from({ length: 5 }).map((_, i) => (
          <SkeletonBlock key={i} className="h-24" />
        ))}
      </div>

      <SkeletonBlock className="h-96" />
      <SkeletonBlock className="h-80" />
    </div>
  );
}
