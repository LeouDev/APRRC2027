"use server";

import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { createSessionToken, setSessionCookie, clearSessionCookie } from "@/lib/session";
import { checkRateLimit, resetRateLimit } from "@/lib/rate-limit";
import { headers } from "next/headers";

export type LoginState = { error?: string } | null;

export async function loginAction(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const redirectTo = String(formData.get("redirectTo") ?? "/admin");

  if (!email || !password) {
    return { error: "Email and password are required." };
  }

  const hdrs = await headers();
  const ip = hdrs.get("x-forwarded-for") ?? "local";
  const rateKey = `${ip}:${email}`;

  const rate = checkRateLimit(rateKey);
  if (!rate.allowed) {
    return { error: `Too many attempts. Try again in ${Math.ceil((rate.retryAfterSeconds ?? 60) / 60)} minute(s).` };
  }

  const user = await prisma.adminUser.findUnique({ where: { email } });
  if (!user) {
    return { error: "Invalid email or password." };
  }

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    return { error: "Invalid email or password." };
  }

  resetRateLimit(rateKey);

  const token = await createSessionToken({ sub: user.id, email: user.email, name: user.name });
  await setSessionCookie(token);

  redirect(redirectTo.startsWith("/admin") ? redirectTo : "/admin");
}

export async function logoutAction() {
  await clearSessionCookie();
  redirect("/admin/login");
}
