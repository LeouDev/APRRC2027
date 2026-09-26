import type { Metadata, Viewport } from "next";

// Its own manifest (start_url /staff) so "Add to Home Screen" from here opens
// the scanner as an app, not the public homepage.
export const metadata: Metadata = {
  manifest: "/staff.webmanifest",
  appleWebApp: { title: "APRRC Check-in", statusBarStyle: "black" },
  robots: { index: false, follow: false },
};

export const viewport: Viewport = { themeColor: "#020617" };

export default function StaffLayout({ children }: LayoutProps<"/staff">) {
  return children;
}
