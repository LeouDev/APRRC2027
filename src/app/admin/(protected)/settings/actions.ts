"use server";

import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

export type SettingsState = { error?: string; success?: string } | null;

export async function changePasswordAction(_prev: SettingsState, formData: FormData): Promise<SettingsState> {
  const session = await getSession();
  if (!session) return { error: "Not authenticated." };

  const currentPassword = String(formData.get("currentPassword") ?? "");
  const newPassword = String(formData.get("newPassword") ?? "");
  const confirmPassword = String(formData.get("confirmPassword") ?? "");

  if (newPassword.length < 8) {
    return { error: "New password must be at least 8 characters." };
  }
  if (newPassword !== confirmPassword) {
    return { error: "New password and confirmation do not match." };
  }

  const user = await prisma.adminUser.findUnique({ where: { id: session.sub } });
  if (!user) return { error: "Account not found." };

  const valid = await bcrypt.compare(currentPassword, user.passwordHash);
  if (!valid) return { error: "Current password is incorrect." };

  const passwordHash = await bcrypt.hash(newPassword, 12);
  await prisma.adminUser.update({ where: { id: user.id }, data: { passwordHash } });

  return { success: "Password updated successfully." };
}
