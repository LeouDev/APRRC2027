import Link from "next/link";
import {
  Waves,
  Building2,
  Ship,
  UtensilsCrossed,
  Landmark,
  BedDouble,
  Bus,
  Camera,
  ArrowRight,
} from "lucide-react";

const FEATURES = [
  { icon: Waves, title: "Beaches", desc: "White-sand shores and turquoise waters minutes from the city." },
  { icon: Building2, title: "Cebu City", desc: "The vibrant, historic heart of the southern Philippines." },
  { icon: Ship, title: "Island Hopping", desc: "Hop between nearby islands for a day of tropical adventure." },
  { icon: UtensilsCrossed, title: "Local Food", desc: "Legendary lechon, seafood and Filipino specialties." },
  { icon: Landmark, title: "Culture", desc: "500 years of history at Magellan's Cross and Fort San Pedro." },
  { icon: BedDouble, title: "Hotels", desc: "International hotel brands to boutique island resorts." },
  { icon: Bus, title: "Transportation", desc: "Easy airport transfers and city-wide ride-hailing." },
  { icon: Camera, title: "Attractions", desc: "Whale sharks, waterfalls, mountains and heritage sites." },
];

export function CebuFeatureSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-sky-50 to-white py-24">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="text-center">
          <h2 className="text-sm font-semibold uppercase tracking-[0.25em] text-sky-600">
            Host Destination
          </h2>
          <p className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Welcome to Cebu, Philippines
          </p>
          <p className="mx-auto mt-4 max-w-2xl text-slate-500">
            An island destination that blends world-class convention facilities with unforgettable
            beaches, culture and hospitality — making it the ideal home for an international gathering.
          </p>
        </div>

        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:border-sky-200 hover:shadow-lg"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-sky-500 to-teal-500 text-white shadow-md shadow-sky-500/20">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-base font-semibold text-slate-900">{title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-slate-500">{desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link
            href="/cebu"
            className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-7 py-3.5 text-sm font-semibold text-white shadow-md transition-all hover:-translate-y-0.5 hover:bg-slate-800"
          >
            Discover Cebu
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
