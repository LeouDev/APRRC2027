import { Users, CheckCircle2, Clock, XCircle, Globe2 } from "lucide-react";
import { cn } from "@/lib/utils";

type Overview = {
  total: number;
  confirmed: number;
  pending: number;
  cancelled: number;
  countryCount: number;
};

const CARDS = [
  { key: "total", label: "Total Registrations", icon: Users, color: "text-slate-600 bg-slate-100" },
  { key: "confirmed", label: "Confirmed", icon: CheckCircle2, color: "text-emerald-600 bg-emerald-100" },
  { key: "pending", label: "Pending", icon: Clock, color: "text-amber-600 bg-amber-100" },
  { key: "cancelled", label: "Cancelled", icon: XCircle, color: "text-slate-500 bg-slate-100" },
  { key: "countryCount", label: "Countries", icon: Globe2, color: "text-sky-600 bg-sky-100" },
] as const;

export function OverviewCards({ overview }: { overview: Overview }) {
  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
      {CARDS.map((card) => (
        <div key={card.key} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className={cn("flex h-9 w-9 items-center justify-center rounded-lg", card.color)}>
            <card.icon className="h-4.5 w-4.5" />
          </div>
          <p className="mt-3 text-2xl font-black text-slate-900">{overview[card.key].toLocaleString()}</p>
          <p className="text-xs font-medium text-slate-500">{card.label}</p>
        </div>
      ))}
    </div>
  );
}
