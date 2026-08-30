import type { Metadata } from "next";
import {
  Plane,
  BedDouble,
  Bus,
  Waves,
  UtensilsCrossed,
  ShieldCheck,
  Banknote,
  CloudSun,
  PhoneCall,
  MapPin,
  Landmark,
  ArrowUpRight,
} from "lucide-react";
import { EVENT } from "@/lib/event-config";
import { BuntingFlags } from "@/components/site/bunting-flags";
import { CebuGallery } from "@/components/site/cebu-gallery";
import { Photo } from "@/components/site/photo";

export const metadata: Metadata = {
  title: "Discover Cebu",
  description:
    "A complete travel guide to Cebu, Philippines for APRRC 2027 delegates — getting there, where to stay, things to do, food, safety, currency, weather and emergency information.",
};

const NAV = [
  { id: "about", label: "About Cebu" },
  { id: "getting-there", label: "Getting There" },
  { id: "stay", label: "Where to Stay" },
  { id: "transport", label: "Transportation" },
  { id: "things-to-do", label: "Things to Do" },
  { id: "beaches", label: "Beaches & Islands" },
  { id: "food", label: "Food" },
  { id: "practical", label: "Travel Tips" },
];

export default function CebuPage() {
  return (
    <div className="bg-white">
      <section className="relative flex min-h-[60svh] items-center overflow-hidden bg-white">
        <div className="absolute inset-0 bg-gradient-to-b from-sky-50 via-white to-white" />
        <div className="absolute -left-24 -top-10 h-96 w-96 rounded-full bg-sky-300/40 blur-[110px]" />
        <div className="absolute -right-24 bottom-0 h-96 w-96 rounded-full bg-rose-300/40 blur-[110px]" />
        <BuntingFlags className="absolute inset-x-0 top-16 h-14 w-full opacity-90" />
        <div className="relative mx-auto max-w-5xl px-5 py-32 text-center sm:px-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-blue-600 shadow-sm backdrop-blur-md">
            <MapPin className="h-3.5 w-3.5" /> Host Destination Guide
          </div>
          <h1 className="mt-6 text-5xl font-black tracking-tight text-slate-900 sm:text-6xl">
            Welcome to Cebu
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-slate-600">
            The Queen City of the South — where centuries of history, world-class hospitality and
            postcard-perfect islands meet. Here&apos;s everything {EVENT.name} delegates need to know.
          </p>
        </div>
      </section>

      <nav className="sticky top-[64px] z-30 border-b border-slate-200 bg-white/95 backdrop-blur-md sm:top-[136px] lg:top-[152px]">
        <div className="scrollbar-thin mx-auto flex max-w-6xl gap-6 overflow-x-auto px-5 py-3 text-sm font-medium text-slate-600 sm:px-8">
          {NAV.map((item) => (
            <a key={item.id} href={`#${item.id}`} className="shrink-0 hover:text-amber-600">
              {item.label}
            </a>
          ))}
        </div>
      </nav>

      {/* GALLERY */}
      <section className="mx-auto max-w-6xl px-5 py-16 sm:px-8">
        <h2 className="text-sm font-semibold uppercase tracking-[0.25em] text-rose-600">Glimpses of Cebu</h2>
        <p className="mt-3 text-3xl font-bold tracking-tight text-slate-900">See You There</p>
        <div className="mt-8">
          <CebuGallery />
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" className="mx-auto max-w-6xl px-5 py-20 sm:px-8">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-[0.25em] text-amber-600">About Cebu</h2>
            <p className="mt-3 text-3xl font-bold tracking-tight text-slate-900">
              The Heart of the Philippines&apos; South
            </p>
            <p className="mt-5 leading-relaxed text-slate-600">
              Cebu is the oldest city in the Philippines and the country&apos;s main gateway to the Visayas
              region. Home to over 2.9 million people in its metropolitan area, Cebu blends a bustling,
              modern business district with centuries-old heritage sites, world-class convention
              facilities, and immediate access to some of Southeast Asia&apos;s finest beaches and islands —
              making it a natural home for an international gathering.
            </p>
            <div className="mt-8 grid grid-cols-2 gap-6 sm:grid-cols-3">
              <div>
                <p className="text-2xl font-black text-slate-900">167</p>
                <p className="text-xs text-slate-500">Islands in Cebu province</p>
              </div>
              <div>
                <p className="text-2xl font-black text-slate-900">2,000+</p>
                <p className="text-xs text-slate-500">Hotel rooms nearby</p>
              </div>
              <div>
                <p className="text-2xl font-black text-slate-900">~15 min</p>
                <p className="text-xs text-slate-500">Airport to Jpark Resort</p>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="relative col-span-2 overflow-hidden rounded-2xl p-8 text-white">
              <Photo
                src="/images/cebu/magellans-cross.jpg"
                alt="Magellan's Cross shrine in Cebu"
                className="absolute inset-0 h-full w-full object-cover"
                fallbackClassName="absolute inset-0 h-full w-full bg-gradient-to-br from-sky-500 via-teal-500 to-emerald-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
              <div className="relative">
                <Landmark className="h-8 w-8" />
                <p className="mt-4 text-lg font-semibold">500 years of history</p>
                <p className="mt-1 text-sm text-white/80">
                  From Magellan&apos;s Cross to Fort San Pedro, Cebu is where East first met West in the
                  Philippines.
                </p>
              </div>
            </div>
            <div className="rounded-2xl bg-slate-900 p-6 text-white">
              <Waves className="h-6 w-6 text-teal-300" />
              <p className="mt-3 text-sm font-semibold">Island paradise</p>
              <p className="mt-1 text-xs text-slate-300">Whale sharks, reefs & white-sand beaches.</p>
            </div>
            <div className="rounded-2xl bg-amber-500 p-6 text-white">
              <UtensilsCrossed className="h-6 w-6" />
              <p className="mt-3 text-sm font-semibold">Culinary capital</p>
              <p className="mt-1 text-xs text-white/90">Home of the world-famous Cebu lechon.</p>
            </div>
          </div>
        </div>
      </section>

      {/* GETTING THERE */}
      <section id="getting-there" className="bg-slate-50 py-20">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <h2 className="text-sm font-semibold uppercase tracking-[0.25em] text-amber-600">Getting to Cebu</h2>
          <p className="mt-3 text-3xl font-bold tracking-tight text-slate-900">Plan Your Journey</p>

          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm lg:col-span-2">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-sky-500 to-teal-500 text-white">
                <Plane className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-slate-900">Mactan-Cebu International Airport (CEB)</h3>
              <p className="mt-2 leading-relaxed text-slate-600">
                Cebu is served directly by Mactan-Cebu International Airport (CEB), one of the
                Philippines&apos; busiest gateways, with direct international connections from major hubs
                including Tokyo, Seoul, Singapore, Hong Kong, Doha and more, plus frequent domestic
                flights from Manila and other Philippine cities. The airport is on Mactan Island — the
                same island as {EVENT.venue}, just a short 10–15 minute ride from arrivals to the resort.
              </p>
              <ul className="mt-4 space-y-2 text-sm text-slate-600">
                <li>• Visa-free entry for many nationalities for stays up to 30 days — check requirements for your passport.</li>
                <li>• Airport taxis, ride-hailing apps and hotel transfers are readily available on arrival.</li>
                <li>• A modern international terminal (Terminal 2) with duty-free, dining and lounges.</li>
              </ul>
            </div>
            <div className="rounded-2xl bg-slate-900 p-7 text-white">
              <h3 className="text-lg font-semibold">Airport Code</h3>
              <p className="mt-2 text-4xl font-black text-teal-300">CEB</p>
              <p className="mt-4 text-sm text-slate-300">
                Search flights to &quot;Mactan-Cebu International Airport (CEB)&quot; — not Manila (MNL).
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* WHERE TO STAY */}
      <section id="stay" className="mx-auto max-w-6xl px-5 py-20 sm:px-8">
        <h2 className="text-sm font-semibold uppercase tracking-[0.25em] text-amber-600">Where to Stay</h2>
        <p className="mt-3 text-3xl font-bold tracking-tight text-slate-900">Accommodation for Every Delegate</p>
        <div className="mt-10 grid gap-6 sm:grid-cols-3">
          {[
            { title: "Stay On-Site", desc: `${EVENT.venue} offers delegate rooms with direct access to the waterpark and conference venue.` },
            { title: "Nearby Mactan Resorts", desc: "Beachfront alternatives a short ride away, ideal for delegates extending their stay." },
            { title: "Cebu City Hotels", desc: "Business and budget-friendly hotels 30–45 minutes away for those exploring downtown." },
          ].map((s) => (
            <div key={s.title} className="rounded-2xl border border-slate-200 p-6 shadow-sm">
              <BedDouble className="h-6 w-6 text-amber-500" />
              <h3 className="mt-4 text-base font-semibold text-slate-900">{s.title}</h3>
              <p className="mt-1.5 text-sm text-slate-500">{s.desc}</p>
            </div>
          ))}
        </div>
        <p className="mt-6 text-sm text-slate-500">
          A list of partner hotels with preferential delegate rates will be shared with confirmed
          participants closer to the event.
        </p>
      </section>

      {/* TRANSPORTATION */}
      <section id="transport" className="bg-slate-50 py-20">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <h2 className="text-sm font-semibold uppercase tracking-[0.25em] text-amber-600">Transportation</h2>
          <p className="mt-3 text-3xl font-bold tracking-tight text-slate-900">Getting Around the City</p>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { title: "Ride-hailing", desc: "Grab is widely available and the easiest way to get around safely." },
              { title: "Taxis", desc: "Metered taxis are plentiful; confirm the meter is running." },
              { title: "Hotel Shuttles", desc: "Event shuttles will run between partner hotels and the venue." },
              { title: "Jeepneys & Buses", desc: "Iconic local jeepneys for the adventurous; best with a local guide." },
            ].map((t) => (
              <div key={t.title} className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
                <Bus className="h-6 w-6 text-teal-500" />
                <h3 className="mt-4 text-sm font-semibold text-slate-900">{t.title}</h3>
                <p className="mt-1.5 text-sm text-slate-500">{t.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* THINGS TO DO */}
      <section id="things-to-do" className="mx-auto max-w-6xl px-5 py-20 sm:px-8">
        <h2 className="text-sm font-semibold uppercase tracking-[0.25em] text-amber-600">Things to Do</h2>
        <p className="mt-3 text-3xl font-bold tracking-tight text-slate-900">Tourist Attractions & Culture</p>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            "Magellan's Cross & Basilica del Santo Niño",
            "Fort San Pedro",
            "Temple of Leah",
            "Sirao Flower Garden",
            "Taoist Temple",
            "Sky Experience Adventure",
            "Kawasan Falls day trip",
            "Whale shark watching in Oslob",
            "Casa Gorordo Museum",
          ].map((a) => (
            <div key={a} className="flex items-center gap-3 rounded-xl border border-slate-200 p-4 text-sm font-medium text-slate-700">
              <Landmark className="h-4 w-4 shrink-0 text-amber-500" />
              {a}
            </div>
          ))}
        </div>
      </section>

      {/* BEACHES */}
      <section id="beaches" className="bg-gradient-to-b from-sky-50 to-white py-20">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <h2 className="text-sm font-semibold uppercase tracking-[0.25em] text-sky-600">Beaches & Islands</h2>
          <p className="mt-3 text-3xl font-bold tracking-tight text-slate-900">Island Hopping Paradise</p>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { name: "Mactan Island", desc: "Resort beaches minutes from the airport, great for a half-day escape." },
              { name: "Bantayan Island", desc: "Powdery white sand, a longer day trip north of Cebu." },
              { name: "Camotes Islands", desc: "Lagoons and caves for the more adventurous traveler." },
              { name: "Moalboal", desc: "World-famous sardine run and vibrant reef diving." },
              { name: "Malapascua Island", desc: "Thresher shark diving off Cebu's northern tip." },
              { name: "Sumilon Island", desc: "A protected marine sanctuary with a stunning sandbar." },
            ].map((b) => (
              <div key={b.name} className="rounded-2xl border border-sky-100 bg-white p-6 shadow-sm">
                <Waves className="h-6 w-6 text-sky-500" />
                <h3 className="mt-4 text-base font-semibold text-slate-900">{b.name}</h3>
                <p className="mt-1.5 text-sm text-slate-500">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOD */}
      <section id="food" className="mx-auto max-w-6xl px-5 py-20 sm:px-8">
        <h2 className="text-sm font-semibold uppercase tracking-[0.25em] text-amber-600">Food & Restaurants</h2>
        <p className="mt-3 text-3xl font-bold tracking-tight text-slate-900">A Feast Awaits</p>
        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          <div className="rounded-2xl bg-amber-50 p-7">
            <UtensilsCrossed className="h-6 w-6 text-amber-600" />
            <h3 className="mt-4 text-base font-semibold text-slate-900">Must-Try Dishes</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              Cebu lechon (whole roasted pig, called the &quot;best pig ever&quot; by Anthony Bourdain),
              fresh seafood, dried mangoes, puso (hanging rice), and the sweet Filipino dessert halo-halo.
            </p>
          </div>
          <div className="rounded-2xl bg-slate-50 p-7">
            <UtensilsCrossed className="h-6 w-6 text-slate-600" />
            <h3 className="mt-4 text-base font-semibold text-slate-900">Where to Eat</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              From street-side carinderias to fine dining in IT Park and Cebu Business Park, plus a
              thriving café scene — there is something for every taste and budget.
            </p>
          </div>
        </div>
      </section>

      {/* PRACTICAL INFO */}
      <section id="practical" className="relative overflow-hidden bg-gradient-to-br from-blue-700 via-blue-600 to-teal-600 py-20 text-white">
        <div className="absolute -left-24 bottom-0 h-80 w-80 rounded-full bg-amber-400/20 blur-[110px]" />
        <div className="absolute -right-24 top-0 h-80 w-80 rounded-full bg-rose-400/20 blur-[110px]" />
        <div className="relative mx-auto max-w-6xl px-5 sm:px-8">
          <h2 className="text-sm font-semibold uppercase tracking-[0.25em] text-amber-200">Travel Essentials</h2>
          <p className="mt-3 text-3xl font-bold tracking-tight">Safety, Currency, Weather & Emergency Info</p>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl bg-white/5 p-6 ring-1 ring-white/10">
              <ShieldCheck className="h-6 w-6 text-emerald-400" />
              <h3 className="mt-4 text-sm font-semibold">Safety</h3>
              <p className="mt-1.5 text-sm text-slate-300">
                Cebu is generally safe for travelers. Use common precautions, stick to reputable
                transport, and keep valuables secure as you would in any major city.
              </p>
            </div>
            <div className="rounded-2xl bg-white/5 p-6 ring-1 ring-white/10">
              <Banknote className="h-6 w-6 text-amber-300" />
              <h3 className="mt-4 text-sm font-semibold">Currency</h3>
              <p className="mt-1.5 text-sm text-slate-300">
                Philippine Peso (₱ PHP). Cards widely accepted in hotels and malls; carry cash for
                markets, jeepneys and smaller establishments. ATMs are widely available.
              </p>
            </div>
            <div className="rounded-2xl bg-white/5 p-6 ring-1 ring-white/10">
              <CloudSun className="h-6 w-6 text-sky-300" />
              <h3 className="mt-4 text-sm font-semibold">Weather</h3>
              <p className="mt-1.5 text-sm text-slate-300">
                Tropical climate, around 27–34°C (80–93°F) year-round. May sits at the tail end of the
                dry season — pack light, breathable clothing, sunscreen and a refillable water bottle.
              </p>
            </div>
            <div className="rounded-2xl bg-white/5 p-6 ring-1 ring-white/10">
              <PhoneCall className="h-6 w-6 text-rose-300" />
              <h3 className="mt-4 text-sm font-semibold">Emergency</h3>
              <p className="mt-1.5 text-sm text-slate-300">
                National emergency hotline: <strong>911</strong>. The event team will also share a
                24/7 delegate hotline before arrival.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto flex max-w-3xl flex-col items-center gap-4 px-5 text-center sm:px-8">
          <p className="text-2xl font-bold text-slate-900">Ready to join us in Cebu?</p>
          <a
            href={EVENT.googleFormUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-amber-500 to-rose-500 px-8 py-4 text-base font-semibold text-white shadow-lg shadow-rose-500/30 transition-all hover:-translate-y-0.5"
          >
            Register Now
            <ArrowUpRight className="h-5 w-5" />
          </a>
        </div>
      </section>
    </div>
  );
}
