import { NextRequest, NextResponse } from "next/server";
import { verifyPaymongoWebhook } from "@/lib/paymongo";
import { confirmPaymentForCheckoutSession } from "@/lib/paymongo-confirm";

// Durable backstop for confirming card payments: the success-page redirect
// (registration-form.tsx -> /register/payment-complete) handles the common
// case, but a user who pays and then closes the tab before the redirect
// fires would otherwise stay stuck Pending forever. This re-runs the same
// verified confirmation whenever PayMongo reports the payment as paid.
export async function POST(req: NextRequest) {
  const rawBody = await req.text();
  const signature = req.headers.get("paymongo-signature");

  const event = verifyPaymongoWebhook(rawBody, signature);
  if (!event) {
    return NextResponse.json({ error: "Invalid signature." }, { status: 400 });
  }

  if (event.type === "checkout_session.payment.paid") {
    const checkoutSessionId = event.resource?.id as string | undefined;
    if (checkoutSessionId) {
      try {
        await confirmPaymentForCheckoutSession(checkoutSessionId);
      } catch (err) {
        console.error("PayMongo webhook confirmation failed:", err);
      }
    } else {
      console.error("PayMongo webhook: checkout_session.payment.paid event had no resource id", event.resource);
    }
  }

  return NextResponse.json({ received: true });
}
