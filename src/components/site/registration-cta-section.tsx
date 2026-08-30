import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { EVENT } from "@/lib/event-config";

export function RegistrationCtaSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-amber-400 via-rose-500 to-blue-600 py-20">
      <div className="absolute inset-0 opacity-10">
        <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="dots" width="24" height="24" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="2" fill="white" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#dots)" />
        </svg>
      </div>
      <div className="relative mx-auto max-w-4xl px-5 text-center sm:px-8">
        <h2 className="text-3xl font-black tracking-tight text-white sm:text-4xl">
          Secure Your Seat in Cebu
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-rose-50">
          Registration for {EVENT.name} is now open. Spots fill quickly — reserve yours today and join
          delegates from around the world.
        </p>
        <Link
          href="/register"
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 text-base font-bold text-rose-600 shadow-xl transition-all hover:-translate-y-0.5"
        >
          Register Now
          <ArrowUpRight className="h-5 w-5" />
        </Link>
      </div>
    </section>
  );
}
