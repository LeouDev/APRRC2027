import type { CountryStat } from "@/lib/stats";

export function CountryTable({ countries }: { countries: CountryStat[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="sticky top-0 bg-white">
          <tr className="border-b border-slate-200 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
            <th className="py-3 pr-3">#</th>
            <th className="py-3 pr-3">Country</th>
            <th className="py-3 pr-3 text-right">Confirmed</th>
            <th className="py-3 pl-3 text-right">Share</th>
          </tr>
        </thead>
        <tbody>
          {countries.length === 0 && (
            <tr>
              <td colSpan={4} className="py-8 text-center text-slate-400">
                No confirmed participants match the current filters.
              </td>
            </tr>
          )}
          {countries.map((c, i) => (
            <tr key={c.country} className="border-b border-slate-100 last:border-0">
              <td className="py-3 pr-3 font-medium text-slate-400">{i + 1}</td>
              <td className="py-3 pr-3">
                <span className="mr-2 text-base">{c.flag}</span>
                <span className="font-medium text-slate-800">{c.country}</span>
              </td>
              <td className="py-3 pr-3 text-right font-semibold text-slate-900">{c.count}</td>
              <td className="py-3 pl-3 text-right text-slate-500">{c.percentage}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
