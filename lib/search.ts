// Site search index, built on the server (in the Header) and passed to the client search
// dialog as plain data, so page bodies never ship to the browser.

import { posts } from "@/data/blog";
import { calculators } from "@/data/calculators";
import { guides } from "@/data/guides";
import { calculatorNav, legalNav, mainNav } from "@/lib/site-config";

export interface SearchItem {
  href: string;
  title: string;
  description: string;
  group: "Calculators" | "Guides" | "Blog" | "Pages";
}

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

/** Every query word must appear in the title or description; title matches rank first. */
export function searchItems(items: SearchItem[], query: string, limit = 8): SearchItem[] {
  const words = query.toLowerCase().split(/\s+/).filter(Boolean);
  if (words.length === 0) return items.filter((i) => i.group === "Calculators").slice(0, limit);
  return items
    .map((item) => {
      const title = item.title.toLowerCase();
      const text = `${title} ${item.description.toLowerCase()}`;
      if (!words.every((w) => text.includes(w))) return null;
      const score = words.filter((w) => title.includes(w)).length * 2 + (title.startsWith(words[0]!) ? 1 : 0);
      return { item, score };
    })
    .filter((x): x is { item: SearchItem; score: number } => x !== null)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((x) => x.item);
}
