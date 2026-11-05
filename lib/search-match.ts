// Client-safe half of the site search: the item type and the matcher. Kept apart from
// lib/search.ts so the search dialog does not pull the page content into the browser bundle.

export interface SearchItem {
  href: string;
  title: string;
  description: string;
  group: "Calculators" | "Guides" | "Blog" | "Pages";
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
