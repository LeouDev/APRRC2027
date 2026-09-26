import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { EVENT } from "@/lib/event-config";
import { formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { approveStaff, removeStaff } from "./actions";

export const metadata: Metadata = { title: "Check-in Staff", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

type StaffRow = { id: string; name: string; email: string; approvedAt: Date | null; createdAt: Date };

export default async function StaffPage() {
  const staff = await prisma.staffUser.findMany({
    orderBy: { createdAt: "desc" },
    select: { id: true, name: true, email: true, approvedAt: true, createdAt: true },
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Check-in Staff</h1>
        <p className="text-sm text-slate-500">
          Registration desk scanners sign up at{" "}
          <span className="font-mono text-slate-700">{EVENT.siteUrl}/staff</span> and can scan tickets once you approve
          them here.
        </p>
      </div>
      <StaffList title="Waiting for Approval" rows={staff.filter((s) => !s.approvedAt)} empty="No pending sign-ups." />
      <StaffList title="Approved Scanners" rows={staff.filter((s) => s.approvedAt)} empty="No approved scanners yet." />
    </div>
  );
}

function StaffList({ title, rows, empty }: { title: string; rows: StaffRow[]; empty: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
      {rows.length === 0 ? (
        <p className="mt-3 text-sm text-slate-400">{empty}</p>
      ) : (
        <ul className="mt-4 divide-y divide-slate-100">
          {rows.map((s) => (
            <li key={s.id} className="flex flex-wrap items-center justify-between gap-3 py-3">
              <div className="min-w-0">
                <p className="font-medium text-slate-900">{s.name}</p>
                <p className="truncate text-sm text-slate-500">
                  {s.email} · {s.approvedAt ? `approved ${formatDate(s.approvedAt)}` : `signed up ${formatDate(s.createdAt)}`}
                </p>
              </div>
              <div className="flex gap-2">
                {!s.approvedAt && (
                  <form action={approveStaff.bind(null, s.id)}>
                    <Button size="sm" variant="dark">
                      Approve
                    </Button>
                  </form>
                )}
                <form action={removeStaff.bind(null, s.id)}>
                  <Button size="sm" variant="outline">
                    {s.approvedAt ? "Remove Access" : "Deny"}
                  </Button>
                </form>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
