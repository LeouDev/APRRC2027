import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { COUNTRY_BY_NAME } from "@/data/countries";
import { sendConfirmationEmail } from "@/lib/email";

const updateSchema = z.object({
  firstName: z.string().min(1).max(100).optional(),
  lastName: z.string().min(1).max(100).optional(),
  email: z.string().email().optional(),
  phone: z.string().max(30).nullable().optional(),
  country: z.string().min(1).optional(),
  city: z.string().max(100).nullable().optional(),
  organization: z.string().max(150).nullable().optional(),
  position: z.string().max(150).nullable().optional(),
  status: z.enum(["PENDING", "CONFIRMED", "CANCELLED", "REJECTED"]).optional(),
  regGroup: z.string().max(50).nullable().optional(),
  adminNotes: z.string().max(2000).nullable().optional(),
});

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const participant = await prisma.participant.findUnique({
    where: { id },
    omit: { proofOfPayment: true },
  });
  if (!participant) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ participant });
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json().catch(() => null);
  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid update data.", issues: parsed.error.issues }, { status: 400 });
  }

  const data = parsed.data;
  const countryCode = data.country ? COUNTRY_BY_NAME.get(data.country)?.code : undefined;

  try {
    const before = await prisma.participant.findUnique({ where: { id }, select: { status: true, email: true } });

    const participant = await prisma.participant.update({
      where: { id },
      data: {
        ...data,
        ...(countryCode ? { countryCode } : {}),
      },
      omit: { proofOfPayment: true },
    });

    const finalStatus = data.status ?? before?.status;
    const justConfirmed = data.status === "CONFIRMED" && before?.status !== "CONFIRMED";
    // A ticket getting reassigned to someone else (e.g. the original registrant
    // can't attend and hands it off) — same signal a fresh confirmation should
    // go out, just without a status change to key off since it was already
    // Confirmed. Editing a typo in the email obviously fires this too, but
    // that's harmless: the "new" address is the correct one to notify.
    const transferredWhileConfirmed =
      finalStatus === "CONFIRMED" && !justConfirmed && !!before && data.email !== undefined && data.email !== before.email;

    if (justConfirmed || transferredWhileConfirmed) {
      // Best-effort: a failed email should never fail the update itself.
      sendConfirmationEmail({
        id: participant.id,
        registrationNumber: participant.registrationNumber,
        fullName: `${participant.firstName} ${participant.lastName}`,
        email: participant.email,
        registrationDate: participant.registrationDate,
      }).catch((err) => console.error("sendConfirmationEmail failed:", err));
    }

    return NextResponse.json({ participant });
  } catch {
    return NextResponse.json({ error: "Participant not found." }, { status: 404 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    await prisma.participant.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Participant not found." }, { status: 404 });
  }
}
