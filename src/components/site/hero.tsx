import { ArrowUpRight, MapPin, CalendarDays } from "lucide-react";
import { EVENT } from "@/lib/event-config";
import { Countdown } from "@/components/site/countdown";
import { Photo } from "@/components/site/photo";

const MOSAIC = [
  { text: "APRRC ", color: "#3B8FD6" },
  { text: "'27", color: "#C0392B" },
];

export function Hero() {
  return (
    <section className="relative flex min-h-[100svh] flex-col overflow-hidden bg-white">
      {/* Bright fiesta backdrop: white base with coral + sky color blooms, echoing the event banner */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-sky-50 via-white to-white" />
        <div className="absolute -left-24 -top-24 h-[26rem] w-[26rem] rounded-full bg-rose-300/40 blur-[100px]" />
        <div className="absolute -right-24 -top-10 h-[26rem] w-[26rem] rounded-full bg-sky-300/40 blur-[100px]" />
        <div className="absolute bottom-0 left-1/3 h-[22rem] w-[22rem] rounded-full bg-amber-200/40 blur-[110px]" />
      </div>

      {/* Official event banner — the first thing visitors see, right below the nav */}
      <div className="relative z-10 w-full pt-16 sm:pt-20">
        <Photo
          src="/images/banner.png"
          alt={`${EVENT.fullName} — ${EVENT.dateLabel}, ${EVENT.venue}`}
          className="block w-full"
          fallback={null}
        />
      </div>

      <div className="relative z-10 mx-auto grid w-full max-w-7xl flex-1 items-center gap-12 px-5 py-12 sm:px-8 lg:grid-cols-[1.15fr_0.85fr]">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-rose-600 shadow-sm backdrop-blur-md">
            <MapPin className="h-3.5 w-3.5" />
            {EVENT.city}, {EVENT.country}
          </div>

          <h1 className="mt-6 text-5xl font-black leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
            {MOSAIC.map((part) => (
              <span key={part.text} style={{ color: part.color }}>
                {part.text}
              </span>
            ))}
            <span className="block text-slate-900">Cebu, Philippines</span>
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-relaxed text-slate-600 sm:text-xl">
            {EVENT.tagline} Join Rotaractors from across the Asia Pacific for four days of connection,
            leadership and culture on the shores of the Philippines&apos; Queen City of the South.
          </p>

          <div className="mt-4 flex items-center gap-2 text-sm font-medium text-slate-500">
            <CalendarDays className="h-4 w-4 text-rose-500" />
            {EVENT.dateLabel} &middot; {EVENT.venue}
          </div>

          <div className="mt-9 flex flex-col gap-4 sm:flex-row">
            <a
              href={EVENT.googleFormUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-amber-400 via-rose-500 to-blue-600 px-8 py-4 text-base font-semibold text-white shadow-lg shadow-rose-500/25 transition-all hover:-translate-y-0.5 hover:shadow-xl"
            >
              Register Now
              <ArrowUpRight className="h-5 w-5" />
            </a>
            <a
              href="/cebu"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-300 bg-white px-8 py-4 text-base font-semibold text-slate-800 shadow-sm transition-all hover:-translate-y-0.5 hover:bg-slate-50"
            >
              Explore Cebu
            </a>
          </div>
        </div>

        <div className="lg:justify-self-end lg:w-full">
          <p className="mb-3 text-center text-xs font-semibold uppercase tracking-[0.2em] text-slate-400 lg:text-left">
            Countdown to Cebu
          </p>
          <div className="rounded-3xl bg-slate-900 p-5 shadow-xl">
            <Countdown targetDate={EVENT.startDate} />
          </div>
        </div>
      </div>
    </section>
  );
}
