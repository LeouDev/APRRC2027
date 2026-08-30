import type { Metadata } from "next";
import { Mail } from "lucide-react";
import { EVENT } from "@/lib/event-config";
import { BuntingFlags } from "@/components/site/bunting-flags";
import { RegistrationForm } from "./registration-form";

export const metadata: Metadata = {
  title: "Registration",
  description: `Register for ${EVENT.name} in ${EVENT.city}, ${EVENT.country}. ${EVENT.dateLabel}. Secure your seat today.`,
};

export default function RegisterPage() {
  return (
    <div className="bg-slate-50">
      <section className="relative overflow-hidden bg-white py-20">
        <div className="absolute inset-0 bg-gradient-to-b from-sky-50 via-white to-white" />
        <div className="absolute -left-24 -top-10 h-96 w-96 rounded-full bg-rose-300/40 blur-[110px]" />
        <div className="absolute -right-24 top-0 h-96 w-96 rounded-full bg-sky-300/40 blur-[110px]" />
        <BuntingFlags className="absolute inset-x-0 top-16 h-14 w-full opacity-90" />
        <div className="relative mx-auto max-w-4xl px-5 text-center sm:px-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-rose-600 shadow-sm backdrop-blur-md">
            Registration Open
          </div>
          <h1 className="mt-6 text-4xl font-black tracking-tight text-slate-900 sm:text-5xl">
            Register for {EVENT.name}
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-lg text-slate-600">
            {EVENT.dateLabel} &middot; {EVENT.venue}, {EVENT.city}, {EVENT.country}
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-5 py-12 sm:px-8">
        <RegistrationForm />
      </section>

      <section className="border-t border-slate-200 bg-white py-14">
        <div className="mx-auto flex max-w-3xl flex-col items-center gap-3 px-5 text-center sm:px-8">
          <Mail className="h-6 w-6 text-amber-500" />
          <p className="text-sm text-slate-500">
            Trouble with the form? Reach the organizing committee at{" "}
            <a href={`mailto:${EVENT.contactEmail}`} className="font-semibold text-amber-600">
              {EVENT.contactEmail}
            </a>
          </p>
        </div>
      </section>
    </div>
  );
}
