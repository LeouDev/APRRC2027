"use server";

import { refresh } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

export async function approveStaff(id: string) {
  if (!(await getSession())) throw new Error("Not authenticated.");
  await prisma.staffUser.updateMany({ where: { id }, data: { approvedAt: new Date() } });
  refresh();
}

// Denying a sign-up and revoking an approved scanner are the same thing: the
// account is deleted (they can sign up again), and getStaff() locks them out
// on their next request. Check-ins they recorded keep their name.
export async function removeStaff(id: string) {
  if (!(await getSession())) throw new Error("Not authenticated.");
  await prisma.staffUser.deleteMany({ where: { id } });
  refresh();
}
