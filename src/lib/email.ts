import "server-only";
import { Resend } from "resend";
import { EVENT } from "@/lib/event-config";
import { confirmationEmailHtml, type ConfirmationEmailData } from "@/lib/email-templates";

let resendClient: Resend | null = null;

function getResend(): Resend | null {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return null;
  if (!resendClient) resendClient = new Resend(apiKey);
  return resendClient;
}

export async function sendConfirmationEmail(data: ConfirmationEmailData): Promise<void> {
  const resend = getResend();
  if (!resend) {
    console.warn(
      "RESEND_API_KEY is not set — skipping confirmation email to",
      data.email
    );
    return;
  }

  const from = process.env.RESEND_FROM_EMAIL || `${EVENT.name} <onboarding@resend.dev>`;

  const { error } = await resend.emails.send({
    from,
    to: data.email,
    subject: `Welcome to ${EVENT.name}! Your Registration is Confirmed`,
    html: confirmationEmailHtml(data),
  });

  if (error) {
    // Surfaced to the caller as a log line, not thrown — a failed email
    // should never roll back or block the admin's status-change action.
    console.error("Failed to send confirmation email:", error);
  }
}
