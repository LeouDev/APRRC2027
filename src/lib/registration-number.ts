import "server-only";
import { prisma } from "@/lib/prisma";

const PREFIX = "APRRC-2027";

export async function nextRegistrationNumber(): Promise<string> {
  const last = await prisma.participant.findFirst({
    where: { registrationNumber: { startsWith: `${PREFIX}-` } },
    orderBy: { createdAt: "desc" },
    select: { registrationNumber: true },
  });

  let nextSeq = 1;
  if (last) {
    const parts = last.registrationNumber.split("-");
    const n = parseInt(parts[parts.length - 1], 10);
    if (!Number.isNaN(n)) nextSeq = n + 1;
  }

  const count = await prisma.participant.count();
  nextSeq = Math.max(nextSeq, count + 1);

  return `${PREFIX}-${String(nextSeq).padStart(5, "0")}`;
}
