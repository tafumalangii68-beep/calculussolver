import type { MetadataRoute } from "next";
import { indexableRoutes } from "@/lib/routes";
import { absoluteUrl } from "@/lib/site-config";

export default function sitemap(): MetadataRoute.Sitemap {
  return indexableRoutes.map((r) => ({
    url: absoluteUrl(r.path),
    lastModified: r.lastModified,
    priority: r.priority,
  }));
}
