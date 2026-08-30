import "server-only";
import { prisma } from "@/lib/prisma";
import { flagForCountryName } from "@/data/countries";
import { Prisma, type ParticipantStatus } from "@prisma/client";

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

  // Breakdown counts always span every status regardless of filters.status
  // (matching the country-count query below), so build the WHERE clause for
  // the raw query from country/date filters only — one grouped query instead
  // of four separate count()s.
  const conditions: Prisma.Sql[] = [];
  if (filters.country) conditions.push(Prisma.sql`country = ${filters.country}`);
  if (filters.dateFrom) conditions.push(Prisma.sql`"registrationDate" >= ${new Date(filters.dateFrom)}`);
  if (filters.dateTo) conditions.push(Prisma.sql`"registrationDate" <= ${new Date(filters.dateTo)}`);
  const whereSql = conditions.length > 0 ? Prisma.sql`WHERE ${Prisma.join(conditions, " AND ")}` : Prisma.empty;

  const [total, statusRows, countries] = await Promise.all([
    prisma.participant.count({ where }),
    prisma.$queryRaw<{ status: ParticipantStatus; count: bigint }[]>(
      Prisma.sql`SELECT status, COUNT(*) as count FROM "Participant" ${whereSql} GROUP BY status`
    ),
    prisma.participant.groupBy({ by: ["country"], where: { ...where, status: "CONFIRMED" } }),
  ]);

  const byStatus = Object.fromEntries(statusRows.map((r) => [r.status, Number(r.count)]));

  return {
    total,
    confirmed: byStatus.CONFIRMED ?? 0,
    pending: byStatus.PENDING ?? 0,
    cancelled: byStatus.CANCELLED ?? 0,
    rejected: byStatus.REJECTED ?? 0,
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
