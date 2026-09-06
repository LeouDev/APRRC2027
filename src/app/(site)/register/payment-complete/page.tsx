import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, Clock, TicketX } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { confirmPaymentForCheckoutSession } from "@/lib/paymongo-confirm";

export const metadata: Metadata = { title: "Payment Complete", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function PaymentCompletePage({
  searchParams,
}: {
  searchParams: Promise<{ participant?: string }>;
}) {
  const { participant: participantId } = await searchParams;

  const participant = participantId
    ? await prisma.participant.findUnique({
        where: { id: participantId },
        select: { id: true, paymongoCheckoutSessionId: true, status: true },
      })
    : null;

  if (!participant) {
    return (
      <StatusScreen
        icon={<TicketX className="h-12 w-12 text-slate-300" />}
        title="Registration Not Found"
        message="We couldn't find a matching registration for this payment link."
      />
    );
  }

  let confirmed = participant.status === "CONFIRMED";
  if (!confirmed && participant.paymongoCheckoutSessionId) {
    const result = await confirmPaymentForCheckoutSession(participant.paymongoCheckoutSessionId);
    confirmed = result.outcome === "confirmed" || result.outcome === "already_confirmed";
  }

  if (!confirmed) {
    return (
      <StatusScreen
        icon={<Clock className="h-12 w-12 text-amber-400" />}
        title="Verifying Your Payment"
        message="We're still confirming your payment with PayMongo. This usually only takes a moment — refresh this page shortly, or check back via the confirmation email once it arrives."
      />
    );
  }

  return (
    <StatusScreen
      icon={<CheckCircle2 className="h-12 w-12 text-emerald-500" />}
      title="Payment Successful!"
      message="Your registration for APRRC '27 is confirmed. A confirmation email is on its way — you can also view your ticket right now."
      action={
        <Link
          href={`/ticket/${participant.id}`}
          className="mt-6 inline-block rounded-full bg-slate-900 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
        >
          View My Ticket
        </Link>
      }
    />
  );
}

function StatusScreen({
  icon,
  title,
  message,
  action,
}: {
  icon: React.ReactNode;
  title: string;
  message: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center bg-slate-50 px-5 py-20 text-center">
      {icon}
      <h1 className="mt-5 text-2xl font-bold text-slate-900">{title}</h1>
      <p className="mt-2 max-w-sm text-sm text-slate-500">{message}</p>
      {action}
    </div>
  );
}
