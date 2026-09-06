import type { Metadata } from "next";
import Link from "next/link";
import { XCircle } from "lucide-react";
import { EVENT } from "@/lib/event-config";

export const metadata: Metadata = { title: "Payment Cancelled", robots: { index: false, follow: false } };

export default function PaymentCancelledPage() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center bg-slate-50 px-5 py-20 text-center">
      <XCircle className="h-12 w-12 text-slate-300" />
      <h1 className="mt-5 text-2xl font-bold text-slate-900">Payment Cancelled</h1>
      <p className="mx-auto mt-2 max-w-sm text-sm text-slate-500">
        Your registration was saved, but the card payment wasn&apos;t completed. Your application is
        still <strong>Pending</strong> — reach out to the organizing committee at{" "}
        <a href={`mailto:${EVENT.contactEmail}`} className="font-semibold text-amber-600">
          {EVENT.contactEmail}
        </a>{" "}
        to complete payment another way, or register again to retry by card.
      </p>
      <Link
        href="/register"
        className="mt-6 inline-block rounded-full bg-slate-900 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
      >
        Back to Registration
      </Link>
    </div>
  );
}
