import { EVENT } from "@/lib/event-config";

const DRIVE_FILE_ID = "17kyEOs1Z39yUYASaQdWzptZA7gOIE94E";

export function PromoVideoSection() {
  return (
    <section className="bg-white py-24">
      <div className="mx-auto max-w-5xl px-5 sm:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-sm font-semibold uppercase tracking-[0.25em] text-amber-600">
            Watch
          </h2>
          <p className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            {EVENT.name} Promotional Video
          </p>
        </div>

        <div className="mt-12 aspect-video w-full overflow-hidden rounded-2xl border border-slate-200 shadow-lg">
          <iframe
            src={`https://drive.google.com/file/d/${DRIVE_FILE_ID}/preview`}
            title={`${EVENT.name} Promotional Video`}
            className="h-full w-full"
            allow="autoplay; fullscreen"
            allowFullScreen
          />
        </div>
      </div>
    </section>
  );
}
