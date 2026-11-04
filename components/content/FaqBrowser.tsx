"use client";

import { Search, X } from "lucide-react";
import Link from "next/link";
import { useId, useState } from "react";
import type { Faq } from "@/types/content";
import { FaqItems } from "./FaqItems";

export interface FaqGroup {
  title: string;
  faqs: Faq[];
}

export const faqGroupId = (title: string) => `faq-${title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/-$/, "")}`;

/**
 * Searchable, filterable FAQ. Every question is in the server-rendered HTML; filtering only hides
 * items, so the page works without JavaScript and matches its FAQPage structured data.
 */
export function FaqBrowser({ groups }: { groups: FaqGroup[] }) {
  const [query, setQuery] = useState("");
  const [topic, setTopic] = useState<string | null>(null);
  const inputId = useId();

  const words = query.toLowerCase().split(/\s+/).filter(Boolean);
  const searching = words.length > 0;

  const visible = groups
    .filter((g) => topic === null || g.title === topic)
    .map((g) => ({
      ...g,
      faqs: g.faqs.filter((f) => {
        const text = `${f.q} ${f.a}`.toLowerCase();
        return words.every((w) => text.includes(w));
      }),
    }))
    .filter((g) => g.faqs.length > 0);
  const total = visible.reduce((n, g) => n + g.faqs.length, 0);
  const chip = (active: boolean) =>
    `inline-flex items-center rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
      active ? "bg-brand-gradient text-white shadow-glow" : "bg-accent-soft text-accent-strong hover:bg-accent/15"
    }`;

  return (
    <>
      <div className="rounded-2xl border border-line bg-surface p-4 shadow-[0_24px_60px_-24px_rgb(21_25_54/0.25)] sm:p-5">
        <label htmlFor={inputId} className="sr-only">
          Search the FAQ
        </label>
        <div className="relative">
          <Search aria-hidden className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted" />
          <input
            id={inputId}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search questions"
            className="w-full rounded-xl border border-line-strong bg-paper py-3 pl-12 pr-11 text-ink placeholder:text-muted focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 [&::-webkit-search-cancel-button]:hidden"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              aria-label="Clear search"
              className="absolute right-2 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-lg text-muted hover:bg-accent-soft hover:text-accent-strong"
            >
              <X aria-hidden className="h-4 w-4" />
            </button>
          )}
        </div>
        <div role="group" aria-label="Filter by topic" className="mt-4 flex flex-wrap gap-2">
          <button type="button" aria-pressed={topic === null} onClick={() => setTopic(null)} className={chip(topic === null)}>
            All topics
          </button>
          {groups.map((g) => (
            <button key={g.title} type="button" aria-pressed={topic === g.title} onClick={() => setTopic(topic === g.title ? null : g.title)} className={chip(topic === g.title)}>
              {g.title}
              <span className="ml-2 rounded-full bg-surface/70 px-1.5 text-xs text-accent-strong">{g.faqs.length}</span>
            </button>
          ))}
        </div>
        <p aria-live="polite" className="mt-3 text-sm text-muted">
          {searching || topic ? `${total} ${total === 1 ? "question" : "questions"} found` : ""}
        </p>
      </div>

      {visible.map((group) => (
        <section key={group.title} aria-labelledby={faqGroupId(group.title)} className="mt-12">
          <h2 id={faqGroupId(group.title)} className="scroll-mt-24 font-display text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
            {group.title}
          </h2>
          {/* Remount when the search changes so matching answers open, then the visitor can toggle freely. */}
          <div className="mt-5" key={searching ? "search" : "browse"}>
            <FaqItems faqs={group.faqs} open={searching} />
          </div>
        </section>
      ))}

      {total === 0 && (
        <div className="mt-12 rounded-3xl border border-dashed border-line-strong bg-surface p-8 text-center">
          <p className="font-display text-lg font-bold text-ink">No questions match “{query}”.</p>
          <p className="mt-2 text-muted">
            Try a shorter word, or{" "}
            <Link href="/contact" className="font-semibold text-accent-strong underline underline-offset-2">
              ask us directly
            </Link>
            .
          </p>
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setTopic(null);
            }}
            className="mt-5 rounded-xl bg-brand-gradient px-5 py-2.5 font-semibold text-white shadow-glow hover:bg-brand-gradient-hover"
          >
            Show all questions
          </button>
        </div>
      )}
    </>
  );
}
