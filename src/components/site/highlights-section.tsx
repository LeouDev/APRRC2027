import { Mic2, PartyPopper, Palette, Utensils } from "lucide-react";

const HIGHLIGHTS = [
  {
    icon: Mic2,
    title: "Opening Ceremony",
    desc: "A spectacular welcome celebrating Cebuano culture and the Asia-Pacific community.",
    tag: "Day 1",
  },
  {
    icon: Palette,
    title: "Cultural Workshops",
    desc: "Hands-on sessions exploring Filipino arts, crafts and traditions with delegates from across the region.",
    tag: "Day 2",
  },
  {
    icon: Utensils,
    title: "Cultural Gala Night",
    desc: "A festive evening of Filipino cuisine, music and dance.",
    tag: "Day 3",
  },
  {
    icon: PartyPopper,
    title: "Farewell & Island Tour",
    desc: "Closing ceremony followed by an optional island-hopping excursion.",
    tag: "Day 4",
  },
];

export function HighlightsSection() {
  return (
    <section id="highlights" className="bg-slate-50 py-24">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="text-center">
          <h2 className="text-sm font-semibold uppercase tracking-[0.25em] text-amber-600">
            Event Highlights
          </h2>
          <p className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Four Days You Won&apos;t Forget
          </p>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {HIGHLIGHTS.map(({ icon: Icon, title, desc, tag }) => (
            <div key={title} className="relative rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
              <span className="absolute right-6 top-6 text-xs font-bold uppercase tracking-widest text-amber-500">
                {tag}
              </span>
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-rose-500 text-white shadow-md">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="mt-5 text-base font-semibold text-slate-900">{title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-slate-500">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
