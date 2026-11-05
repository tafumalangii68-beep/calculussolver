import type { MetadataRoute } from "next";
import { posts } from "@/data/blog";
import { calculators } from "@/data/calculators";
import { guides } from "@/data/guides";
import { indexableRoutes } from "@/lib/routes";
import { getReviewSummary } from "@/lib/reviews/store";
import { absoluteUrl } from "@/lib/site-config";

// The Reviews page joins the sitemap once it has approved reviews; rechecked with the review data.
export const revalidate = 60;

/** Illustrations shown on each page, listed as image-sitemap entries so search engines can find them. */
const PAGE_IMAGES: Record<string, string[]> = Object.fromEntries([
  ...Object.values(calculators).filter((c) => c.image).map((c) => [`/${c.slug}`, [absoluteUrl(c.image!.src)]]),
  ...guides.filter((g) => g.image).map((g) => [`/guides/${g.slug}`, [absoluteUrl(g.image!.src)]]),
  ...posts.filter((p) => p.image).map((p) => [`/blog/${p.slug}`, [absoluteUrl(p.image!.src)]]),
]);

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { count } = await getReviewSummary();
  const routes = count > 0 ? [...indexableRoutes, { path: "/reviews", priority: 0.5, lastModified: new Date().toISOString().slice(0, 10) }] : indexableRoutes;
  return routes.map((r) => ({
    url: absoluteUrl(r.path),
    lastModified: r.lastModified,
    priority: r.priority,
    ...(PAGE_IMAGES[r.path] ? { images: PAGE_IMAGES[r.path] } : {}),
  }));
}
