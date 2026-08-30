import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import type { ParticipantStatus, Prisma } from "@prisma/client";

function csvEscape(value: unknown): string {
  const str = value === null || value === undefined ? "" : String(value);
  if (/[",\n]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

const COLUMNS = [
  "registrationNumber",
  "firstName",
  "middleName",
  "lastName",
  "gender",
  "dateOfBirth",
  "email",
  "phone",
  "country",
  "passportNumber",
  "organization",
  "position",
  "shirtSize",
  "dietaryRestrictions",
  "medicalConditions",
  "specialAssistance",
  "emergencyContactName",
  "emergencyContactRelationship",
  "emergencyContactPhone",
  "paymentMethod",
  "status",
  "registrationDate",
  "adminNotes",
] as const;

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const country = searchParams.get("country") || undefined;
  const status = (searchParams.get("status") as ParticipantStatus) || undefined;
  const dateFrom = searchParams.get("dateFrom") || undefined;
  const dateTo = searchParams.get("dateTo") || undefined;
  const search = searchParams.get("search") || undefined;

  const where: Prisma.ParticipantWhereInput = {};
  if (country) where.country = country;
  if (status) where.status = status;
  if (dateFrom || dateTo) {
    where.registrationDate = {
      ...(dateFrom ? { gte: new Date(dateFrom) } : {}),
      ...(dateTo ? { lte: new Date(dateTo) } : {}),
    };
  }
  if (search) {
    where.OR = [
      { firstName: { contains: search, mode: "insensitive" } },
      { lastName: { contains: search, mode: "insensitive" } },
      { email: { contains: search, mode: "insensitive" } },
      { registrationNumber: { contains: search, mode: "insensitive" } },
      { organization: { contains: search, mode: "insensitive" } },
    ];
  }

  const participants = await prisma.participant.findMany({
    where,
    orderBy: { registrationDate: "desc" },
    omit: { proofOfPayment: true },
  });

  const rows = [
    COLUMNS.join(","),
    ...participants.map((p) =>
      COLUMNS.map((col) => {
        const raw = p[col];
        const value = raw instanceof Date ? raw.toISOString() : raw;
        return csvEscape(value);
      }).join(",")
    ),
  ];

  const csv = rows.join("\n");
  const filename = `aprrc-2027-participants-${new Date().toISOString().slice(0, 10)}.csv`;

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
