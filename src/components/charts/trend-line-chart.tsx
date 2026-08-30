"use client";

import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { TrendPoint } from "@/lib/stats";

export function TrendLineChart({ points }: { points: TrendPoint[] }) {
  if (points.length === 0) {
    return <div className="flex h-64 items-center justify-center text-sm text-slate-400">No registrations in this range.</div>;
  }

  const data = points.map((p) => ({
    date: new Date(p.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    count: p.count,
  }));

  return (
    <ResponsiveContainer width="100%" height={280}>
      <AreaChart data={data} margin={{ top: 8, right: 16, left: -16, bottom: 0 }}>
        <defs>
          <linearGradient id="trendFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f59e0b" stopOpacity={0.35} />
            <stop offset="100%" stopColor="#f59e0b" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
        <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#64748b" }} tickLine={false} />
        <YAxis tick={{ fontSize: 11, fill: "#64748b" }} allowDecimals={false} tickLine={false} axisLine={false} />
        <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0", fontSize: 13 }} />
        <Area type="monotone" dataKey="count" stroke="#f59e0b" strokeWidth={2.5} fill="url(#trendFill)" name="Registrations" />
      </AreaChart>
    </ResponsiveContainer>
  );
}
