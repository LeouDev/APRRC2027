import "server-only";
import { prisma } from "@/lib/prisma";
import { flagForCountryName } from "@/data/countries";
import type { ParticipantStatus } from "@prisma/client";

export type CountryStat = {
  country: string;
  flag: string;
  count: number;
  percentage: number;
};

export async function getPublicCountryStats(): Promise<CountryStat[]> {
  const grouped = await prisma.participant.groupBy({
    by: ["country"],
    where: { status: "CONFIRMED" },
    _count: { _all: true },
  });

  const total = grouped.reduce((sum, g) => sum + g._count._all, 0);

  return grouped
    .map((g) => ({
      country: g.country,
      flag: flagForCountryName(g.country),
      count: g._count._all,
      percentage: total > 0 ? Math.round((g._count._all / total) * 1000) / 10 : 0,
    }))
    .sort((a, b) => b.count - a.count);
}

export async function getPublicSummary() {
  const confirmed = await prisma.participant.count({ where: { status: "CONFIRMED" } });
  const countries = await prisma.participant.groupBy({
    by: ["country"],
    where: { status: "CONFIRMED" },
  });
  return {
    totalConfirmed: confirmed,
    countryCount: countries.length,
  };
}

export type AdminFilters = {
  country?: string;
  status?: ParticipantStatus;
  dateFrom?: string;
  dateTo?: string;
};

function buildWhere(filters: AdminFilters) {
  const where: Record<string, unknown> = {};
  if (filters.country) where.country = filters.country;
  if (filters.status) where.status = filters.status;
  if (filters.dateFrom || filters.dateTo) {
    where.registrationDate = {
      ...(filters.dateFrom ? { gte: new Date(filters.dateFrom) } : {}),
      ...(filters.dateTo ? { lte: new Date(filters.dateTo) } : {}),
    };
  }
  return where;
}

export async function getAdminOverview(filters: AdminFilters = {}) {
  const where = buildWhere(filters);

  const [total, confirmed, pending, cancelled, rejected, countries] = await Promise.all([
    prisma.participant.count({ where }),
    prisma.participant.count({ where: { ...where, status: "CONFIRMED" } }),
    prisma.participant.count({ where: { ...where, status: "PENDING" } }),
    prisma.participant.count({ where: { ...where, status: "CANCELLED" } }),
    prisma.participant.count({ where: { ...where, status: "REJECTED" } }),
    prisma.participant.groupBy({ by: ["country"], where: { ...where, status: "CONFIRMED" } }),
  ]);

  return {
    total,
    confirmed,
    pending,
    cancelled,
    rejected,
    countryCount: countries.length,
  };
}

export async function getAdminCountryStats(filters: AdminFilters = {}): Promise<CountryStat[]> {
  const where = buildWhere({ ...filters, status: filters.status ?? "CONFIRMED" });

  const grouped = await prisma.participant.groupBy({
    by: ["country"],
    where,
    _count: { _all: true },
  });

  const total = grouped.reduce((sum, g) => sum + g._count._all, 0);

  return grouped
    .map((g) => ({
      country: g.country,
      flag: flagForCountryName(g.country),
      count: g._count._all,
      percentage: total > 0 ? Math.round((g._count._all / total) * 1000) / 10 : 0,
    }))
    .sort((a, b) => b.count - a.count);
}

export async function getAllCountries(): Promise<string[]> {
  const rows = await prisma.participant.findMany({
    distinct: ["country"],
    select: { country: true },
    orderBy: { country: "asc" },
  });
  return rows.map((r) => r.country);
}

export type TrendPoint = { date: string; count: number };

export async function getRegistrationTrend(
  range: "7d" | "30d" | "90d" | "all",
  filters: AdminFilters = {}
): Promise<TrendPoint[]> {
  const where = buildWhere(filters);

  const now = new Date();
  let from: Date | null = null;
  if (range === "7d") from = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  if (range === "30d") from = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  if (range === "90d") from = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);

  const participants = await prisma.participant.findMany({
    where: {
      ...where,
      ...(from ? { registrationDate: { gte: from } } : {}),
    },
    select: { registrationDate: true },
    orderBy: { registrationDate: "asc" },
  });

  const counts = new Map<string, number>();
  for (const p of participants) {
    const key = p.registrationDate.toISOString().slice(0, 10);
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }

  return Array.from(counts.entries())
    .map(([date, count]) => ({ date, count }))
    .sort((a, b) => a.date.localeCompare(b.date));
}
