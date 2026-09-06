import "server-only";
import { prisma } from "@/lib/prisma";
import { isCheckoutSessionPaid } from "@/lib/paymongo";
import { sendConfirmationEmail } from "@/lib/email";

/**
 * Re-verifies payment status directly against PayMongo (never trusts a
 * redirect or webhook body on its own) and confirms the matching
 * participant exactly once. Called from both the success-page redirect
 * (fast path) and the webhook (durable backstop for abandoned redirects).
 */
export async function confirmPaymentForCheckoutSession(checkoutSessionId: string): Promise<{
  outcome: "confirmed" | "already_confirmed" | "not_paid" | "not_found";
}> {
  const participant = await prisma.participant.findFirst({
    where: { paymongoCheckoutSessionId: checkoutSessionId },
    select: { id: true, status: true, firstName: true, lastName: true, email: true, registrationNumber: true, registrationDate: true },
  });

  if (!participant) return { outcome: "not_found" };
  if (participant.status === "CONFIRMED") return { outcome: "already_confirmed" };

  const paid = await isCheckoutSessionPaid(checkoutSessionId);
  if (!paid) return { outcome: "not_paid" };

  await prisma.participant.update({
    where: { id: participant.id },
    data: { status: "CONFIRMED" },
  });

  sendConfirmationEmail({
    id: participant.id,
    registrationNumber: participant.registrationNumber,
    fullName: `${participant.firstName} ${participant.lastName}`,
    email: participant.email,
    registrationDate: participant.registrationDate,
  }).catch((err) => console.error("sendConfirmationEmail failed:", err));

  return { outcome: "confirmed" };
}
