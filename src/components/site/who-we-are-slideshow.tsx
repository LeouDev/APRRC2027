"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Photo } from "@/components/site/photo";

const INTERVAL_MS = 4500;

export function WhoWeAreSlideshow({ images }: { images: string[] }) {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(false);
    const raf = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(raf);
  }, [index]);

  // Depending on `index` restarts the countdown after every advance, manual
  // or automatic, so clicking next/prev doesn't get cut off by a tick.
  useEffect(() => {
    if (images.length < 2) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % images.length), INTERVAL_MS);
    return () => clearInterval(id);
  }, [index, images.length]);

  if (images.length === 0) return null;

  const goNext = () => setIndex((i) => (i + 1) % images.length);
  const goPrev = () => setIndex((i) => (i - 1 + images.length) % images.length);

  return (
    <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl bg-slate-800">
      <Photo
        key={images[index]}
        src={`/images/who-we-are/${images[index]}`}
        alt="APRRC community moment"
        fallback={null}
        priority={index === 0}
        className={`h-full w-full object-cover transition-opacity duration-700 ${
          visible ? "opacity-100" : "opacity-0"
        }`}
      />

      {images.length > 1 && (
        <>
          <button
            type="button"
            onClick={goPrev}
            aria-label="Previous photo"
            className="absolute left-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm transition-colors hover:bg-black/60"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={goNext}
            aria-label="Next photo"
            className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm transition-colors hover:bg-black/60"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
          <div className="absolute bottom-3 right-3 rounded-full bg-black/40 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-sm">
            {index + 1} / {images.length}
          </div>
        </>
      )}
    </div>
  );
}
