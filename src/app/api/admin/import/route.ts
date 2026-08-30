import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { csvToRecords } from "@/lib/csv";
import { nextRegistrationNumber } from "@/lib/registration-number";
import { COUNTRY_BY_NAME } from "@/data/countries";

// Accepts a CSV export (from our own export, or a Google Sheets export of the
// registration form responses) and maps flexible header names onto our schema.
const FIELD_ALIASES: Record<string, string[]> = {
  firstName: ["firstname", "first name", "given name"],
  lastName: ["lastname", "last name", "surname", "family name"],
  fullName: ["name", "full name", "full legal name"],
  email: ["email", "email address"],
  phone: ["phone", "phone number", "mobile", "mobile number", "contact number"],
  country: ["country", "country of residence", "country/region"],
  city: ["city", "city of residence"],
  organization: ["organization", "organisation", "club", "company", "affiliation"],
  position: ["position", "title", "role", "designation"],
};

function normalizeHeader(h: string) {
  return h.trim().toLowerCase();
}

function findField(record: Record<string, string>, keys: string[]): string | undefined {
  const normalizedMap = new Map(Object.keys(record).map((k) => [normalizeHeader(k), record[k]]));
  for (const key of keys) {
    const value = normalizedMap.get(key);
    if (value) return value;
  }
  return undefined;
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body?.csv || typeof body.csv !== "string") {
    return NextResponse.json({ error: "Missing CSV content." }, { status: 400 });
  }

  const records = csvToRecords(body.csv);
  if (records.length === 0) {
    return NextResponse.json({ error: "CSV file is empty or could not be parsed." }, { status: 400 });
  }
  if (records.length > 2000) {
    return NextResponse.json({ error: "CSV has too many rows (max 2000 per import)." }, { status: 400 });
  }

  let imported = 0;
  let skipped = 0;
  const errors: string[] = [];

  for (const [index, record] of records.entries()) {
    const email = findField(record, FIELD_ALIASES.email)?.trim().toLowerCase();
    let firstName = findField(record, FIELD_ALIASES.firstName)?.trim();
    let lastName = findField(record, FIELD_ALIASES.lastName)?.trim();
    const fullName = findField(record, FIELD_ALIASES.fullName)?.trim();
    const country = findField(record, FIELD_ALIASES.country)?.trim();

    if (!firstName && !lastName && fullName) {
      const parts = fullName.split(/\s+/);
      firstName = parts[0];
      lastName = parts.slice(1).join(" ") || parts[0];
    }

    if (!email || !firstName || !lastName || !country) {
      skipped++;
      errors.push(`Row ${index + 2}: missing required field (name, email, or country).`);
      continue;
    }

    const existing = await prisma.participant.findFirst({ where: { email } });
    if (existing) {
      skipped++;
      errors.push(`Row ${index + 2}: ${email} already exists (skipped).`);
      continue;
    }

    const countryEntry = COUNTRY_BY_NAME.get(country);
    const registrationNumber = await nextRegistrationNumber();

    await prisma.participant.create({
      data: {
        registrationNumber,
        firstName,
        lastName,
        email,
        phone: findField(record, FIELD_ALIASES.phone)?.trim() || null,
        country,
        countryCode: countryEntry?.code ?? "XX",
        city: findField(record, FIELD_ALIASES.city)?.trim() || null,
        organization: findField(record, FIELD_ALIASES.organization)?.trim() || null,
        position: findField(record, FIELD_ALIASES.position)?.trim() || null,
        status: "PENDING",
      },
    });
    imported++;
  }

  return NextResponse.json({ imported, skipped, errors: errors.slice(0, 20) });
}
