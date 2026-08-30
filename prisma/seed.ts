import { PrismaClient, ParticipantStatus } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

// Countries expected to attend APRRC '27, per the Asia Pacific Rotaract region.
// Philippines gets host-country weight; the rest scaled roughly by typical
// Rotaract district size in that country.
const COUNTRY_WEIGHTS: Array<{ country: string; countryCode: string; weight: number }> = [
  { country: "Philippines", countryCode: "PH", weight: 45 },
  { country: "Australia", countryCode: "AU", weight: 15 },
  { country: "Japan", countryCode: "JP", weight: 14 },
  { country: "Singapore", countryCode: "SG", weight: 12 },
  { country: "Hong Kong", countryCode: "HK", weight: 10 },
  { country: "Malaysia", countryCode: "MY", weight: 10 },
  { country: "Indonesia", countryCode: "ID", weight: 9 },
  { country: "Taiwan", countryCode: "TW", weight: 9 },
  { country: "Thailand", countryCode: "TH", weight: 8 },
  { country: "South Korea", countryCode: "KR", weight: 8 },
  { country: "China", countryCode: "CN", weight: 8 },
  { country: "Vietnam", countryCode: "VN", weight: 7 },
  { country: "New Zealand", countryCode: "NZ", weight: 7 },
  { country: "Cambodia", countryCode: "KH", weight: 5 },
  { country: "Myanmar", countryCode: "MM", weight: 5 },
  { country: "Mongolia", countryCode: "MN", weight: 4 },
  { country: "Fiji", countryCode: "FJ", weight: 4 },
  { country: "Laos", countryCode: "LA", weight: 4 },
  { country: "Macao", countryCode: "MO", weight: 4 },
  { country: "Guam", countryCode: "GU", weight: 3 },
  { country: "Timor-Leste", countryCode: "TL", weight: 3 },
  { country: "French Polynesia", countryCode: "PF", weight: 3 },
  { country: "American Samoa", countryCode: "AS", weight: 3 },
];

const FIRST_NAMES = [
  "Maria", "Juan", "Hiroshi", "Yuki", "Wei", "Li", "Min-jun", "Seo-yeon", "John", "Emily",
  "Ahmad", "Fatima", "Raj", "Priya", "Somchai", "Nok", "David", "Sarah", "Carlos", "Ana",
  "Tom", "Grace", "Kenji", "Aiko", "Budi", "Siti", "Nguyen", "Linh", "Michael", "Olivia",
];
const LAST_NAMES = [
  "Santos", "Reyes", "Tanaka", "Suzuki", "Wang", "Chen", "Kim", "Park", "Smith", "Johnson",
  "Khan", "Ali", "Patel", "Sharma", "Srisai", "Wongchai", "Brown", "Wilson", "Garcia", "Lopez",
  "Taylor", "Anderson", "Yamamoto", "Sato", "Hartono", "Wijaya", "Tran", "Pham", "Lee", "Clarke",
];
const ORGS = [
  "Rotaract Club of Cebu City", "Rotaract Club of Makati", "Rotaract Club of Tokyo West",
  "Rotaract Club of Seoul Metro", "Rotaract Club of Singapore", "Rotaract Club of Kuala Lumpur",
  "Rotaract Club of Sydney Central", "Rotaract Club of Bangkok", "Rotaract Club of Hong Kong Island",
  "Rotaract District 3860", "Rotary Club of Cebu West", "Rotaract Asia Pacific MDIO",
];
const POSITIONS = [
  "Club President", "District Governor", "Secretary", "Treasurer", "Delegate",
  "Service Chair", "International Service Director", "Committee Chair", "Member", "Sergeant-at-Arms",
];

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomDateWithinDays(days: number): Date {
  const now = Date.now();
  const past = now - Math.random() * days * 24 * 60 * 60 * 1000;
  return new Date(past);
}

function weightedStatus(): ParticipantStatus {
  const r = Math.random();
  if (r < 0.68) return ParticipantStatus.CONFIRMED;
  if (r < 0.9) return ParticipantStatus.PENDING;
  if (r < 0.96) return ParticipantStatus.CANCELLED;
  return ParticipantStatus.REJECTED;
}

async function main() {
  console.log("Seeding admin user...");
  const adminEmail = process.env.ADMIN_EMAIL ?? "admin@aprrc2027.org";
  const adminPassword = process.env.ADMIN_PASSWORD ?? "ChangeMe!2027";
  const passwordHash = await bcrypt.hash(adminPassword, 12);

  await prisma.adminUser.upsert({
    where: { email: adminEmail },
    update: { passwordHash },
    create: { email: adminEmail, name: "Event Organizer", passwordHash },
  });

  console.log("Clearing existing participants...");
  await prisma.participant.deleteMany();

  const rows: Array<{
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    country: string;
    countryCode: string;
    city: string;
    organization: string;
    position: string;
    status: ParticipantStatus;
    registrationDate: Date;
  }> = [];

  let seq = 1;
  for (const { country, countryCode, weight } of COUNTRY_WEIGHTS) {
    for (let i = 0; i < weight; i++) {
      const firstName = pick(FIRST_NAMES);
      const lastName = pick(LAST_NAMES);
      rows.push({
        firstName,
        lastName,
        email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${seq}@example.com`,
        phone: `+1555${String(1000000 + seq).slice(0, 7)}`,
        country,
        countryCode,
        city: "—",
        organization: pick(ORGS),
        position: pick(POSITIONS),
        status: weightedStatus(),
        registrationDate: randomDateWithinDays(75),
      });
      seq++;
    }
  }

  rows.sort((a, b) => a.registrationDate.getTime() - b.registrationDate.getTime());

  console.log(`Inserting ${rows.length} sample participants...`);
  let n = 1;
  for (const r of rows) {
    await prisma.participant.create({
      data: {
        registrationNumber: `APRRC-2027-${String(n).padStart(5, "0")}`,
        firstName: r.firstName,
        lastName: r.lastName,
        email: r.email,
        phone: r.phone,
        country: r.country,
        countryCode: r.countryCode,
        city: r.city,
        organization: r.organization,
        position: r.position,
        status: r.status,
        registrationDate: r.registrationDate,
        createdAt: r.registrationDate,
      },
    });
    n++;
  }

  console.log("Seed complete.");
  console.log(`Admin login: ${adminEmail} / ${adminPassword}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
