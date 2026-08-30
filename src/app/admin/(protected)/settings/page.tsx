import type { Metadata } from "next";
import { getSession } from "@/lib/session";
import { ChangePasswordForm } from "./change-password-form";

export const metadata: Metadata = { title: "Settings", robots: { index: false, follow: false } };

export default async function SettingsPage() {
  const session = await getSession();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
        <p className="text-sm text-slate-500">Manage your organizer account.</p>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Account</h2>
        <dl className="mt-4 space-y-2 text-sm">
          <div className="flex gap-2">
            <dt className="w-24 text-slate-500">Name</dt>
            <dd className="font-medium text-slate-900">{session?.name}</dd>
          </div>
          <div className="flex gap-2">
            <dt className="w-24 text-slate-500">Email</dt>
            <dd className="font-medium text-slate-900">{session?.email}</dd>
          </div>
        </dl>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Change Password</h2>
        <p className="mt-1 text-sm text-slate-500">Use a strong, unique password for the organizer account.</p>
        <div className="mt-5">
          <ChangePasswordForm />
        </div>
      </div>
    </div>
  );
}
