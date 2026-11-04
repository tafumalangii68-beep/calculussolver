import { Building2, Calendar, Cookie, FileText, Mail, ScrollText, Settings2, ShieldCheck, TriangleAlert } from "lucide-react";
import { Children, isValidElement } from "react";
import { webPageLd } from "@/lib/seo";
import { JsonLd } from "./JsonLd";
import { PageHero } from "./PageHero";
import { ProseToc } from "./ProseToc";

/** Eyebrow label and icon for each text page. */
const PAGE_KIND: Record<string, { eyebrow: string; icon: React.ReactNode }> = {
  "/about": { eyebrow: "About", icon: <Building2 /> },
  "/contact": { eyebrow: "Get in touch", icon: <Mail /> },
  "/how-it-works": { eyebrow: "Methodology", icon: <Settings2 /> },
  "/privacy-policy": { eyebrow: "Legal · Privacy", icon: <ShieldCheck /> },
  "/terms-and-conditions": { eyebrow: "Legal · Terms", icon: <ScrollText /> },
  "/cookie-policy": { eyebrow: "Legal · Cookies", icon: <Cookie /> },
  "/disclaimer": { eyebrow: "Legal · Disclaimer", icon: <TriangleAlert /> },
};

/** Layout for text pages such as the legal pages, About and How It Works. */
export function ProsePage({
  title,
  path,
  description,
  updated,
  lead,
  before,
  after,
  children,
}: {
  title: string;
  path: string;
  description: string;
  updated?: string;
  lead?: React.ReactNode;
  /** Full-width section between the hero and the text card (it takes the overlap with the hero). */
  before?: React.ReactNode;
  /** Full-width sections below the text card. */
  after?: React.ReactNode;
  children: React.ReactNode;
}) {
  const kind = PAGE_KIND[path] ?? { eyebrow: "Calculus Solver", icon: <FileText /> };
  // Pages with three or more sections get a sidebar table of contents; shorter ones use a centred column.
  const headings = Children.toArray(children).filter((c) => isValidElement(c) && c.type === "h2").length;
  const withToc = headings >= 3;
  return (
    <>
      <JsonLd data={webPageLd(title, path, description)} />
      <PageHero
        crumbs={[{ name: title, path }]}
        eyebrow={kind.eyebrow}
        icon={kind.icon}
        title={title}
        meta={
          updated && (
            <span className="inline-flex items-center gap-1.5">
              <Calendar aria-hidden className="h-4 w-4" />
              Last updated: <time dateTime={updated}>{formatDate(updated)}</time>
            </span>
          )
        }
      >
        {lead}
      </PageHero>
      {before && <div className="relative z-10 mx-auto -mt-12 max-w-7xl px-4 sm:px-6">{before}</div>}
      <div
        className={`relative z-10 mx-auto ${before ? "mt-14" : "-mt-12"} grid items-start gap-10 px-4 sm:px-6 ${withToc ? "max-w-7xl lg:grid-cols-[minmax(0,1fr)_17rem]" : "max-w-4xl"}`}
      >
        <div
          id="page-content"
          className="prose-body min-w-0 max-w-none rounded-3xl border border-line bg-surface p-6 shadow-[0_24px_60px_-24px_rgb(21_25_54/0.25)] sm:p-10 lg:p-12 [&>h2:first-child]:mt-0 [&>figure:first-child]:mt-0"
        >
          {children}
        </div>
        {withToc && (
          <aside aria-label="Page navigation" className="hidden lg:sticky lg:top-24 lg:block">
            <ProseToc targetId="page-content" />
          </aside>
        )}
      </div>
      {after && <div className="mx-auto max-w-7xl space-y-20 px-4 pt-20 sm:px-6">{after}</div>}
    </>
  );
}

export function formatDate(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  return `${months[m - 1]} ${d}, ${y}`;
}
