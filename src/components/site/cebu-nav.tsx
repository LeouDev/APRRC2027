"use client";

import { useEffect, useRef, useState } from "react";

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

export function CebuNav() {
  const navRef = useRef<HTMLElement>(null);
  const [activeId, setActiveId] = useState(NAV[0].id);

  useEffect(() => {
    const sections = NAV.map((item) => document.getElementById(item.id)).filter(
      (el): el is HTMLElement => el !== null,
    );

    function updateActive() {
      const navBottom = navRef.current?.getBoundingClientRect().bottom ?? 0;
      let current = sections[0]?.id;
      for (const section of sections) {
        if (section.getBoundingClientRect().top <= navBottom + 1) {
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
    <nav
      ref={navRef}
      className="sticky top-[64px] z-30 border-b border-slate-200 bg-white/95 backdrop-blur-md sm:top-[136px] lg:top-[152px]"
    >
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
