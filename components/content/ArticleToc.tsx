"use client";

import { useEffect, useState } from "react";

/** Sticky table of contents that highlights the section currently being read. */
export function ArticleToc({ items }: { items: { id: string; title: string }[] }) {
  const [active, setActive] = useState(items[0]?.id);

  useEffect(() => {
    const targets = items.map((i) => document.getElementById(i.id)).filter((el): el is HTMLElement => el !== null);
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-90px 0px -65% 0px" },
    );
    targets.forEach((t) => observer.observe(t));
    return () => observer.disconnect();
  }, [items]);

  return (
    <nav aria-label="Table of contents" className="rounded-2xl border border-line bg-surface p-5 shadow-card">
      <p className="text-xs font-bold uppercase tracking-[0.14em] text-muted">On this page</p>
      <ol className="mt-3 space-y-0.5 border-l border-line">
        {items.map((item, i) => {
          const current = item.id === active;
          return (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                aria-current={current ? "location" : undefined}
                className={`-ml-px flex gap-2 border-l-2 py-1.5 pl-3 text-sm transition-colors ${
                  current ? "border-accent font-semibold text-accent-strong" : "border-transparent text-ink-soft hover:border-line-strong hover:text-ink"
                }`}
              >
                <span aria-hidden className="w-5 shrink-0 tabular-nums text-muted">
                  {String(i + 1).padStart(2, "0")}
                </span>
                {item.title}
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
