"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight, ExternalLink } from "lucide-react";
import { Photo } from "@/components/site/photo";

type Restaurant = {
  name: string;
  cuisine: string;
  distinction: "Bib Gourmand" | "Selected Restaurants";
  url: string;
  image: string;
};

const RESTAURANTS: Restaurant[] = [
  {
    name: "Lasa",
    cuisine: "Filipino",
    distinction: "Bib Gourmand",
    url: "https://guide.michelin.com/en/central-visayas/cebu-city_2340421/restaurant/lasa-1241166",
    image: "/images/cebu/cuisine/filipino.jpg",
  },
  {
    name: "Esmen",
    cuisine: "Filipino",
    distinction: "Bib Gourmand",
    url: "https://www.facebook.com/esmencarinderia/",
    image: "/images/cebu/cuisine/sisig.jpg",
  },
  {
    name: "Pares Batchoy Food House",
    cuisine: "Filipino",
    distinction: "Bib Gourmand",
    url: "https://www.facebook.com/p/Pares-Batchoy-Food-House-61550258849279/",
    image: "/images/cebu/cuisine/kare-kare.jpg",
  },
  {
    name: "The Pig & Palm",
    cuisine: "European",
    distinction: "Bib Gourmand",
    url: "http://thepigandpalm.ph/",
    image: "/images/cebu/cuisine/european.jpg",
  },
  {
    name: "Cur8",
    cuisine: "Asian",
    distinction: "Bib Gourmand",
    url: "https://www.facebook.com/cur8.ph/",
    image: "/images/cebu/cuisine/asian.jpg",
  },
  {
    name: "Abaseria Deli & Cafe",
    cuisine: "Filipino",
    distinction: "Bib Gourmand",
    url: "https://www.facebook.com/abaseriaofficial/",
    image: "/images/cebu/cuisine/sinigang.jpg",
  },
  {
    name: "Sialo",
    cuisine: "Filipino",
    distinction: "Selected Restaurants",
    url: "https://sialocebu.com/",
    image: "/images/cebu/cuisine/pancit.jpg",
  },
  {
    name: "Socarrat",
    cuisine: "Spanish",
    distinction: "Selected Restaurants",
    url: "https://www.facebook.com/socarratcebu/",
    image: "/images/cebu/cuisine/spanish.jpg",
  },
  {
    name: "Abli",
    cuisine: "Filipino (Cebuano)",
    distinction: "Selected Restaurants",
    url: "https://www.facebook.com/ablirestaurant/",
    image: "/images/cebu/cuisine/filipino-cebuano.jpg",
  },
  {
    name: "ATO-AH",
    cuisine: "Filipino (Cebuano)",
    distinction: "Selected Restaurants",
    url: "https://www.instagram.com/atoah.ph/",
    image: "/images/cebu/cuisine/humba.jpg",
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
            className="group w-60 shrink-0 snap-start overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md sm:w-64"
          >
            <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
              <Photo
                src={r.image}
                alt={`Representative ${r.cuisine} dish`}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                fallbackClassName="h-full w-full"
              />
              <div className="absolute inset-x-0 top-0 flex items-center justify-between p-3">
                <span
                  className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide backdrop-blur-sm ${
                    r.distinction === "Bib Gourmand" ? "bg-red-50/95 text-red-700" : "bg-white/90 text-slate-600"
                  }`}
                >
                  {r.distinction}
                </span>
                <span className="rounded-full bg-slate-900/70 px-2 py-1 text-[10px] font-semibold text-white">
                  #{i + 1}
                </span>
              </div>
              <span className="absolute bottom-2 left-2 rounded-full bg-slate-900/70 px-2 py-0.5 text-[9px] font-medium text-white">
                Representative dish
              </span>
            </div>
            <div className="p-5">
              <h4 className="text-base font-semibold text-slate-900 group-hover:text-amber-600">{r.name}</h4>
              <p className="mt-1 text-sm text-slate-500">{r.cuisine}</p>
              <span className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-blue-600">
                Visit website <ExternalLink className="h-3 w-3" />
              </span>
            </div>
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
      <p className="mt-3 text-xs leading-relaxed text-slate-400">
        Photos show a representative dish, not the specific restaurant — freely-licensed images via{" "}
        <a href="https://commons.wikimedia.org/wiki/File:Chicken_Adobo_over_rice.jpg" target="_blank" rel="noopener noreferrer" className="underline hover:text-slate-600">Jack Lawrence</a>,{" "}
        <a href="https://commons.wikimedia.org/wiki/File:Sizzling_Sisig.jpg" target="_blank" rel="noopener noreferrer" className="underline hover:text-slate-600">Ej Afable</a>,{" "}
        <a href="https://commons.wikimedia.org/wiki/File:Mac_MG_5939.jpg" target="_blank" rel="noopener noreferrer" className="underline hover:text-slate-600">GwennVienn</a>,{" "}
        <a href="https://www.pexels.com/photo/delicious-meal-with-steak-in-restaurant-5491046/" target="_blank" rel="noopener noreferrer" className="underline hover:text-slate-600">Rachel Claire</a>,{" "}
        <a href="https://www.pexels.com/photo/food-plating-of-rice-and-dim-sum-5409017/" target="_blank" rel="noopener noreferrer" className="underline hover:text-slate-600">Momo King</a>,{" "}
        <a href="https://commons.wikimedia.org/wiki/File:Sinigang_na_baboy.jpg" target="_blank" rel="noopener noreferrer" className="underline hover:text-slate-600">Anne Molina</a>,{" "}
        <a href="https://www.pexels.com/photo/pancit-with-mixed-vegetable-toppings-5724558/" target="_blank" rel="noopener noreferrer" className="underline hover:text-slate-600">Christian Moises Pahati</a>,{" "}
        <a href="https://commons.wikimedia.org/wiki/File:Spanish_Paella_(Unsplash).jpg" target="_blank" rel="noopener noreferrer" className="underline hover:text-slate-600">Cel Lisboa</a>,{" "}
        <a href="https://commons.wikimedia.org/wiki/File:Lechon_De_Cebu.jpg" target="_blank" rel="noopener noreferrer" className="underline hover:text-slate-600">EMMAN A. FORONDA</a>, and{" "}
        <a href="https://commons.wikimedia.org/wiki/File:Humba_(Philippines).jpg" target="_blank" rel="noopener noreferrer" className="underline hover:text-slate-600">Obsidian Soul</a>.
      </p>
    </div>
  );
}
