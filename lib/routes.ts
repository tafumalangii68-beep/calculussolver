import { guides } from "@/data/guides";
import { calculatorNav, siteConfig } from "./site-config";

/** Every canonical, indexable page. Used by the sitemap and by tests that check internal links. */
export const indexableRoutes: { path: string; priority: number; lastModified: string }[] = [
  { path: "/", priority: 1, lastModified: siteConfig.contentUpdated },
  ...calculatorNav.map((c) => ({ path: `/${c.slug}`, priority: 0.9, lastModified: siteConfig.contentUpdated })),
  { path: "/guides", priority: 0.6, lastModified: siteConfig.contentUpdated },
  ...guides.map((g) => ({ path: `/guides/${g.slug}`, priority: 0.7, lastModified: siteConfig.contentUpdated })),
  { path: "/how-it-works", priority: 0.6, lastModified: siteConfig.contentUpdated },
  { path: "/faq", priority: 0.5, lastModified: siteConfig.contentUpdated },
  { path: "/about", priority: 0.4, lastModified: siteConfig.contentUpdated },
  { path: "/contact", priority: 0.3, lastModified: siteConfig.contentUpdated },
  { path: "/privacy-policy", priority: 0.2, lastModified: siteConfig.legalUpdated },
  { path: "/terms-and-conditions", priority: 0.2, lastModified: siteConfig.legalUpdated },
  { path: "/cookie-policy", priority: 0.2, lastModified: siteConfig.legalUpdated },
  { path: "/disclaimer", priority: 0.2, lastModified: siteConfig.legalUpdated },
];
