"use client";

import { ArrowRight, Search, X } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { searchItems, type SearchItem } from "@/lib/search-match";
import { headerIconButton } from "./header-styles";

/**
 * Site search in a native <dialog> (focus trap, Escape and backdrop handled by the browser).
 * Opens with the header button, Ctrl/⌘+K, or "/" when not typing in a field.
 */
export function SearchDialog({ items }: { items: SearchItem[] }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const router = useRouter();
  const pathname = usePathname();
  const uid = useId();
  const results = searchItems(items, query);

  const open = () => {
    const d = dialogRef.current;
    if (d && !d.open) d.showModal();
    inputRef.current?.select();
  };
  const close = () => dialogRef.current?.close();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const typing = e.target instanceof HTMLElement && (e.target.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName));
      if ((e.key === "k" && (e.ctrlKey || e.metaKey)) || (e.key === "/" && !typing)) {
        e.preventDefault();
        const d = dialogRef.current;
        if (d && !d.open) d.showModal();
        inputRef.current?.select();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  // Close after navigating.
  useEffect(() => {
    dialogRef.current?.close();
  }, [pathname]);

  const onInputKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && results[0]) {
      e.preventDefault();
      router.push(results[0].href);
      close();
    } else if (e.key === "Escape") {
      // A search field would otherwise use the first Escape just to clear itself.
      e.preventDefault();
      close();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      dialogRef.current?.querySelector<HTMLAnchorElement>("[data-result]")?.focus();
    }
  };
  const onListKey = (e: React.KeyboardEvent<HTMLUListElement>) => {
    if (e.key !== "ArrowDown" && e.key !== "ArrowUp") return;
    e.preventDefault();
    const links = [...(dialogRef.current?.querySelectorAll<HTMLAnchorElement>("[data-result]") ?? [])];
    const i = links.indexOf(document.activeElement as HTMLAnchorElement);
    if (e.key === "ArrowUp" && i <= 0) inputRef.current?.focus();
    else links[Math.min(links.length - 1, i + (e.key === "ArrowDown" ? 1 : -1))]?.focus();
  };

  return (
    <>
      <button
        type="button"
        onClick={open}
        aria-label="Search the site"
        title="Search (Ctrl+K)"
        className={headerIconButton}
      >
        <Search aria-hidden className="h-5 w-5" />
      </button>

      <dialog
        ref={dialogRef}
        aria-labelledby={`${uid}-title`}
        onClick={(e) => e.target === dialogRef.current && close()}
        className="search-dialog m-0 mx-auto mt-[10vh] w-[calc(100%-2rem)] max-w-xl overflow-hidden rounded-2xl border border-line bg-surface p-0 text-ink shadow-2xl backdrop:bg-navy-950/60 backdrop:backdrop-blur-sm"
      >
        <h2 id={`${uid}-title`} className="sr-only">
          Search Calculus Solver
        </h2>
        <div className="flex items-center gap-3 border-b border-line px-4">
          <Search aria-hidden className="h-5 w-5 shrink-0 text-muted" />
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={onInputKey}
            placeholder="Search calculators, guides and articles"
            aria-label="Search"
            aria-controls={`${uid}-results`}
            autoComplete="off"
            className="h-14 min-w-0 flex-1 bg-transparent [&::-webkit-search-cancel-button]:appearance-none text-base text-ink placeholder:text-muted focus:outline-none"
          />
          <button type="button" onClick={close} aria-label="Close search" className="grid h-8 w-8 place-items-center rounded-lg text-muted hover:bg-sunken hover:text-ink">
            <X aria-hidden className="h-4 w-4" />
          </button>
        </div>
        <div className="max-h-[60vh] overflow-y-auto p-2">
          <p className="px-3 pb-1 pt-2 text-xs font-semibold uppercase tracking-wider text-muted" aria-live="polite">
            {query.trim() ? (results.length ? `${results.length} result${results.length > 1 ? "s" : ""}` : "No results") : "Calculators"}
          </p>
          {results.length > 0 ? (
            <ul id={`${uid}-results`} onKeyDown={onListKey}>
              {results.map((r) => (
                <li key={r.href}>
                  <Link
                    data-result
                    href={r.href}
                    onClick={close}
                    className="group flex items-center gap-3 rounded-xl px-3 py-2.5 hover:bg-accent-soft focus:bg-accent-soft focus:outline-none"
                  >
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-semibold text-ink">{r.title}</span>
                      <span className="block truncate text-sm text-muted">
                        {r.group} · {r.description}
                      </span>
                    </span>
                    <ArrowRight aria-hidden className="h-4 w-4 shrink-0 text-accent-strong opacity-0 transition-opacity group-hover:opacity-100 group-focus:opacity-100" />
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="px-3 py-6 text-center text-sm text-muted">Try &ldquo;derivative&rdquo;, &ldquo;integral&rdquo; or &ldquo;limit&rdquo;.</p>
          )}
        </div>
      </dialog>
    </>
  );
}
