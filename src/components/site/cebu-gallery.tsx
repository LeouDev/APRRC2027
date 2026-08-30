import { Photo } from "@/components/site/photo";

const PHOTOS = [
  { src: "/images/cebu/sinulog-festival.jpg", caption: "Sinulog Festival", span: "sm:col-span-2 sm:row-span-2" },
  { src: "/images/cebu/basilica-santo-nino.jpg", caption: "Basilica del Santo Niño", span: "" },
  { src: "/images/cebu/magellans-cross.jpg", caption: "Magellan's Cross", span: "" },
  { src: "/images/cebu/skyline-night.jpg", caption: "Cebu Skyline at Night", span: "" },
  { src: "/images/cebu/ayala-center.jpg", caption: "Ayala Center Cebu", span: "" },
  { src: "/images/cebu/city-aerial.jpg", caption: "Cebu City & Mactan Channel", span: "sm:col-span-2" },
];

export function CebuGallery() {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:[grid-auto-rows:9rem]">
      {PHOTOS.map((p) => (
        <div
          key={p.src}
          className={`group relative overflow-hidden rounded-2xl bg-slate-100 ${p.span}`}
        >
          <Photo
            src={p.src}
            alt={p.caption}
            className="h-full min-h-32 w-full object-cover transition-transform duration-500 group-hover:scale-105"
            fallbackClassName="h-full min-h-32 w-full"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/0 to-transparent" />
          <p className="absolute bottom-2.5 left-3 right-3 text-xs font-semibold text-white drop-shadow sm:text-sm">
            {p.caption}
          </p>
        </div>
      ))}
    </div>
  );
}
