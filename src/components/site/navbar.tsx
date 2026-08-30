"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, X, ArrowUpRight } from "lucide-react";
import { EVENT } from "@/lib/event-config";
import { cn } from "@/lib/utils";
import { Photo } from "@/components/site/photo";

const LINKS = [
  { href: "/#about", label: "About" },
  { href: "/#event", label: "Event" },
  { href: "/register", label: "Registration" },
  { href: "/cebu", label: "Cebu" },
  { href: "/#contact", label: "Contact" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-40 transition-all duration-300",
        scrolled || open
          ? "bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-200"
          : "bg-white/70 backdrop-blur-sm"
      )}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">
        <Link href="/" className="flex items-center gap-2.5 font-bold tracking-tight">
          <Photo
            src="/images/logo.png"
            alt={`${EVENT.name} logo`}
            className="h-9 w-9 rounded-full object-cover shadow-md"
            fallback={
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-rose-600 text-sm font-black text-white shadow-md">
                AP
              </span>
            }
          />
          <span className="text-base text-slate-900 sm:text-lg">
            {EVENT.name}
            <span className="hidden sm:inline"> · Cebu</span>
          </span>
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-slate-700 transition-colors hover:text-rose-600"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="hidden md:block">
          <a
            href={EVENT.googleFormUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-amber-500 to-rose-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-rose-500/25 transition-all hover:-translate-y-0.5 hover:shadow-xl"
          >
            Register Now
            <ArrowUpRight className="h-4 w-4" />
          </a>
        </div>

        <button
          className="flex h-10 w-10 items-center justify-center rounded-full text-slate-900 md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {open && (
        <div className="border-t border-slate-200 bg-white px-5 py-4 md:hidden">
          <div className="flex flex-col gap-4">
            {LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="text-sm font-medium text-slate-700"
              >
                {link.label}
              </Link>
            ))}
            <a
              href={EVENT.googleFormUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-1.5 rounded-full bg-gradient-to-r from-amber-500 to-rose-500 px-5 py-3 text-sm font-semibold text-white shadow-md"
            >
              Register Now
              <ArrowUpRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
