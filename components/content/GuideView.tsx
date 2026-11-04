import { ArrowLeft, ArrowRight, BookOpen, Calculator, ChevronDown, Newspaper } from "lucide-react";
import Link from "next/link";
import { articleMeta } from "@/data/article-meta";
import { posts } from "@/data/blog";
import { guides, type Block, type Guide } from "@/data/guides";
import { readingMinutes } from "@/lib/reading-time";
import { articleLd } from "@/lib/seo";
import { siteConfig } from "@/lib/site-config";
import { ArticleCard, ArticleMetaRow, AuthorBox, CalloutBox, VerifiedBadge } from "./ArticleParts";
import { ArticleCover } from "./ArticleCover";
import { ArticleToc } from "./ArticleToc";
import { Breadcrumbs } from "./Breadcrumbs";
import { CalculatorCards } from "./CalculatorCards";
import { FaqSection } from "./FaqSection";
import { JsonLd } from "./JsonLd";
import { Tex } from "./Tex";
import { WorkedExample } from "./WorkedExample";

const GUIDES = { name: "Guides", path: "/guides" };

function BlockView({ block }: { block: Block }) {
  switch (block.type) {
    case "p":
      return (
        <p>
          {block.text}
          {block.link && (
            <>
              {" "}
              <Link href={block.link.href}>{block.link.label}</Link>.
            </>
          )}
        </p>
      );
    case "math":
      return (
        <div className="rounded-xl border border-accent/15 bg-accent-soft/50 px-4 text-ink">
          <Tex display>{block.latex}</Tex>
        </div>
      );
    case "list":
      return (
        <ul className="marker:text-accent">
          {block.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      );
    case "table":
      return (
        <div className="overflow-x-auto rounded-2xl border border-line bg-surface shadow-card">
          <table className="w-full min-w-[20rem] text-sm">
            <caption className="sr-only">{block.caption}</caption>
            <thead>
              <tr className="border-b border-line bg-accent-soft/60 text-left">
                {block.headers.map((h) => (
                  <th key={h} scope="col" className="px-4 py-3 font-display font-bold text-ink">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((row, r) => (
                <tr key={r} className="border-b border-line transition-colors last:border-0 hover:bg-paper">
                  {row.map((cell, c) => (
                    <td key={c} className="px-4 py-2.5">
                      <Tex>{cell}</Tex>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
  }
}

/** Long-form article layout, shared by the guides and the blog. */
export function GuideView({ guide, collection = GUIDES }: { guide: Guide; collection?: { name: string; path: string } }) {
  const path = `${collection.path}/${guide.slug}`;
  const date: string = guide.published ?? siteConfig.contentUpdated;
  const kind = collection.path === "/blog" ? "post" : "guide";
  const meta = articleMeta[guide.slug];
  const minutes = readingMinutes(guide);
  const list = kind === "guide" ? guides : posts;
  const index = list.findIndex((g) => g.slug === guide.slug);
  const prev = index > 0 ? list[index - 1] : undefined;
  const next = index >= 0 && index < list.length - 1 ? list[index + 1] : undefined;
  const related = [
    ...guides.filter((g) => g.slug !== guide.slug).map((g) => ({ guide: g, href: `/guides/${g.slug}`, kind: "guide" as const })),
    ...posts.filter((p) => p.slug !== guide.slug).map((p) => ({ guide: p, href: `/blog/${p.slug}`, kind: "post" as const })),
  ]
    .slice(0, 3)
    .map((r) => ({ ...r, category: articleMeta[r.guide.slug]?.category ?? "Calculus", minutes: readingMinutes(r.guide) }));

  const toc = [
    ...guide.sections.map((s) => ({ id: s.id, title: s.heading })),
    { id: "examples", title: "Worked examples" },
    { id: "faq-title", title: "Questions about this topic" },
  ];

  return (
    <>
      <JsonLd data={articleLd(guide.title, path, guide.description, date)} />

      {/* Hero */}
      <div className="relative isolate overflow-hidden bg-navy-gradient pb-24 pt-8 text-white sm:pt-10">
        <div aria-hidden className="absolute -right-24 -top-24 -z-10 h-[26rem] w-[26rem] rounded-full bg-[#923eff]/30 blur-3xl" />
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-[1.2fr_1fr]">
          <div>
            <Breadcrumbs items={[collection, { name: guide.title.split(/[:(]/)[0].trim(), path }]} tone="dark" />
            <p className="mt-6 flex flex-wrap items-center gap-2 text-xs font-bold uppercase tracking-[0.12em]">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-gradient px-3 py-1.5 text-white">
                {kind === "guide" ? <BookOpen aria-hidden className="h-3.5 w-3.5" /> : <Newspaper aria-hidden className="h-3.5 w-3.5" />}
                {kind === "guide" ? "Study guide" : "Tutorial"}
              </span>
              {meta && <span className="rounded-full bg-white/10 px-3 py-1.5 text-white/85 ring-1 ring-white/15">{meta.category}</span>}
            </p>
            <h1 className="mt-5 font-display text-[clamp(2rem,4.2vw,3rem)] font-extrabold leading-[1.12] tracking-tight">{guide.title}</h1>
            <p className="mt-4 max-w-2xl text-lg leading-relaxed text-white/80">{guide.intro}</p>
            <div className="mt-6">
              <ArticleMetaRow date={date} label={guide.published ? "Published" : "Last reviewed"} minutes={minutes} tone="dark" />
            </div>
            <div className="mt-4">
              <VerifiedBadge />
            </div>
          </div>
          <div className="animate-fade-up overflow-hidden rounded-3xl shadow-2xl ring-1 ring-white/15">
            <ArticleCover slug={guide.slug} label={guide.image?.alt ?? guide.title} instance="hero" />
          </div>
        </div>
      </div>

      {/* Article + table of contents */}
      <div className="relative z-10 mx-auto -mt-12 grid max-w-7xl items-start gap-10 px-4 sm:px-6 lg:grid-cols-[minmax(0,1fr)_17rem]">
        <div className="min-w-0">
          <details className="group mb-4 rounded-2xl border border-line bg-surface shadow-card lg:hidden">
            <summary className="flex cursor-pointer list-none items-center justify-between px-5 py-4 font-display font-bold text-ink [&::-webkit-details-marker]:hidden">
              On this page
              <ChevronDown aria-hidden className="h-4 w-4 transition-transform group-open:rotate-180" />
            </summary>
            <ol className="space-y-1 border-t border-line px-5 py-3 text-sm">
              {toc.map((item, i) => (
                <li key={item.id}>
                  <a href={`#${item.id}`} className="flex gap-2 py-1 text-ink-soft hover:text-accent-strong">
                    <span aria-hidden className="w-5 shrink-0 tabular-nums text-muted">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    {item.title}
                  </a>
                </li>
              ))}
            </ol>
          </details>

          <article className="prose-body max-w-none rounded-3xl border border-line bg-surface p-6 shadow-[0_24px_60px_-24px_rgb(21_25_54/0.25)] sm:p-10 lg:p-12">
            {guide.sections.map((section, si) => (
              <section key={section.id} aria-labelledby={section.id} className="scroll-mt-24">
                <h2 id={section.id} className={`flex items-start gap-3 ${si === 0 ? "mt-0" : ""}`}>
                  <span aria-hidden className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-accent-soft font-display text-sm font-bold text-accent-strong">
                    {String(si + 1).padStart(2, "0")}
                  </span>
                  <span>{section.heading}</span>
                </h2>
                {section.blocks.map((block, i) => (
                  <BlockView key={i} block={block} />
                ))}
                {meta?.callouts
                  .filter((c) => c.after === section.id)
                  .map((c) => (
                    <CalloutBox key={c.text} callout={c} />
                  ))}
              </section>
            ))}
          </article>
        </div>
        <aside aria-label="Article navigation" className="hidden lg:sticky lg:top-24 lg:block lg:space-y-4">
          <ArticleToc items={toc} />
          <Link
            href={guide.calculator.href}
            className="group flex items-start gap-3 rounded-2xl bg-navy-gradient p-5 text-white shadow-card transition-transform hover:-translate-y-0.5"
          >
            <Calculator aria-hidden className="mt-0.5 h-5 w-5 shrink-0 text-[#c9a8ff]" />
            <span className="text-sm font-semibold leading-snug">{guide.calculator.label}</span>
            <ArrowRight aria-hidden className="ml-auto mt-0.5 h-4 w-4 shrink-0 transition-transform group-hover:translate-x-1" />
          </Link>
        </aside>
      </div>

      <div className="mx-auto max-w-7xl space-y-20 px-4 pt-20 sm:px-6">
        <section aria-labelledby="examples" className="scroll-mt-24">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-accent-strong">Practice</p>
          <h2 id="examples" className="mt-1 font-display text-2xl font-extrabold tracking-tight text-ink sm:text-[2rem]">
            Worked examples
          </h2>
          <p className="mt-3 max-w-[72ch] text-ink-soft">Each example is checked automatically against the solver. Try it by hand first, then compare.</p>
          <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
            {guide.examples.map((e, i) => (
              <WorkedExample key={e.title} example={e} index={i} />
            ))}
          </div>
        </section>

        {meta && (
          <section aria-labelledby="related-calculators">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-accent-strong">Put it into practice</p>
            <h2 id="related-calculators" className="mt-1 font-display text-2xl font-extrabold tracking-tight text-ink sm:text-[2rem]">
              Related calculators
            </h2>
            <CalculatorCards slugs={meta.related} className="mt-6" />
          </section>
        )}

        <AuthorBox />

        <div className="-mt-4">
          <FaqSection faqs={guide.faqs} title="Questions about this topic" />
        </div>

        {(prev || next) && (
          <nav aria-label={kind === "guide" ? "More guides" : "More articles"} className="grid gap-4 sm:grid-cols-2">
            {prev ? (
              <Link href={`${collection.path}/${prev.slug}`} rel="prev" className="group rounded-2xl border border-line bg-surface p-5 shadow-card transition-colors hover:border-accent/40">
                <span className="flex items-center gap-1.5 text-sm text-muted">
                  <ArrowLeft aria-hidden className="h-4 w-4 transition-transform group-hover:-translate-x-1" /> Previous {kind === "guide" ? "guide" : "article"}
                </span>
                <span className="mt-1 block font-display font-bold text-ink">{prev.title}</span>
              </Link>
            ) : (
              <span className="hidden sm:block" />
            )}
            {next && (
              <Link href={`${collection.path}/${next.slug}`} rel="next" className="group rounded-2xl border border-line bg-surface p-5 text-right shadow-card transition-colors hover:border-accent/40">
                <span className="flex items-center justify-end gap-1.5 text-sm text-muted">
                  Next {kind === "guide" ? "guide" : "article"} <ArrowRight aria-hidden className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
                <span className="mt-1 block font-display font-bold text-ink">{next.title}</span>
              </Link>
            )}
          </nav>
        )}

        {related.length > 0 && (
          <section aria-labelledby="related-articles">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-accent-strong">Keep reading</p>
            <h2 id="related-articles" className="mt-1 font-display text-2xl font-extrabold tracking-tight text-ink sm:text-[2rem]">
              Related articles
            </h2>
            <ul className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {related.map((r) => (
                <li key={r.href}>
                  <ArticleCard data={r} />
                </li>
              ))}
            </ul>
          </section>
        )}

        <section aria-labelledby="practice" className="relative isolate overflow-hidden rounded-3xl bg-navy-gradient px-6 py-10 text-white sm:px-12">
          <div aria-hidden className="absolute -right-16 -top-16 -z-10 h-64 w-64 rounded-full bg-[#923eff]/35 blur-3xl" />
          <h2 id="practice" className="font-display text-2xl font-extrabold tracking-tight sm:text-3xl">
            Practice what you learned
          </h2>
          <p className="mt-2 max-w-2xl text-white/80">
            Try the worked examples above in the calculator and compare each step with your own. You can also use the main{" "}
            <Link href="/" className="font-semibold text-white underline underline-offset-2">
              Calculus Solver
            </Link>{" "}
            for every operation in one place.
          </p>
          <Link
            href={guide.calculator.href}
            className="group mt-6 inline-flex items-center gap-2 rounded-xl bg-brand-gradient px-6 py-3.5 font-semibold text-white shadow-glow transition-all hover:-translate-y-0.5 hover:bg-brand-gradient-hover"
          >
            {guide.calculator.label}
            <ArrowRight aria-hidden className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </section>
      </div>
    </>
  );
}
