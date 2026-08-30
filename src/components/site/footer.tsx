import Link from "next/link";
import { Mail, MapPin } from "lucide-react";
import { EVENT } from "@/lib/event-config";

function FacebookIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M13.5 21v-7.5H16l.5-3.5h-3V7.8c0-1 .3-1.7 1.7-1.7H16.5V3.1C16.2 3 15.2 3 14 3c-2.6 0-4.4 1.6-4.4 4.5V10H7v3.5h2.6V21h3.9z" />
    </svg>
  );
}

export function Footer() {
  return (
    <footer id="contact" className="bg-slate-950 text-slate-300">
      <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="flex items-center gap-2.5 font-bold text-white">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-rose-600 text-sm font-black">
                AP
              </span>
              <span>{EVENT.name}</span>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-slate-400">
              {EVENT.fullName}. Bringing the Rotaract Asia Pacific community together in {EVENT.city}, {EVENT.country}.
            </p>
            <p className="mt-3 text-xs leading-relaxed text-slate-500">
              Organized by {EVENT.organizers.join(" · ")}
            </p>
            <a
              href="https://www.facebook.com/people/APRRC-2027-Cebu-Philippines/61589701801721/"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white"
            >
              <FacebookIcon className="h-4 w-4" /> Follow us on Facebook
            </a>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white">Explore</h4>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li><Link href="/#about" className="text-slate-400 hover:text-white">About the Event</Link></li>
              <li><Link href="/#highlights" className="text-slate-400 hover:text-white">Event Highlights</Link></li>
              <li><Link href="/cebu" className="text-slate-400 hover:text-white">Discover Cebu</Link></li>
              <li><Link href="/register" className="text-slate-400 hover:text-white">Registration</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white">Event</h4>
            <ul className="mt-4 space-y-2.5 text-sm text-slate-400">
              <li>{EVENT.dateLabel}</li>
              <li>{EVENT.venue}</li>
              <li>{EVENT.city}, {EVENT.country}</li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white">Contact</h4>
            <ul className="mt-4 space-y-3 text-sm text-slate-400">
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 shrink-0" /> {EVENT.contactEmail}
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="h-4 w-4 shrink-0" /> Cebu City, Philippines
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 text-xs text-slate-500 sm:flex-row">
          <p>&copy; {new Date().getFullYear()} {EVENT.name}. All rights reserved.</p>
          <Link href="/admin" className="hover:text-slate-300">
            Organizer Login
          </Link>
        </div>
      </div>
    </footer>
  );
}
