import type { Metadata } from "next";
import { ArrowUpRight, CheckCircle2, Mail, ShieldCheck, Hash } from "lucide-react";
import { EVENT } from "@/lib/event-config";
import { BuntingFlags } from "@/components/site/bunting-flags";

export const metadata: Metadata = {
  title: "Registration",
  description: `Register for ${EVENT.name} in ${EVENT.city}, ${EVENT.country}. ${EVENT.dateLabel}. Secure your seat today.`,
};

const REQUIRED_INFO = [
  "Full name (first & last)",
  "Email address",
  "Mobile / phone number",
  "Country of residence",
  "City",
  "Organization / club",
  "Position or title",
];

const STEPS = [
  { title: "Open the official form", desc: "Click Register Now to open the secure Google Form in a new tab." },
  { title: "Fill in your details", desc: "Provide your contact, organization and delegate information." },
  { title: "Submit", desc: "You'll receive an on-screen and email confirmation from Google Forms." },
  { title: "We confirm you", desc: "Our organizing committee reviews and confirms registrations shortly after." },
];

export default function RegisterPage() {
  return (
    <div className="bg-slate-50">
      <section className="relative overflow-hidden bg-white py-24">
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
          <a
            href={EVENT.googleFormUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-9 inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-amber-400 via-rose-500 to-blue-600 px-9 py-4 text-base font-semibold text-white shadow-lg shadow-rose-500/25 transition-all hover:-translate-y-0.5 hover:shadow-xl"
          >
            Register Now — Open Official Form
            <ArrowUpRight className="h-5 w-5" />
          </a>
          <p className="mt-4 text-xs text-slate-500">
            One click takes you straight to the secure official registration form.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-16 sm:px-8">
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">What you&apos;ll need</h2>
            <p className="mt-1 text-sm text-slate-500">
              Have the following ready before you start — it takes about 3 minutes.
            </p>
            <ul className="mt-5 space-y-3">
              {REQUIRED_INFO.map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-sm text-slate-700">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">How it works</h2>
            <ol className="mt-5 space-y-5">
              {STEPS.map((step, i) => (
                <li key={step.title} className="flex gap-4">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-amber-100 text-xs font-bold text-amber-700">
                    {i + 1}
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{step.title}</p>
                    <p className="mt-0.5 text-sm text-slate-500">{step.desc}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>

        <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-6">
          <div className="flex items-start gap-3">
            <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
            <p className="text-sm text-amber-900">
              Your status will show as <strong>Pending</strong> until reviewed by the organizing
              committee, then updated to <strong>Confirmed</strong>. Questions? Email{" "}
              <a href={`mailto:${EVENT.contactEmail}`} className="font-semibold underline">
                {EVENT.contactEmail}
              </a>
              .
            </p>
          </div>
        </div>

        <div className="relative mt-6 overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 p-10 text-center">
          <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-amber-500/20 blur-3xl" />
          <Hash className="mx-auto h-8 w-8 text-amber-300" />
          <p className="mx-auto mt-4 max-w-md text-slate-300">
            Every confirmed delegate receives a unique reference number (e.g.{" "}
            <span className="font-mono text-amber-300">APRRC-2027-00128</span>) after review.
          </p>
          <a
            href={EVENT.googleFormUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-amber-500 to-rose-500 px-8 py-4 text-base font-semibold text-white shadow-lg shadow-rose-500/30 transition-all hover:-translate-y-0.5 hover:shadow-xl"
          >
            Register Now — Open Official Form
            <ArrowUpRight className="h-5 w-5" />
          </a>
        </div>
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
