import type { Metadata } from "next";
import Link from "next/link";
import QRCode from "qrcode";
import { CalendarDays, MapPin, TicketX } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { EVENT } from "@/lib/event-config";
import { flagForCountryName } from "@/data/countries";
import { StatusBadge } from "@/components/ui/status-badge";

export const metadata: Metadata = { title: "My Ticket", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

async function getTicket(id: string) {
  return prisma.participant.findUnique({
    where: { id },
    select: {
      id: true,
      registrationNumber: true,
      firstName: true,
      lastName: true,
      country: true,
      organization: true,
      position: true,
      status: true,
      registrationDate: true,
    },
  });
}

export default async function TicketPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const ticket = await getTicket(id);

  if (!ticket) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center bg-slate-50 px-5 py-20 text-center">
        <TicketX className="h-12 w-12 text-slate-300" />
        <h1 className="mt-5 text-2xl font-bold text-slate-900">Ticket Not Found</h1>
        <p className="mt-2 max-w-sm text-sm text-slate-500">
          We couldn&apos;t find a registration matching this link. It may have been mistyped, or the
          registration may no longer exist.
        </p>
        <Link
          href="/register"
          className="mt-6 rounded-full bg-slate-900 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
        >
          Go to Registration
        </Link>
      </div>
    );
  }

  const qrDataUrl = await QRCode.toDataURL(ticket.registrationNumber, {
    margin: 1,
    width: 240,
    color: { dark: "#1a1a1a", light: "#ffffff" },
  });

  const fullName = `${ticket.firstName} ${ticket.lastName}`;
  const flag = flagForCountryName(ticket.country);

  return (
    <div className="relative overflow-hidden bg-slate-50 px-5 pb-16 pt-28 sm:pb-20 sm:pt-32">
      <div className="absolute -left-24 -top-10 h-96 w-96 rounded-full bg-sky-300/30 blur-[110px]" />
      <div className="absolute -right-24 bottom-0 h-96 w-96 rounded-full bg-rose-300/30 blur-[110px]" />

      <div className="relative mx-auto max-w-md">
        <div className="mb-6 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-blue-600">Delegate Ticket</p>
          <h1 className="mt-2 text-2xl font-black tracking-tight text-slate-900">{EVENT.name}</h1>
        </div>

        <div className="overflow-hidden rounded-3xl bg-white shadow-xl shadow-slate-200/60">
          {/* Brand stripe */}
          <div className="flex h-1.5">
            <div className="flex-1 bg-[#2E8B3D]" />
            <div className="flex-1 bg-[#F6B31C]" />
            <div className="flex-1 bg-[#1D6FC4]" />
            <div className="flex-1 bg-[#C1272D]" />
          </div>

          {/* Main info */}
          <div className="px-7 pb-6 pt-7">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">Delegate</p>
                <h2 className="mt-1 text-xl font-bold leading-tight text-slate-900">{fullName}</h2>
              </div>
              <StatusBadge status={ticket.status} />
            </div>

            {(ticket.organization || ticket.position) && (
              <p className="mt-1.5 text-sm text-slate-500">
                {[ticket.position, ticket.organization].filter(Boolean).join(", ")}
              </p>
            )}

            <p className="mt-1.5 text-sm text-slate-500">
              {flag} {ticket.country}
            </p>

            <div className="mt-5 rounded-xl bg-slate-50 px-4 py-3">
              <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
                Registration Number
              </p>
              <p className="mt-0.5 font-mono text-lg font-bold tracking-wide text-slate-900">
                {ticket.registrationNumber}
              </p>
            </div>
          </div>

          {/* Perforated divider */}
          <div className="relative flex items-center px-7">
            <div className="absolute -left-4 h-8 w-8 rounded-full bg-slate-50" />
            <div className="h-0 w-full border-t-2 border-dashed border-slate-200" />
            <div className="absolute -right-4 h-8 w-8 rounded-full bg-slate-50" />
          </div>

          {/* Stub */}
          <div className="flex flex-col items-center gap-5 px-7 py-7 text-center">
            {ticket.status === "CONFIRMED" ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={qrDataUrl}
                alt={`QR code for ${ticket.registrationNumber}`}
                width={160}
                height={160}
                className="rounded-xl border border-slate-100"
              />
            ) : (
              <div className="flex h-40 w-40 flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 text-center">
                <p className="text-xs font-medium text-slate-400">
                  QR check-in code unlocks once your registration is confirmed by the organizing committee.
                </p>
              </div>
            )}

            <div className="w-full space-y-2.5 text-left">
              <div className="flex items-center gap-2.5 text-sm text-slate-600">
                <CalendarDays className="h-4 w-4 shrink-0 text-slate-400" />
                {EVENT.dateLabel}
              </div>
              <div className="flex items-center gap-2.5 text-sm text-slate-600">
                <MapPin className="h-4 w-4 shrink-0 text-slate-400" />
                {EVENT.venue}, {EVENT.city}, {EVENT.country}
              </div>
            </div>
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-slate-400">
          Present this ticket (digitally or printed) at the registration desk for check-in.
        </p>
      </div>
    </div>
  );
}
