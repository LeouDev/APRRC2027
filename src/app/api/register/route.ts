import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { nextRegistrationNumber } from "@/lib/registration-number";
import { COUNTRY_BY_NAME } from "@/data/countries";
import { checkRateLimit } from "@/lib/rate-limit";
import {
  registrationSchema,
  MAX_PROOF_FILE_BYTES,
  ACCEPTED_PROOF_TYPES,
} from "@/lib/registration-schema";

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const rate = checkRateLimit(`register:${ip}`);
  if (!rate.allowed) {
    return NextResponse.json(
      { error: "Too many registration attempts. Please try again later." },
      { status: 429 }
    );
  }

  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return NextResponse.json({ error: "Invalid form submission." }, { status: 400 });
  }

  const fields: Record<string, string> = {};
  for (const key of formData.keys()) {
    const value = formData.get(key);
    if (typeof value === "string") fields[key] = value;
  }
  fields.consent = fields.consent === "true" ? "true" : "";

  const parsed = registrationSchema.safeParse({
    ...fields,
    consent: fields.consent === "true",
  });

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Please check the highlighted fields.", issues: parsed.error.issues },
      { status: 400 }
    );
  }

  const data = parsed.data;
  const shirtSize = data.shirtSize === "Other" && data.shirtSizeOther ? data.shirtSizeOther : data.shirtSize;
  const district = data.district === "Other" && data.districtOther ? data.districtOther : data.district;
  const paymentMethod =
    data.paymentMethod === "OTHER" && data.paymentMethodOther ? data.paymentMethodOther : data.paymentMethod;

  // Proof of payment file
  const file = formData.get("proofOfPayment");
  if (!(file instanceof File) || file.size === 0) {
    return NextResponse.json({ error: "Proof of payment is required." }, { status: 400 });
  }
  if (file.size > MAX_PROOF_FILE_BYTES) {
    return NextResponse.json({ error: "Proof of payment file is too large (max 8MB)." }, { status: 400 });
  }
  if (!ACCEPTED_PROOF_TYPES.includes(file.type)) {
    return NextResponse.json(
      { error: "Proof of payment must be an image (JPG, PNG, WEBP, HEIC) or PDF." },
      { status: 400 }
    );
  }
  const proofBuffer = Buffer.from(await file.arrayBuffer());

  const existing = await prisma.participant.findFirst({ where: { email: data.email } });
  if (existing) {
    return NextResponse.json(
      { error: "An application with this email address has already been submitted." },
      { status: 409 }
    );
  }

  const countryEntry = COUNTRY_BY_NAME.get(data.country);
  const registrationNumber = await nextRegistrationNumber();

  const participant = await prisma.participant.create({
    data: {
      registrationNumber,
      firstName: data.firstName,
      middleName: data.middleName || null,
      lastName: data.lastName,
      gender: data.gender,
      dateOfBirth: new Date(data.dateOfBirth),
      country: data.country,
      countryCode: countryEntry?.code ?? "XX",
      passportNumber: data.passportNumber,
      rotaryId: data.rotaryId || null,
      district,
      organization: data.organization,
      position: data.position,
      email: data.email,
      phone: data.phone,
      alternatePhone: data.alternatePhone || null,
      facebookAccount: data.facebookAccount || null,
      whatsapp: data.whatsapp || null,
      instagram: data.instagram || null,
      shirtSize,
      emergencyContactName: data.emergencyContactName,
      emergencyContactRelationship: data.emergencyContactRelationship,
      emergencyContactPhone: data.emergencyContactPhone,
      emergencyContactEmail: data.emergencyContactEmail,
      dietaryRestrictions: data.dietaryRestrictions,
      medicalConditions: data.medicalConditions,
      specialAssistance: data.specialAssistance,
      paymentMethod,
      proofOfPayment: proofBuffer,
      proofOfPaymentMimeType: file.type,
      proofOfPaymentFileName: file.name,
      status: "PENDING",
    },
    select: { registrationNumber: true },
  });

  return NextResponse.json({ registrationNumber: participant.registrationNumber }, { status: 201 });
}
