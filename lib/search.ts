// Site search index, built on the server (in the Header) and passed to the client search
// dialog as plain data, so page bodies never ship to the browser.

import { posts } from "@/data/blog";
import { calculators } from "@/data/calculators";
import { guides } from "@/data/guides";
import { calculatorNav, legalNav, mainNav } from "@/lib/site-config";
import type { SearchItem } from "./search-match";

export type { SearchItem };

const PAGE_DESCRIPTIONS: Record<string, string> = {
  "/guides": "Study guides for derivatives and integration",
  "/blog": "Step-by-step calculus tutorials",
  "/how-it-works": "How the solver computes and verifies answers",
  "/faq": "Frequently asked questions",
  "/about": "About Calculus Solver",
  "/contact": "Get in touch",
};

export function buildSearchIndex(): SearchItem[] {
  const items: SearchItem[] = [
    { href: "/", title: "Calculus Solver", description: "All operations in one calculator: derivatives, integrals, limits and more", group: "Calculators" },
    ...calculatorNav.map((c) => ({
      href: `/${c.slug}`,
      title: c.label,
      description: `${c.blurb}. ${calculators[c.slug].metaDescription}`,
      group: "Calculators" as const,
    })),
    ...guides.map((g) => ({ href: `/guides/${g.slug}`, title: g.title, description: g.description, group: "Guides" as const })),
    ...posts.map((p) => ({ href: `/blog/${p.slug}`, title: p.title, description: p.description, group: "Blog" as const })),
  ];
  const seen = new Set(items.map((i) => i.href));
  for (const l of [...mainNav, ...legalNav]) {
    if (seen.has(l.href)) continue;
    seen.add(l.href);
    items.push({ href: l.href, title: l.label, description: PAGE_DESCRIPTIONS[l.href] ?? "", group: "Pages" });
  }
  return items;
}
