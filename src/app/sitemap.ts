import type { MetadataRoute } from "next";
import { EVENT } from "@/lib/event-config";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ["", "/register", "/cebu"];

  return routes.map((route) => ({
    url: `${EVENT.siteUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: route === "" ? 1 : 0.8,
  }));
}
