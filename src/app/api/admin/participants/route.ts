import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { nextRegistrationNumber } from "@/lib/registration-number";
import { COUNTRY_BY_NAME } from "@/data/countries";
import type { Prisma, ParticipantStatus } from "@prisma/client";

const SORTABLE_FIELDS = new Set(["registrationDate", "firstName", "lastName", "country", "status", "createdAt"]);

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search")?.trim() || undefined;
  const country = searchParams.get("country") || undefined;
  const status = (searchParams.get("status") as ParticipantStatus) || undefined;
  const sortField = searchParams.get("sort") || "registrationDate";
  const sortDir = searchParams.get("dir") === "asc" ? "asc" : "desc";
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10) || 1);
  const pageSize = Math.min(100, Math.max(1, parseInt(searchParams.get("pageSize") ?? "20", 10) || 20));

  const where: Prisma.ParticipantWhereInput = {};
  if (country) where.country = country;
  if (status) where.status = status;
  if (search) {
    where.OR = [
      { firstName: { contains: search, mode: "insensitive" } },
      { lastName: { contains: search, mode: "insensitive" } },
      { email: { contains: search, mode: "insensitive" } },
      { registrationNumber: { contains: search, mode: "insensitive" } },
      { organization: { contains: search, mode: "insensitive" } },
    ];
  }

  const orderBy: Prisma.ParticipantOrderByWithRelationInput = {
    [SORTABLE_FIELDS.has(sortField) ? sortField : "registrationDate"]: sortDir,
  };

  const [total, participants] = await Promise.all([
    prisma.participant.count({ where }),
    prisma.participant.findMany({
      where,
      orderBy,
      skip: (page - 1) * pageSize,
      take: pageSize,
      // Exclude the raw proof-of-payment bytes from list/detail responses —
      // it's fetched separately via /proof-of-payment only when needed.
      omit: { proofOfPayment: true },
    }),
  ]);

  return NextResponse.json({
    participants,
    total,
    page,
    pageSize,
    totalPages: Math.max(1, Math.ceil(total / pageSize)),
  });
}

const createSchema = z.object({
  firstName: z.string().min(1).max(100),
  lastName: z.string().min(1).max(100),
  email: z.string().email(),
  phone: z.string().max(30).optional().or(z.literal("")),
  country: z.string().min(1),
  city: z.string().max(100).optional().or(z.literal("")),
  organization: z.string().max(150).optional().or(z.literal("")),
  position: z.string().max(150).optional().or(z.literal("")),
  status: z.enum(["PENDING", "CONFIRMED", "CANCELLED", "REJECTED"]).optional(),
  adminNotes: z.string().max(2000).optional().or(z.literal("")),
});

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid participant data.", issues: parsed.error.issues }, { status: 400 });
  }

  const data = parsed.data;
  const countryEntry = COUNTRY_BY_NAME.get(data.country);
  const registrationNumber = await nextRegistrationNumber();

  const participant = await prisma.participant.create({
    data: {
      registrationNumber,
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone || null,
      country: data.country,
      countryCode: countryEntry?.code ?? "XX",
      city: data.city || null,
      organization: data.organization || null,
      position: data.position || null,
      status: data.status ?? "PENDING",
      adminNotes: data.adminNotes || null,
    },
  });

  return NextResponse.json({ participant }, { status: 201 });
}
