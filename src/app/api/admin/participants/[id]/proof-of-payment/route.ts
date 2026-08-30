import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const participant = await prisma.participant.findUnique({
    where: { id },
    select: { proofOfPayment: true, proofOfPaymentMimeType: true, proofOfPaymentFileName: true },
  });

  if (!participant?.proofOfPayment) {
    return NextResponse.json({ error: "No proof of payment on file." }, { status: 404 });
  }

  return new NextResponse(new Uint8Array(participant.proofOfPayment), {
    headers: {
      "Content-Type": participant.proofOfPaymentMimeType ?? "application/octet-stream",
      "Content-Disposition": `inline; filename="${participant.proofOfPaymentFileName ?? "proof-of-payment"}"`,
      "Cache-Control": "private, no-store",
    },
  });
}
