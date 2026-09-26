import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getStaff } from "@/lib/session";
import { EVENT } from "@/lib/event-config";
import { Photo } from "@/components/site/photo";
import { StaffAuthForm } from "./auth-form";

export const metadata: Metadata = { title: "Staff Sign In" };

export default async function StaffLoginPage({ searchParams }: PageProps<"/staff/login">) {
  if (await getStaff()) redirect("/staff");
  const mode = (await searchParams).signup ? "signup" : "login";

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-5 py-10">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_100%_60%_at_50%_0%,#0c4a6e_0%,#020617_70%)]" />
      <div className="relative w-full max-w-sm">
        <div className="mb-8 text-center">
          <Photo
            src="/images/logo.png"
            alt="APRRC '27 logo"
            className="mx-auto h-12 w-12 rounded-full object-cover shadow-lg"
            fallback={
              <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-orange-600 text-lg font-black text-white shadow-lg">
                AP
              </span>
            }
          />
          <h1 className="mt-4 text-2xl font-bold text-white">
            {mode === "signup" ? "Create Scanner Account" : "Check-in Staff"}
          </h1>
          <p className="mt-1 text-sm text-slate-400">{EVENT.name} Registration Desk</p>
        </div>
        <StaffAuthForm key={mode} mode={mode} />
      </div>
    </div>
  );
}
