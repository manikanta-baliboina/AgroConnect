export function RouteSkeleton() {
  return (
    <div className="page-shell py-8">
      <div className="card-soft p-6">
        <div className="h-8 w-48 animate-pulse rounded-full bg-slate-200" />
        <div className="mt-3 h-4 w-72 animate-pulse rounded-full bg-slate-200" />
        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="card p-5">
              <div className="h-44 animate-pulse rounded-[1.5rem] bg-slate-100" />
              <div className="mt-4 h-5 w-2/3 animate-pulse rounded-full bg-slate-100" />
              <div className="mt-3 h-4 w-1/2 animate-pulse rounded-full bg-slate-100" />
              <div className="mt-6 h-10 animate-pulse rounded-full bg-slate-100" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function OrdersSkeleton({ rows = 4 }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: rows }).map((_, index) => (
        <div key={index} className="card p-5">
          <div className="flex items-center justify-between gap-4">
            <div className="h-4 w-32 animate-pulse rounded-full bg-slate-200" />
            <div className="h-7 w-24 animate-pulse rounded-full bg-slate-200" />
          </div>
          <div className="mt-4 h-4 w-52 animate-pulse rounded-full bg-slate-100" />
          <div className="mt-5 space-y-3">
            <div className="h-4 w-full animate-pulse rounded-full bg-slate-100" />
            <div className="h-4 w-5/6 animate-pulse rounded-full bg-slate-100" />
            <div className="h-4 w-3/4 animate-pulse rounded-full bg-slate-100" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function CropDetailsSkeleton() {
  return (
    <div className="page-shell py-8">
      <div className="mb-4 h-10 w-44 animate-pulse rounded-full bg-slate-200" />
      <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
        <div className="card p-5">
          <div className="h-80 animate-pulse rounded-[1.5rem] bg-slate-100" />
          <div className="mt-5 h-4 w-full animate-pulse rounded-full bg-slate-100" />
          <div className="mt-3 h-4 w-5/6 animate-pulse rounded-full bg-slate-100" />
        </div>
        <div className="space-y-4">
          <div className="card p-5">
            <div className="h-8 w-3/4 animate-pulse rounded-full bg-slate-100" />
            <div className="mt-3 h-4 w-1/2 animate-pulse rounded-full bg-slate-100" />
            <div className="mt-6 h-4 w-full animate-pulse rounded-full bg-slate-100" />
            <div className="mt-3 h-4 w-2/3 animate-pulse rounded-full bg-slate-100" />
            <div className="mt-6 h-11 animate-pulse rounded-full bg-slate-100" />
            <div className="mt-3 h-11 animate-pulse rounded-full bg-slate-100" />
          </div>
          <div className="card p-5">
            <div className="h-5 w-36 animate-pulse rounded-full bg-slate-100" />
            <div className="mt-4 h-4 w-full animate-pulse rounded-full bg-slate-100" />
            <div className="mt-3 h-4 w-5/6 animate-pulse rounded-full bg-slate-100" />
          </div>
        </div>
      </div>
    </div>
  );
}
