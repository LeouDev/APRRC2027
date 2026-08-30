import type { MetadataRoute } from "next";
import { EVENT } from "@/lib/event-config";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/api/"],
      },
    ],
    sitemap: `${EVENT.siteUrl}/sitemap.xml`,
  };
}
