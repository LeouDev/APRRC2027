"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

// Renders a real photo if present in /public, otherwise degrades to a soft
// brand-colored gradient instead of a broken-image icon. Lets us wire up
// image slots ahead of the actual asset files being dropped into /public.
export function Photo({
  src,
  alt,
  className,
  fallbackClassName,
  fallback,
}: {
  src: string;
  alt: string;
  className?: string;
  fallbackClassName?: string;
  fallback?: React.ReactNode;
}) {
  const [errored, setErrored] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    // A 404 can resolve before React hydrates and attaches onError, so the
    // native error event fires into the void. Catch that already-failed
    // state on mount instead of relying on onError alone.
    const el = imgRef.current;
    if (el && el.complete && el.naturalWidth === 0) {
      setErrored(true);
    }
  }, [src]);

  if (errored) {
    if (fallback) return <>{fallback}</>;
    return (
      <div
        className={cn(
          "bg-gradient-to-br from-sky-200 via-rose-100 to-amber-100",
          fallbackClassName ?? className
        )}
        role="img"
        aria-label={alt}
      />
    );
  }

  // eslint-disable-next-line @next/next/no-img-element
  return (
    <img
      ref={imgRef}
      src={src}
      alt={alt}
      className={className}
      loading="lazy"
      onError={() => setErrored(true)}
    />
  );
}
