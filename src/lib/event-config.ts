export const EVENT = {
  name: "APRRC '27",
  fullName: "Asia Pacific Regional Rotaract Conference 2027",
  tagline: "A Fiesta of Service, Friendship and Fun across the Asia Pacific.",
  city: "Cebu City",
  country: "Philippines",
  venue: "Jpark Island Resort & Waterpark",
  dateLabel: "May 13–16, 2027",
  startDate: process.env.NEXT_PUBLIC_EVENT_DATE ?? "2027-05-13T09:00:00+08:00",
  endDate: "2027-05-16T18:00:00+08:00",
  googleFormUrl:
    process.env.NEXT_PUBLIC_GOOGLE_FORM_URL ??
    "https://docs.google.com/forms/d/e/1FAIpQLSc_oi2h942OqEw3U3TKiHjQsBJ2rcR5GZ6CuDUPxXZel7jYAg/viewform",
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  contactEmail: "info@aprrc2027cebu.org",
  organizers: [
    "Rotaract Asia Pacific Multi-District Information Organization",
    "Rotary District 3860",
    "Rotaract District 3860",
  ],
} as const;
