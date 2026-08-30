"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { RotateCcw } from "lucide-react";
import { Select } from "@/components/ui/input";

export function DashboardFilters({ countryOptions }: { countryOptions: string[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function setParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    router.push(`${pathname}?${params.toString()}#${key === "range" ? "trend" : "countries"}`);
  }

  function reset() {
    router.push(pathname);
  }

  const hasFilters = ["country", "status", "dateFrom", "dateTo"].some((k) => searchParams.get(k));

  return (
    <div className="flex flex-wrap items-center gap-3">
      <Select
        aria-label="Filter by country"
        value={searchParams.get("country") ?? ""}
        onChange={(e) => setParam("country", e.target.value)}
        className="w-auto min-w-[10rem]"
      >
        <option value="">All countries</option>
        {countryOptions.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </Select>

      <Select
        aria-label="Filter by status"
        value={searchParams.get("status") ?? ""}
        onChange={(e) => setParam("status", e.target.value)}
        className="w-auto min-w-[9rem]"
      >
        <option value="">All statuses</option>
        <option value="PENDING">Pending</option>
        <option value="CONFIRMED">Confirmed</option>
        <option value="CANCELLED">Cancelled</option>
        <option value="REJECTED">Rejected</option>
      </Select>

      <input
        type="date"
        aria-label="From date"
        value={searchParams.get("dateFrom") ?? ""}
        onChange={(e) => setParam("dateFrom", e.target.value)}
        className="h-11 rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-700 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
      />
      <span className="text-sm text-slate-400">to</span>
      <input
        type="date"
        aria-label="To date"
        value={searchParams.get("dateTo") ?? ""}
        onChange={(e) => setParam("dateTo", e.target.value)}
        className="h-11 rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-700 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
      />

      {hasFilters && (
        <button
          onClick={reset}
          className="inline-flex items-center gap-1.5 rounded-full border border-slate-300 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Reset Filters
        </button>
      )}
    </div>
  );
}

export function TrendRangeSelect() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const current = searchParams.get("range") ?? "30d";

  function setRange(value: string) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("range", value);
    router.push(`${pathname}?${params.toString()}#trend`);
  }

  const OPTIONS = [
    { value: "7d", label: "7 days" },
    { value: "30d", label: "30 days" },
    { value: "90d", label: "90 days" },
    { value: "all", label: "All time" },
  ];

  return (
    <div className="inline-flex rounded-full bg-slate-100 p-1">
      {OPTIONS.map((opt) => (
        <button
          key={opt.value}
          onClick={() => setRange(opt.value)}
          className={
            current === opt.value
              ? "rounded-full bg-white px-3.5 py-1.5 text-xs font-semibold text-slate-900 shadow-sm"
              : "rounded-full px-3.5 py-1.5 text-xs font-medium text-slate-500 hover:text-slate-700"
          }
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
