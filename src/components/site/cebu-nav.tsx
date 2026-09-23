"use client";

import { useEffect, useState } from "react";

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

// Matches the site's fixed navbar height plus a little clearance (also
// used as each section's scroll-mt in the Cebu page) — the line below
// which a section counts as "in view" for the active-tab highlight.
const ACTIVE_THRESHOLD_PX = 88;

export function CebuNav() {
  const [activeId, setActiveId] = useState(NAV[0].id);

  useEffect(() => {
    const sections = NAV.map((item) => document.getElementById(item.id)).filter(
      (el): el is HTMLElement => el !== null,
    );

    function updateActive() {
      let current = sections[0]?.id;
      for (const section of sections) {
        if (section.getBoundingClientRect().top <= ACTIVE_THRESHOLD_PX + 1) {
          current = section.id;
        }
      }
      if (current) setActiveId(current);
    }

    let ticking = false;
    function onScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        updateActive();
        ticking = false;
      });
    }

    updateActive();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav className="border-b border-slate-200 bg-white">
      <div className="scrollbar-thin mx-auto flex max-w-6xl gap-6 overflow-x-auto px-5 py-3 text-sm font-medium text-slate-600 sm:px-8">
        {NAV.map((item) => (
          <a
            key={item.id}
            href={`#${item.id}`}
            className={`shrink-0 border-b-2 pb-0.5 transition-colors ${
              activeId === item.id
                ? "border-amber-600 text-amber-600"
                : "border-transparent hover:text-amber-600"
            }`}
          >
            {item.label}
          </a>
        ))}
      </div>
    </nav>
  );
}
