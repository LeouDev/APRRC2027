"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight, ExternalLink } from "lucide-react";

type Restaurant = {
  name: string;
  cuisine: string;
  distinction: "Bib Gourmand" | "Selected Restaurants";
  url: string;
};

const RESTAURANTS: Restaurant[] = [
  {
    name: "Lasa",
    cuisine: "Filipino",
    distinction: "Bib Gourmand",
    url: "https://guide.michelin.com/en/central-visayas/cebu-city_2340421/restaurant/lasa-1241166",
  },
  {
    name: "Esmen",
    cuisine: "Filipino",
    distinction: "Bib Gourmand",
    url: "https://www.facebook.com/esmencarinderia/",
  },
  {
    name: "Pares Batchoy Food House",
    cuisine: "Filipino",
    distinction: "Bib Gourmand",
    url: "https://www.facebook.com/p/Pares-Batchoy-Food-House-61550258849279/",
  },
  {
    name: "The Pig & Palm",
    cuisine: "European",
    distinction: "Bib Gourmand",
    url: "http://thepigandpalm.ph/",
  },
  {
    name: "Cur8",
    cuisine: "Asian",
    distinction: "Bib Gourmand",
    url: "https://www.facebook.com/cur8.ph/",
  },
  {
    name: "Abaseria Deli & Cafe",
    cuisine: "Filipino",
    distinction: "Bib Gourmand",
    url: "https://www.facebook.com/abaseriaofficial/",
  },
  {
    name: "Sialo",
    cuisine: "Filipino",
    distinction: "Selected Restaurants",
    url: "https://sialocebu.com/",
  },
  {
    name: "Socarrat",
    cuisine: "Spanish",
    distinction: "Selected Restaurants",
    url: "https://www.facebook.com/socarratcebu/",
  },
  {
    name: "Abli",
    cuisine: "Filipino (Cebuano)",
    distinction: "Selected Restaurants",
    url: "https://www.facebook.com/ablirestaurant/",
  },
  {
    name: "ATO-AH",
    cuisine: "Filipino (Cebuano)",
    distinction: "Selected Restaurants",
    url: "https://www.instagram.com/atoah.ph/",
  },
];

export function MichelinCarousel() {
  const scrollerRef = useRef<HTMLDivElement>(null);

  function scrollByCard(direction: 1 | -1) {
    const el = scrollerRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>("[data-card]");
    const amount = (card?.offsetWidth ?? 260) + 16;
    el.scrollBy({ left: amount * direction, behavior: "smooth" });
  }

  return (
    <div>
      <div ref={scrollerRef} className="scrollbar-thin flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2">
        {RESTAURANTS.map((r, i) => (
          <a
            key={r.name}
            data-card
            href={r.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group w-60 shrink-0 snap-start rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md sm:w-64"
          >
            <div className="flex items-center justify-between">
              <span
                className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${
                  r.distinction === "Bib Gourmand"
                    ? "bg-red-50 text-red-700"
                    : "bg-slate-100 text-slate-600"
                }`}
              >
                {r.distinction}
              </span>
              <span className="text-xs font-semibold text-slate-400">#{i + 1}</span>
            </div>
            <h4 className="mt-3 text-base font-semibold text-slate-900 group-hover:text-amber-600">
              {r.name}
            </h4>
            <p className="mt-1 text-sm text-slate-500">{r.cuisine}</p>
            <span className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-blue-600">
              Visit website <ExternalLink className="h-3 w-3" />
            </span>
          </a>
        ))}
      </div>
      <div className="mt-4 flex items-center justify-between">
        <a
          href="https://guide.michelin.com/ph/en/central-visayas/cebu-city_2340421/restaurants"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs font-medium text-slate-400 hover:text-slate-600"
        >
          Selections via the MICHELIN Guide
        </a>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => scrollByCard(-1)}
            aria-label="Previous restaurant"
            className="rounded-full border border-slate-200 p-2 text-slate-600 hover:bg-slate-50"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => scrollByCard(1)}
            aria-label="Next restaurant"
            className="rounded-full border border-slate-200 p-2 text-slate-600 hover:bg-slate-50"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
