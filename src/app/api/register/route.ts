import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { nextRegistrationNumber } from "@/lib/registration-number";
import { COUNTRY_BY_NAME } from "@/data/countries";
import { checkRateLimit } from "@/lib/rate-limit";
import { EVENT } from "@/lib/event-config";
import { createCheckoutSession } from "@/lib/paymongo";
import {
  registrationSchema,
  MAX_PROOF_FILE_BYTES,
  ACCEPTED_PROOF_TYPES,
  REGISTRATION_FEE_PHP_CENTAVOS,
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

  // Proof of payment file — not applicable to card payments, which are
  // verified directly against PayMongo instead of an uploaded receipt.
  const isCardPayment = paymentMethod === "CARD";
  let proofBuffer: Buffer<ArrayBuffer> | null = null;
  let proofMimeType: string | null = null;
  let proofFileName: string | null = null;

  if (!isCardPayment) {
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
    proofBuffer = Buffer.from(await file.arrayBuffer());
    proofMimeType = file.type;
    proofFileName = file.name;
  }

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
      proofOfPaymentMimeType: proofMimeType,
      proofOfPaymentFileName: proofFileName,
      status: "PENDING",
    },
    select: { id: true, registrationNumber: true, firstName: true, lastName: true, email: true },
  });

  if (!isCardPayment) {
    return NextResponse.json({ registrationNumber: participant.registrationNumber }, { status: 201 });
  }

  try {
    const { id: checkoutSessionId, checkoutUrl } = await createCheckoutSession({
      participantId: participant.id,
      fullName: `${participant.firstName} ${participant.lastName}`,
      email: participant.email,
      amountCentavos: REGISTRATION_FEE_PHP_CENTAVOS,
      successUrl: `${EVENT.siteUrl}/register/payment-complete?participant=${participant.id}`,
      cancelUrl: `${EVENT.siteUrl}/register/payment-cancelled?participant=${participant.id}`,
    });

    await prisma.participant.update({
      where: { id: participant.id },
      data: { paymongoCheckoutSessionId: checkoutSessionId },
    });

    return NextResponse.json(
      { registrationNumber: participant.registrationNumber, checkoutUrl },
      { status: 201 }
    );
  } catch (err) {
    console.error("PayMongo checkout session creation failed:", err);
    return NextResponse.json(
      {
        error:
          "Your registration was saved, but we couldn't start the card payment. Please contact the organizing committee to complete payment.",
        registrationNumber: participant.registrationNumber,
      },
      { status: 502 }
    );
  }
}
