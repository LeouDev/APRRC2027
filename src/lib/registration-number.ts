import "server-only";
import { prisma } from "@/lib/prisma";

const PREFIX = "CEB";

export async function nextRegistrationNumber(): Promise<string> {
  const last = await prisma.participant.findFirst({
    where: { registrationNumber: { startsWith: PREFIX } },
    orderBy: { createdAt: "desc" },
    select: { registrationNumber: true },
  });

  let nextSeq = 1;
  if (last) {
    const n = parseInt(last.registrationNumber.slice(PREFIX.length), 10);
    if (!Number.isNaN(n)) nextSeq = n + 1;
  }

  const count = await prisma.participant.count();
  nextSeq = Math.max(nextSeq, count + 1);

  return `${PREFIX}${String(nextSeq).padStart(3, "0")}`;
}
