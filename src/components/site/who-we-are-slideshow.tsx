"use client";

import { useEffect, useState } from "react";
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

  useEffect(() => {
    if (images.length < 2) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % images.length), INTERVAL_MS);
    return () => clearInterval(id);
  }, [images.length]);

  if (images.length === 0) return null;

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
    </div>
  );
}
