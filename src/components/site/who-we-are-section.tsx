import fs from "fs";
import path from "path";
import { EVENT } from "@/lib/event-config";
import { WhoWeAreSlideshow } from "@/components/site/who-we-are-slideshow";

// Reads whatever's in public/images/who-we-are at request time, so dropping
// in or removing photos never needs a code change.
function getPhotos(): string[] {
  const dir = path.join(process.cwd(), "public", "images", "who-we-are");
  try {
    return fs
      .readdirSync(dir)
      .filter((f) => /\.(jpe?g|png|webp)$/i.test(f))
      .sort();
  } catch {
    return [];
  }
}

export function WhoWeAreSection() {
  const photos = getPhotos();
  if (photos.length === 0) return null;

  return (
    <section id="who-we-are" className="bg-slate-900 py-24">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-sm font-semibold uppercase tracking-[0.25em] text-amber-400">
            Who Are We?
          </h2>
          <p className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            The Community Behind {EVENT.name}
          </p>
          <p className="mt-5 text-base leading-relaxed text-slate-300">
            Asia Pacific Regional Rotaract Conference 2027 is brought to you by Asia Pacific
            Rotaract MDIO, Rotary International District 3860, Rotaract Clubs of RI District 3860
            — Rotaractors and Rotarians from across the region working together to host you in{" "}
            {EVENT.city}, {EVENT.country}
          </p>
        </div>

        <div className="mt-12">
          <WhoWeAreSlideshow images={photos} />
        </div>
      </div>
    </section>
  );
}
