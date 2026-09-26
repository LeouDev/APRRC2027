"use server";

import { redirect } from "next/navigation";
import { headers } from "next/headers";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { createSessionToken, setSessionCookie, clearSessionCookie, getStaff } from "@/lib/session";
import { checkRateLimit, resetRateLimit } from "@/lib/rate-limit";

export type AuthState = { error?: string; success?: string } | null;

export async function staffLoginAction(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  if (!email || !password) return { error: "Email and password are required." };

  const ip = (await headers()).get("x-forwarded-for") ?? "local";
  const rateKey = `staff:${ip}:${email}`;
  const rate = checkRateLimit(rateKey);
  if (!rate.allowed) {
    return { error: `Too many attempts. Try again in ${Math.ceil((rate.retryAfterSeconds ?? 60) / 60)} minute(s).` };
  }

  const user = await prisma.staffUser.findUnique({ where: { email } });
  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    return { error: "Invalid email or password." };
  }
  if (!user.approvedAt) {
    return { error: "Your account is still waiting for an organizer to approve it." };
  }

  resetRateLimit(rateKey);
  await setSessionCookie(await createSessionToken({ sub: user.id, email: user.email, name: user.name }, "staff"), "staff");
  redirect("/staff");
}

export async function staffSignupAction(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");

  if (!name || name.length > 100) return { error: "Enter your name (up to 100 characters)." };
  if (!z.email().safeParse(email).success) return { error: "Enter a valid email address." };
  if (password.length < 8) return { error: "Password must be at least 8 characters." };

  const ip = (await headers()).get("x-forwarded-for") ?? "local";
  if (!checkRateLimit(`staff-signup:${ip}`).allowed) {
    return { error: "Too many sign-ups from this network. Try again later." };
  }

  try {
    await prisma.staffUser.create({ data: { name, email, passwordHash: await bcrypt.hash(password, 12) } });
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
      return { error: "An account with this email already exists." };
    }
    throw err;
  }
  return { success: "Account created! An organizer needs to approve it before you can sign in." };
}

export async function staffLogoutAction() {
  await clearSessionCookie("staff");
  redirect("/staff/login");
}

// --- Check-in ---------------------------------------------------------------
// Every function below is a public POST endpoint, so each one re-checks the
// staff session (and approval) itself.

async function requireStaff() {
  const staff = await getStaff();
  if (!staff) redirect("/staff/login");
  return staff;
}

// Just what the desk needs to verify someone against their ID — no contact,
// passport, or payment details.
const TICKET = {
  id: true,
  registrationNumber: true,
  firstName: true,
  lastName: true,
  preferredEnglishName: true,
  country: true,
  organization: true,
  position: true,
  regGroup: true,
  shirtSize: true,
  status: true,
  checkedInAt: true,
  checkedInBy: true,
  checkInDeniedAt: true,
  checkInDeniedBy: true,
  checkInDeniedReason: true,
} satisfies Prisma.ParticipantSelect;

export type Ticket = Prisma.ParticipantGetPayload<{ select: typeof TICKET }>;

export async function findTicket(id: string) {
  await requireStaff();
  return prisma.participant.findUnique({ where: { id: String(id) }, select: TICKET });
}

export async function checkIn(id: string) {
  const staff = await requireStaff();
  // Conditional update: only a Confirmed, not-yet-checked-in ticket matches, so
  // the same ticket can't be admitted twice even if two scanners approve it at
  // the same moment.
  const { count } = await prisma.participant.updateMany({
    where: { id: String(id), status: "CONFIRMED", checkedInAt: null },
    data: { checkedInAt: new Date(), checkedInBy: staff.name },
  });
  const ticket = await prisma.participant.findUnique({ where: { id: String(id) }, select: TICKET });
  return { ok: count === 1, ticket };
}

export async function denyCheckIn(id: string, reason: string) {
  const staff = await requireStaff();
  const why = String(reason ?? "").trim().slice(0, 200);
  if (why) {
    await prisma.participant.updateMany({
      where: { id: String(id), checkedInAt: null },
      data: { checkInDeniedAt: new Date(), checkInDeniedBy: staff.name, checkInDeniedReason: why },
    });
  }
  return prisma.participant.findUnique({ where: { id: String(id) }, select: TICKET });
}

export async function undoCheckIn(id: string) {
  await requireStaff();
  await prisma.participant.updateMany({ where: { id: String(id) }, data: { checkedInAt: null, checkedInBy: null } });
  return prisma.participant.findUnique({ where: { id: String(id) }, select: TICKET });
}

const LIST_LIMIT = 50;

export async function listAttendance(search: string, filter: "out" | "in" | "all") {
  await requireStaff();
  const terms = String(search ?? "").trim().split(/\s+/).filter(Boolean);
  const where: Prisma.ParticipantWhereInput = {
    status: "CONFIRMED",
    ...(filter === "in" ? { checkedInAt: { not: null } } : filter === "out" ? { checkedInAt: null } : {}),
    // Every word has to match some field, so "juan cruz" finds Juan Dela Cruz.
    AND: terms.map((term) => {
      const has = { contains: term, mode: "insensitive" as const };
      return {
        OR: [
          { firstName: has },
          { lastName: has },
          { preferredEnglishName: has },
          { registrationNumber: has },
          { organization: has },
        ],
      };
    }),
  };

  const [rows, confirmed, checkedIn] = await Promise.all([
    prisma.participant.findMany({
      where,
      select: TICKET,
      orderBy: filter === "in" ? { checkedInAt: "desc" } : [{ firstName: "asc" }, { lastName: "asc" }],
      take: LIST_LIMIT + 1,
    }),
    prisma.participant.count({ where: { status: "CONFIRMED" } }),
    prisma.participant.count({ where: { status: "CONFIRMED", checkedInAt: { not: null } } }),
  ]);

  return { rows: rows.slice(0, LIST_LIMIT), more: rows.length > LIST_LIMIT, confirmed, checkedIn };
}
