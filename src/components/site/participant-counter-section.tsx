import { Globe2, Users } from "lucide-react";
import { AnimatedCounter } from "@/components/site/animated-counter";

export function ParticipantCounterSection({
  totalConfirmed,
  countryCount,
}: {
  totalConfirmed: number;
  countryCount: number;
}) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-blue-700 via-blue-600 to-teal-600 py-24">
      <div className="absolute inset-0 opacity-[0.12]">
        <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="counter-dots" width="26" height="26" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="2" fill="white" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#counter-dots)" />
        </svg>
      </div>
      <div className="absolute -left-24 bottom-0 h-80 w-80 rounded-full bg-amber-400/20 blur-[110px]" />
      <div className="absolute -right-24 top-0 h-80 w-80 rounded-full bg-rose-400/20 blur-[110px]" />

      <div className="relative mx-auto max-w-5xl px-5 text-center sm:px-8">
        <h2 className="text-sm font-semibold uppercase tracking-[0.25em] text-amber-200">
          The World Is Coming to Cebu
        </h2>

        <div className="mt-10 grid gap-10 sm:grid-cols-2">
          <div className="flex flex-col items-center">
            <Users className="mb-3 h-8 w-8 text-amber-200" />
            <AnimatedCounter
              value={totalConfirmed}
              className="text-6xl font-black tabular-nums text-white sm:text-7xl"
            />
            <p className="mt-3 text-base font-medium text-blue-100">Total Confirmed Participants</p>
          </div>

          <div className="flex flex-col items-center">
            <Globe2 className="mb-3 h-8 w-8 text-amber-200" />
            <AnimatedCounter
              value={countryCount}
              className="text-6xl font-black tabular-nums text-white sm:text-7xl"
            />
            <p className="mt-3 text-base font-medium text-blue-100">Countries Represented</p>
          </div>
        </div>

        <p className="mx-auto mt-10 max-w-xl text-sm text-blue-100/80">
          Figures update automatically as new registrations are confirmed by the organizing committee.
        </p>
      </div>
    </section>
  );
}
