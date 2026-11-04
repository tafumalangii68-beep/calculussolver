"use client";

import { useEffect, useState } from "react";
import { ArticleToc } from "./ArticleToc";

const slug = (text: string) =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 60);

/**
 * Builds a table of contents from the h2 headings inside `#${targetId}` after the page loads,
 * giving headings an id when they have none. ProsePage only includes it for pages with three or more sections.
 */
export function ProseToc({ targetId }: { targetId: string }) {
  const [items, setItems] = useState<{ id: string; title: string }[]>([]);

  useEffect(() => {
    const root = document.getElementById(targetId);
    if (!root) return;
    const used = new Set<string>();
    const found = [...root.querySelectorAll("h2")].map((h) => {
      let id = h.id || slug(h.textContent ?? "") || "section";
      while (used.has(id) || (!h.id && document.getElementById(id))) id = `${id}-x`;
      used.add(id);
      if (!h.id) h.id = id;
      h.classList.add("scroll-mt-24");
      return { id, title: h.textContent?.trim() ?? id };
    });
    // eslint-disable-next-line react-hooks/set-state-in-effect -- headings are read from the rendered page once
    setItems(found);
  }, [targetId]);

  if (items.length === 0) return null;
  return <ArticleToc items={items} />;
}
