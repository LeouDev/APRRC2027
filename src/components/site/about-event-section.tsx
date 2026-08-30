import { EVENT } from "@/lib/event-config";
import { Sparkles, Users2, GraduationCap, Handshake } from "lucide-react";

const PILLARS = [
  { icon: GraduationCap, title: "Learning", desc: "Keynotes and workshops from regional leaders and experts.", bg: "bg-blue-100", text: "text-blue-600" },
  { icon: Handshake, title: "Connection", desc: "Build lasting partnerships across the Asia Pacific network.", bg: "bg-rose-100", text: "text-rose-600" },
  { icon: Users2, title: "Community", desc: "Celebrate service, culture and friendship across borders.", bg: "bg-emerald-100", text: "text-emerald-600" },
  { icon: Sparkles, title: "Inspiration", desc: "Leave energized with new ideas and a renewed sense of purpose.", bg: "bg-amber-100", text: "text-amber-600" },
];

export function AboutEventSection() {
  return (
    <section id="event" className="bg-white py-24">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="grid gap-14 lg:grid-cols-2 lg:items-center">
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-[0.25em] text-amber-600">
              About the Event
            </h2>
            <p className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              {EVENT.fullName}
            </p>
            <p className="mt-5 text-base leading-relaxed text-slate-600">
              {EVENT.name} brings together Rotaractors, Rotarians and friends from across the Asia
              Pacific for {EVENT.dateLabel} of collaboration, cultural exchange and shared purpose.
              Hosted at {EVENT.venue} in {EVENT.city}, the conference combines a world-class program
              with the warmth and hospitality the Philippines is known for.
            </p>
            <div className="mt-8 grid grid-cols-2 gap-6">
              <div>
                <p className="text-3xl font-black text-slate-900">4</p>
                <p className="text-sm text-slate-500">Days of programming</p>
              </div>
              <div>
                <p className="text-3xl font-black text-slate-900">1</p>
                <p className="text-sm text-slate-500">Unforgettable island host city</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {PILLARS.map(({ icon: Icon, title, desc, bg, text }) => (
              <div
                key={title}
                className="rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-6"
              >
                <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${bg} ${text}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 text-sm font-semibold text-slate-900">{title}</h3>
                <p className="mt-1.5 text-sm text-slate-500">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
