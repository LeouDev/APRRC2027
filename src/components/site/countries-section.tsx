import type { CountryStat } from "@/lib/stats";
import { AnimatedCounter } from "@/components/site/animated-counter";

export function CountriesSection({ countries }: { countries: CountryStat[] }) {
  const max = countries[0]?.count ?? 1;
  const top = countries.slice(0, 12);

  return (
    <section id="about" className="bg-white py-24">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="text-center">
          <h2 className="text-sm font-semibold uppercase tracking-[0.25em] text-amber-600">
            International Delegation
          </h2>
          <p className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            From Around the World to Cebu
          </p>
          <p className="mx-auto mt-4 max-w-2xl text-slate-500">
            Confirmed delegates joining {`APRRC 2027`} so far, spanning the Asia-Pacific and beyond.
          </p>
        </div>

        {top.length === 0 ? (
          <p className="mt-14 text-center text-slate-400">
            Registrations are opening soon — check back to see participating countries.
          </p>
        ) : (
          <div className="mt-14 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {top.map((c) => (
              <div
                key={c.country}
                className="group flex items-center gap-4 rounded-2xl border border-slate-200 bg-slate-50/60 p-4 transition-colors hover:border-amber-300 hover:bg-amber-50/50"
              >
                <span className="text-3xl leading-none">{c.flag}</span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline justify-between gap-2">
                    <p className="truncate text-sm font-semibold text-slate-900">{c.country}</p>
                    <AnimatedCounter value={c.count} className="text-sm font-bold text-amber-600" />
                  </div>
                  <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-slate-200">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-amber-400 to-rose-500 transition-all duration-700"
                      style={{ width: `${Math.max(6, (c.count / max) * 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
