import { BookOpen, Calculator, Newspaper } from "lucide-react";
import { ArticleCard, type ArticleCardData } from "@/components/content/ArticleParts";
import { Breadcrumbs } from "@/components/content/Breadcrumbs";
import { CalculatorCards } from "@/components/content/CalculatorCards";
import { JsonLd } from "@/components/content/JsonLd";
import { articleMeta } from "@/data/article-meta";
import { posts } from "@/data/blog";
import { guides, type Guide } from "@/data/guides";
import { readingMinutes } from "@/lib/reading-time";
import { buildMetadata, webPageLd } from "@/lib/seo";

const description = "Calculus study guides: derivative rules and integration techniques explained with worked examples you can check in the solver.";

export const metadata = buildMetadata({ title: "Calculus Study Guides", description, path: "/guides" });

const card = (g: Guide, kind: "guide" | "post"): ArticleCardData => ({
  guide: g,
  href: kind === "guide" ? `/guides/${g.slug}` : `/blog/${g.slug}`,
  kind,
  category: articleMeta[g.slug]?.category ?? "Calculus",
  minutes: readingMinutes(g),
});

export default function GuidesPage() {
  return (
    <>
      <JsonLd data={webPageLd("Calculus Study Guides", "/guides", description)} />
      <div className="relative isolate overflow-hidden bg-navy-gradient pb-20 pt-8 text-white sm:pt-10">
        <div aria-hidden className="absolute -right-24 -top-24 -z-10 h-[26rem] w-[26rem] rounded-full bg-[#10b981]/25 blur-3xl" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <Breadcrumbs items={[{ name: "Guides", path: "/guides" }]} tone="dark" />
          <p className="mt-6 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm font-medium text-white/90 ring-1 ring-white/15">
            <BookOpen aria-hidden className="h-4 w-4 text-[#c9a8ff]" /> Learn the techniques
          </p>
          <h1 className="mt-5 font-display text-[clamp(2.2rem,5vw,3.4rem)] font-extrabold tracking-tight">
            Calculus <span className="text-brand-gradient">Study Guides</span>
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-white/80">
            Explanations of the core techniques, written to be read alongside the calculators. Each guide ends with worked examples you can
            check step by step.
          </p>
        </div>
      </div>

      <div className="relative z-10 mx-auto -mt-10 max-w-7xl space-y-20 px-4 sm:px-6">
        <section aria-labelledby="all-guides">
          <h2 id="all-guides" className="sr-only">
            Guides
          </h2>
          <ul className="grid gap-6 md:grid-cols-2">
            {guides.map((g) => (
              <li key={g.slug}>
                <ArticleCard data={card(g, "guide")} />
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="from-blog">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-accent-strong">Tutorials</p>
          <h2 id="from-blog" className="mt-1 flex items-center gap-2 font-display text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
            <Newspaper aria-hidden className="h-6 w-6 text-accent-strong" /> From the blog
          </h2>
          <ul className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((p) => (
              <li key={p.slug}>
                <ArticleCard data={card(p, "post")} />
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="tools">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-accent-strong">Practise</p>
          <h2 id="tools" className="mt-1 flex items-center gap-2 font-display text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
            <Calculator aria-hidden className="h-6 w-6 text-accent-strong" /> Calculators to practise with
          </h2>
          <CalculatorCards className="mt-6" />
        </section>
      </div>
    </>
  );
}
