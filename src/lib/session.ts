import "server-only";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

// Admin and staff tokens are signed with the same SESSION_SECRET, so each one
// carries its kind as the JWT audience — otherwise a scanner could paste their
// staff token into the admin cookie and it would verify. middleware.ts checks
// the same audience for /admin.
const SESSIONS = {
  admin: { cookie: "aprrc_admin_session", maxAge: 60 * 60 * 8 }, // 8 hours
  staff: { cookie: "aprrc_staff_session", maxAge: 60 * 60 * 24 * 7 }, // a week: setup day + all 4 event days
} as const;

export type SessionKind = keyof typeof SESSIONS;

function getSecret() {
  const secret = process.env.SESSION_SECRET;
  if (!secret || secret.length < 16) {
    throw new Error("SESSION_SECRET is not set or too short. Set it in your environment.");
  }
  return new TextEncoder().encode(secret);
}

export type SessionPayload = {
  sub: string; // user id
  email: string;
  name: string;
};

export async function createSessionToken(payload: SessionPayload, kind: SessionKind = "admin") {
  return new SignJWT({ email: payload.email, name: payload.name })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(payload.sub)
    .setAudience(kind)
    .setIssuedAt()
    .setExpirationTime(`${SESSIONS[kind].maxAge}s`)
    .sign(getSecret());
}

export async function setSessionCookie(token: string, kind: SessionKind = "admin") {
  const store = await cookies();
  store.set(SESSIONS[kind].cookie, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSIONS[kind].maxAge,
  });
}

export async function clearSessionCookie(kind: SessionKind = "admin") {
  const store = await cookies();
  store.delete(SESSIONS[kind].cookie);
}

export async function getSession(kind: SessionKind = "admin"): Promise<SessionPayload | null> {
  const store = await cookies();
  const token = store.get(SESSIONS[kind].cookie)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, getSecret(), { audience: kind });
    return {
      sub: String(payload.sub),
      email: String(payload.email),
      name: String(payload.name),
    };
  } catch {
    return null;
  }
}

// Staff are re-checked against the DB on every request, so removing a scanner
// at /admin/staff locks them out immediately instead of when their week-long
// token expires.
export async function getStaff() {
  const session = await getSession("staff");
  if (!session) return null;
  return prisma.staffUser.findFirst({
    where: { id: session.sub, approvedAt: { not: null } },
    select: { id: true, name: true, email: true },
  });
}
