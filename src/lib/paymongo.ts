import "server-only";
import crypto from "crypto";

const API_BASE = "https://api.paymongo.com/v1";

function authHeader() {
  const secretKey = process.env.PAYMONGO_SECRET_KEY;
  if (!secretKey) throw new Error("PAYMONGO_SECRET_KEY is not set.");
  return `Basic ${Buffer.from(`${secretKey}:`).toString("base64")}`;
}

export type CreateCheckoutSessionParams = {
  participantId: string;
  fullName: string;
  email: string;
  amountCentavos: number;
  successUrl: string;
  cancelUrl: string;
};

export async function createCheckoutSession(
  params: CreateCheckoutSessionParams
): Promise<{ id: string; checkoutUrl: string }> {
  const res = await fetch(`${API_BASE}/checkout_sessions`, {
    method: "POST",
    headers: {
      Authorization: authHeader(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      data: {
        attributes: {
          line_items: [
            {
              name: "APRRC '27 Registration Fee",
              amount: params.amountCentavos,
              currency: "PHP",
              quantity: 1,
            },
          ],
          payment_method_types: ["card"],
          customer_email: params.email,
          description: `APRRC '27 registration for ${params.fullName}`,
          reference_number: params.participantId,
          metadata: { participantId: params.participantId },
          success_url: params.successUrl,
          cancel_url: params.cancelUrl,
          send_email_receipt: false,
          show_line_items: true,
        },
      },
    }),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`PayMongo checkout session creation failed (${res.status}): ${body}`);
  }

  const json = await res.json();
  return { id: json.data.id, checkoutUrl: json.data.attributes.checkout_url };
}

export async function isCheckoutSessionPaid(checkoutSessionId: string): Promise<boolean> {
  const res = await fetch(`${API_BASE}/checkout_sessions/${checkoutSessionId}`, {
    headers: { Authorization: authHeader() },
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`PayMongo checkout session retrieval failed (${res.status}): ${body}`);
  }

  const json = await res.json();
  const payments: Array<{ attributes: { status: string } }> = json.data.attributes.payments ?? [];
  return payments.some((p) => p.attributes.status === "paid");
}

export type PaymongoEvent = { type: string; resource: Record<string, unknown> };

/**
 * Verifies a PayMongo webhook per their own SDK's algorithm: the
 * "Paymongo-Signature" header is "t=<ts>,te=<test sig>,li=<live sig>";
 * HMAC-SHA256("<ts>.<raw body>", webhookSecret) must match whichever of
 * te/li is non-empty. Must run against the raw, unparsed request body.
 */
export function verifyPaymongoWebhook(rawBody: string, signatureHeader: string | null): PaymongoEvent | null {
  const webhookSecret = process.env.PAYMONGO_WEBHOOK_SECRET;
  if (!webhookSecret || !signatureHeader) return null;

  const parts = signatureHeader.split(",");
  if (parts.length < 3) return null;

  const timestamp = parts[0].split("=")[1];
  const testModeSignature = parts[1].split("=")[1];
  const liveModeSignature = parts[2].split("=")[1];
  const comparisonSignature = testModeSignature || liveModeSignature;
  if (!timestamp || !comparisonSignature) return null;

  const expected = crypto
    .createHmac("sha256", webhookSecret)
    .update(`${timestamp}.${rawBody}`)
    .digest("hex");

  const expectedBuf = Buffer.from(expected);
  const actualBuf = Buffer.from(comparisonSignature);
  if (expectedBuf.length !== actualBuf.length || !crypto.timingSafeEqual(expectedBuf, actualBuf)) {
    return null;
  }

  const parsed = JSON.parse(rawBody);
  const attributes = parsed.data.attributes;
  return { type: attributes.type, resource: attributes.data };
}
