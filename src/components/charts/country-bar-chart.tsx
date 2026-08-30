"use client";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { CountryStat } from "@/lib/stats";

export function CountryBarChart({ countries }: { countries: CountryStat[] }) {
  const data = countries.slice(0, 10).map((c) => ({
    name: `${c.flag} ${c.country}`,
    count: c.count,
  }));

  if (data.length === 0) {
    return <div className="flex h-72 items-center justify-center text-sm text-slate-400">No data yet.</div>;
  }

  return (
    <ResponsiveContainer width="100%" height={Math.max(280, data.length * 38)}>
      <BarChart data={data} layout="vertical" margin={{ top: 4, right: 24, left: 8, bottom: 4 }}>
        <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
        <XAxis type="number" tick={{ fontSize: 12, fill: "#64748b" }} allowDecimals={false} />
        <YAxis
          type="category"
          dataKey="name"
          width={150}
          tick={{ fontSize: 12, fill: "#334155" }}
          tickLine={false}
          axisLine={false}
        />
        <Tooltip
          cursor={{ fill: "#fef3c7" }}
          contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0", fontSize: 13 }}
        />
        <Bar dataKey="count" fill="#f59e0b" radius={[0, 6, 6, 0]} barSize={18} name="Confirmed" />
      </BarChart>
    </ResponsiveContainer>
  );
}
