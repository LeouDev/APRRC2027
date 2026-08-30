import type { Metadata } from "next";
import type { ParticipantStatus } from "@prisma/client";
import {
  getAdminOverview,
  getAdminCountryStats,
  getRegistrationTrend,
  getAllCountries,
} from "@/lib/stats";
import { OverviewCards } from "@/components/admin/overview-cards";
import { CountryTable } from "@/components/admin/country-table";
import { CountryBarChart } from "@/components/charts/country-bar-chart";
import { TrendLineChart } from "@/components/charts/trend-line-chart";
import { DashboardFilters, TrendRangeSelect } from "@/components/admin/dashboard-filters";
import { ExportButton } from "@/components/admin/export-button";

export const metadata: Metadata = { title: "Dashboard", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

type SearchParams = {
  country?: string;
  status?: ParticipantStatus;
  dateFrom?: string;
  dateTo?: string;
  range?: "7d" | "30d" | "90d" | "all";
};

export default async function AdminDashboardPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const filters = {
    country: params.country,
    status: params.status,
    dateFrom: params.dateFrom,
    dateTo: params.dateTo,
  };
  const range = params.range ?? "30d";

  const [overview, countries, trend, countryOptions] = await Promise.all([
    getAdminOverview(filters),
    getAdminCountryStats({ country: filters.country, dateFrom: filters.dateFrom, dateTo: filters.dateTo }),
    getRegistrationTrend(range, filters),
    getAllCountries(),
  ]);

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Registration Overview</h1>
          <p className="text-sm text-slate-500">Live snapshot of APRRC 2027 registrations.</p>
        </div>
        <ExportButton />
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <DashboardFilters countryOptions={countryOptions} />
      </div>

      <OverviewCards overview={overview} />

      <div id="countries" className="scroll-mt-24 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Confirmed Participants by Country</h2>
            <p className="text-sm text-slate-500">Ranked by number of confirmed delegates.</p>
          </div>
        </div>
        <div className="mt-6 grid gap-8 lg:grid-cols-2">
          <div className="max-h-[420px] overflow-y-auto">
            <CountryTable countries={countries} />
          </div>
          <CountryBarChart countries={countries} />
        </div>
      </div>

      <div id="trend" className="scroll-mt-24 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Registration Trend</h2>
            <p className="text-sm text-slate-500">Track whether registrations are accelerating.</p>
          </div>
          <TrendRangeSelect />
        </div>
        <div className="mt-6">
          <TrendLineChart points={trend} />
        </div>
      </div>
    </div>
  );
}
