import type { MetadataRoute } from "next";
import { indexableRoutes } from "@/lib/routes";
import { getReviewSummary } from "@/lib/reviews/store";
import { absoluteUrl } from "@/lib/site-config";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { count } = await getReviewSummary();
  const routes = count > 0 ? [...indexableRoutes, { path: "/reviews", priority: 0.5, lastModified: new Date().toISOString().slice(0, 10) }] : indexableRoutes;
  return routes.map((r) => ({
    url: absoluteUrl(r.path),
    lastModified: r.lastModified,
    priority: r.priority,
  }));
}
