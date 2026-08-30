import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "sonner";
import { EVENT } from "@/lib/event-config";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const title = `${EVENT.name} | Asia Pacific Regional Rotaract Conference in Cebu, Philippines`;
const description = `${EVENT.fullName} — ${EVENT.dateLabel} at ${EVENT.venue} in ${EVENT.city}, ${EVENT.country}. Join Rotaractors from across the Asia Pacific. Register now.`;

export const metadata: Metadata = {
  metadataBase: new URL(EVENT.siteUrl),
  title: {
    default: title,
    template: `%s | ${EVENT.name}`,
  },
  description,
  keywords: [
    "international event Cebu",
    "Cebu Philippines event",
    "international conference Cebu",
    "Cebu event registration",
    "Philippines international event",
    "Rotaract Cebu",
    "APRRC 2027",
    "Asia Pacific Regional Rotaract Conference",
    EVENT.name,
    EVENT.fullName,
  ],
  applicationName: EVENT.name,
  manifest: "/manifest.webmanifest",
  openGraph: {
    title,
    description,
    url: EVENT.siteUrl,
    siteName: EVENT.name,
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#ffffff",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
        <Toaster richColors position="top-center" />
      </body>
    </html>
  );
}
