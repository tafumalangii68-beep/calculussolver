import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

export const PAGE_SIZE = 9;

export function pageCount(total: number): number {
  return Math.max(1, Math.ceil(total / PAGE_SIZE));
}

/** URL of a listing page: page 1 is the base path, later pages are base/page/N. */
export function pageHref(base: string, page: number): string {
  return page <= 1 ? base : `${base}/page/${page}`;
}

/** Responsive pagination. Renders nothing when everything fits on one page. */
export function Pagination({ base, page, total }: { base: string; page: number; total: number }) {
  const pages = pageCount(total);
  if (pages <= 1) return null;
  const link = "inline-flex h-10 min-w-10 items-center justify-center gap-1 rounded-xl border px-3 text-sm font-semibold transition-colors";
  return (
    <nav aria-label="Pagination" className="mt-12 flex items-center justify-center gap-2">
      {page > 1 ? (
        <Link href={pageHref(base, page - 1)} rel="prev" className={`${link} border-line bg-surface text-ink hover:border-accent/50 hover:bg-accent-soft`}>
          <ChevronLeft aria-hidden className="h-4 w-4" /> <span className="hidden sm:inline">Previous</span>
          <span className="sr-only sm:hidden">Previous page</span>
        </Link>
      ) : null}
      <ol className="flex items-center gap-1.5">
        {Array.from({ length: pages }, (_, i) => i + 1).map((n) => (
          <li key={n} className={Math.abs(n - page) > 1 && n !== 1 && n !== pages ? "hidden sm:block" : undefined}>
            <Link
              href={pageHref(base, n)}
              aria-current={n === page ? "page" : undefined}
              className={`${link} ${n === page ? "border-transparent bg-brand-gradient text-white shadow-glow" : "border-line bg-surface text-ink-soft hover:border-accent/50 hover:bg-accent-soft"}`}
            >
              <span className="sr-only">Page </span>
              {n}
            </Link>
          </li>
        ))}
      </ol>
      {page < pages ? (
        <Link href={pageHref(base, page + 1)} rel="next" className={`${link} border-line bg-surface text-ink hover:border-accent/50 hover:bg-accent-soft`}>
          <span className="hidden sm:inline">Next</span>
          <span className="sr-only sm:hidden">Next page</span> <ChevronRight aria-hidden className="h-4 w-4" />
        </Link>
      ) : null}
    </nav>
  );
}
