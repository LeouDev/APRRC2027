import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { LogOut } from "lucide-react";
import { getStaff } from "@/lib/session";
import { staffLogoutAction } from "./actions";
import { CheckInApp } from "./check-in-app";

export const metadata: Metadata = { title: "Check-in" };

export default async function StaffPage() {
  const staff = await getStaff();
  if (!staff) redirect("/staff/login");

  return (
    <div className="min-h-screen bg-slate-100">
      <header className="sticky top-0 z-30 flex items-center justify-between bg-slate-950 px-4 py-3">
        <div>
          <p className="text-sm font-bold text-white">APRRC &apos;27 Check-in</p>
          <p className="text-xs text-slate-400">{staff.name}</p>
        </div>
        <form action={staffLogoutAction}>
          <button type="submit" className="flex items-center gap-1.5 text-xs font-medium text-slate-300">
            <LogOut className="h-4 w-4" />
            Log out
          </button>
        </form>
      </header>
      <main className="mx-auto max-w-lg px-4 py-5">
        <CheckInApp />
      </main>
    </div>
  );
}
