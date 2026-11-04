import { ArrowRight, BookOpen, Calendar, CheckCircle2, Clock, Info, Lightbulb, Newspaper } from "lucide-react";
import Link from "next/link";
import type { Guide } from "@/data/guides";
import { siteConfig } from "@/lib/site-config";
import type { Callout } from "@/data/article-meta";
import { ArticleCover } from "./ArticleCover";
import { formatDate } from "./ProsePage";

/** Highlighted tip or note inside an article. */
export function CalloutBox({ callout }: { callout: Callout }) {
  const tip = callout.kind === "tip";
  return (
    <div role="note"
      className={`my-6 flex gap-3 rounded-2xl border p-4 sm:p-5 ${tip ? "border-accent/30 bg-accent-soft" : "border-teal/30 bg-[color-mix(in_oklab,var(--color-teal)_10%,var(--color-surface))]"}`}
    >
      <span aria-hidden className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl ${tip ? "bg-brand-gradient text-white" : "bg-surface text-ink"}`}>
        {tip ? <Lightbulb className="h-4 w-4" /> : <Info className="h-4 w-4" />}
      </span>
      <p className="text-[15px] leading-relaxed text-ink-soft">
        <strong className="text-ink">{tip ? "Tip: " : "Note: "}</strong>
        {callout.text}
      </p>
    </div>
  );
}

/** Small brand avatar for the author (the site itself; no individual is claimed). */
function AuthorAvatar({ size = "h-10 w-10" }: { size?: string }) {
  return (
    <span aria-hidden className={`grid ${size} shrink-0 place-items-center rounded-full bg-brand-gradient font-display text-base font-bold italic text-white`}>
      ∫
    </span>
  );
}

/** Byline row: author, date and reading time. */
export function ArticleMetaRow({ date, label, minutes, tone = "light" }: { date: string; label: string; minutes: number; tone?: "light" | "dark" }) {
  const muted = tone === "dark" ? "text-white/70" : "text-muted";
  const strong = tone === "dark" ? "text-white" : "text-ink";
  return (
    <div className={`flex flex-wrap items-center gap-x-5 gap-y-2 text-sm ${muted}`}>
      <span className="flex items-center gap-2">
        <AuthorAvatar size="h-8 w-8" />
        <span>
          By <span className={`font-semibold ${strong}`}>{siteConfig.name} team</span>
        </span>
      </span>
      <span className="flex items-center gap-1.5">
        <Calendar aria-hidden className="h-4 w-4" />
        {label} <time dateTime={date}>{formatDate(date)}</time>
      </span>
      <span className="flex items-center gap-1.5">
        <Clock aria-hidden className="h-4 w-4" />
        {minutes} min read
      </span>
    </div>
  );
}

/** About-the-author box. States only what is true about how the content is produced. */
export function AuthorBox() {
  return (
    <section aria-labelledby="author" className="flex flex-col gap-4 rounded-3xl border border-line bg-surface p-6 shadow-card sm:flex-row sm:items-start sm:p-8">
      <AuthorAvatar size="h-14 w-14" />
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.14em] text-accent-strong">About the author</p>
        <h2 id="author" className="mt-1 font-display text-xl font-bold text-ink">
          {siteConfig.name} team
        </h2>
        <p className="mt-2 text-ink-soft">
          We build free, private calculus tools that show every step. Our articles are written to be read alongside the calculators, and
          every worked example in them is checked automatically against the solver before it is published.
        </p>
        <p className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-sm">
          <Link href="/about" className="font-semibold text-accent-strong underline-offset-4 hover:underline">
            About Calculus Solver
          </Link>
          <Link href="/how-it-works" className="font-semibold text-accent-strong underline-offset-4 hover:underline">
            How answers are verified
          </Link>
        </p>
      </div>
    </section>
  );
}

export interface ArticleCardData {
  guide: Guide;
  href: string;
  kind: "guide" | "post";
  category: string;
  minutes: number;
}

/** Article card with cover thumbnail, category, date and reading time. */
export function ArticleCard({ data, featured = false, headingLevel = "h3" }: { data: ArticleCardData; featured?: boolean; headingLevel?: "h2" | "h3" }) {
  const { guide, href, kind, category, minutes } = data;
  const date = guide.published ?? siteConfig.contentUpdated;
  const Heading = headingLevel;
  return (
    <article
      className={`group relative flex h-full overflow-hidden rounded-3xl border border-line bg-surface shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-accent/40 hover:shadow-[0_20px_44px_-18px_rgb(21_25_54/0.3)] ${
        featured ? "flex-col lg:flex-row" : "flex-col"
      }`}
    >
      <div className={`overflow-hidden ${featured ? "lg:w-1/2" : ""}`}>
        <ArticleCover slug={guide.slug} label={guide.image?.alt ?? guide.title} instance={`card-${kind}`} className={`transition-transform duration-500 group-hover:scale-[1.03] ${featured ? "lg:h-full" : ""}`} />
      </div>
      <div className={`flex flex-1 flex-col p-6 ${featured ? "lg:p-10" : ""}`}>
        <p className="flex flex-wrap items-center gap-2 text-xs font-bold uppercase tracking-[0.12em]">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-accent-soft px-3 py-1 text-accent-strong">
            {kind === "guide" ? <BookOpen aria-hidden className="h-3.5 w-3.5" /> : <Newspaper aria-hidden className="h-3.5 w-3.5" />}
            {kind === "guide" ? "Study guide" : "Tutorial"}
          </span>
          <span className="text-muted">{category}</span>
        </p>
        <Heading className={`mt-4 font-display font-extrabold leading-snug tracking-tight text-ink ${featured ? "text-2xl sm:text-3xl" : "text-xl"}`}>
          <Link href={href} className="after:absolute after:inset-0 after:content-['']">
            {guide.title}
          </Link>
        </Heading>
        <p className={`mt-3 flex-1 leading-relaxed text-muted ${featured ? "text-base sm:text-lg" : "text-sm"}`}>{guide.description}</p>
        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-4 text-sm text-muted">
          <span className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <Calendar aria-hidden className="h-4 w-4" />
              <time dateTime={date}>{formatDate(date)}</time>
            </span>
            <span className="flex items-center gap-1.5">
              <Clock aria-hidden className="h-4 w-4" />
              {minutes} min read
            </span>
          </span>
          <span aria-hidden className="inline-flex items-center gap-1 font-semibold text-accent-strong">
            Read <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </span>
        </div>
      </div>
    </article>
  );
}

/** "Every example verified" badge for article heroes. */
export function VerifiedBadge() {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-sm font-medium text-white/90 ring-1 ring-white/15">
      <CheckCircle2 aria-hidden className="h-4 w-4 text-[#c9a8ff]" /> Worked examples verified
    </span>
  );
}
