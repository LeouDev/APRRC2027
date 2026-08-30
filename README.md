# APRRC '27 — Asia Pacific Regional Rotaract Conference

Official event website, registration landing, and organizer admin dashboard for APRRC '27
(May 13–16, 2027, Jpark Island Resort & Waterpark, Cebu, Philippines).

## Stack

- **Next.js 16** (App Router) + TypeScript + Tailwind CSS 4
- **Prisma 6 + SQLite** for the participant database (swap the `DATABASE_URL` provider for Postgres/MySQL in production if needed)
- Custom cookie-based admin auth (JWT via `jose`, bcrypt password hashing) — no third-party auth service
- **Recharts** for the country breakdown and registration trend charts
- **Radix UI** primitives (Dialog, Select, Tabs, Label) for accessible components

## Getting started

```bash
npm install
cp .env.example .env   # then edit ADMIN_EMAIL / ADMIN_PASSWORD / SESSION_SECRET
npx prisma migrate dev
npm run db:seed        # loads sample participants + creates the admin user
npm run dev
```

Visit `http://localhost:3000`. Admin dashboard is at `/admin` — log in with the
`ADMIN_EMAIL` / `ADMIN_PASSWORD` from your `.env` (seeded values printed at the end of `db:seed`).

## Registration flow

Public registration is **not** a native form — every "Register Now" CTA links directly to the
official Google Form (`NEXT_PUBLIC_GOOGLE_FORM_URL` in `.env`). The Google Form requires a signed-in
Google account to even view, so its exact field list couldn't be inspected automatically; the `/register`
page's "what you'll need" checklist was written from the participant schema instead. Update it if the
real form's fields differ.

Since registrations happen on the Google Form (not in this app's database), the admin dashboard's
participant data comes from three sources:
1. **Seed data** (`prisma/seed.ts`) — realistic sample participants for demoing the dashboard.
2. **CSV import** (Participants → Import CSV) — paste a Google Sheets export of the form responses;
   it maps common header names (Name/First Name/Email/Country/Organization/Phone, etc.) automatically,
   skips duplicate emails, and adds new rows as `Pending`.
3. **Manual add** (Participants → Add Participant) — for one-off entries.

Confirming/rejecting/cancelling participants, editing details, and adding organizer notes all happen
in `/admin/participants`.

## Images

A few brand assets are wired up with graceful fallbacks (soft gradient placeholder if missing — see
`src/components/site/photo.tsx`) so the site never shows a broken image icon. Drop real files into
these exact paths and they appear immediately, no code changes needed:

```
public/images/logo.png                    navbar + footer badge
public/images/banner.png                  strip above the nav (tablet/desktop)
public/images/cebu/sinulog-festival.jpg
public/images/cebu/basilica-santo-nino.jpg
public/images/cebu/magellans-cross.jpg    also used on the "500 years of history" card
public/images/cebu/skyline-night.jpg
public/images/cebu/ayala-center.jpg
public/images/cebu/city-aerial.jpg
```

## Project structure

```
src/app/(site)/            public pages — home, /register, /cebu (Navbar + Footer layout)
src/app/admin/login/       admin login (unprotected)
src/app/admin/(protected)/ dashboard, participants, settings — guarded by middleware.ts
src/app/api/admin/         participants CRUD, CSV export, CSV import (all session-protected)
src/lib/                   prisma client, session/auth, stats queries, event config
src/components/site/       public-site components
src/components/admin/      dashboard/participant-management components
src/components/charts/     Recharts wrappers
src/components/ui/         shared primitives (button, card, dialog, input, table bits)
prisma/schema.prisma       Participant + AdminUser models
prisma/seed.ts             sample data + admin user bootstrap
```

## Notes for production deployment

- `middleware.ts` uses Next's (deprecated-but-still-supported) middleware convention; Next 16 suggests
  migrating to the newer `proxy.ts` convention via `npx @next/codemod@canary middleware-to-proxy .`
  when convenient — not urgent, current setup works and is fully tested.
- SQLite (`prisma/dev.db`) is great for local dev/demo; for a real deployment on serverless hosts
  (Vercel, etc.) switch to a hosted Postgres/MySQL database, since SQLite's local file won't persist
  across serverless invocations.
- Set real values for `SESSION_SECRET`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `NEXT_PUBLIC_SITE_URL` before
  deploying — never commit `.env`.
