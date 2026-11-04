import { BookOpen, Newspaper } from "lucide-react";
import Link from "next/link";
import { articleMeta } from "@/data/article-meta";
import { posts } from "@/data/blog";
import { guides } from "@/data/guides";
import { readingMinutes } from "@/lib/reading-time";
import { webPageLd } from "@/lib/seo";
import { ArticleCard, type ArticleCardData } from "./ArticleParts";
import { Breadcrumbs } from "./Breadcrumbs";
import { JsonLd } from "./JsonLd";
import { PAGE_SIZE, Pagination, pageHref } from "./Pagination";

export const BLOG_DESCRIPTION =
  "Step-by-step calculus tutorials from Calculus Solver: how to find derivatives, integrals and limits, with worked examples you can check.";

export const sortedPosts = () => [...posts].sort((a, b) => (b.published ?? "").localeCompare(a.published ?? ""));

const card = (g: (typeof posts)[number], kind: "guide" | "post"): ArticleCardData => ({
  guide: g,
  href: kind === "post" ? `/blog/${g.slug}` : `/guides/${g.slug}`,
  kind,
  category: articleMeta[g.slug]?.category ?? "Calculus",
  minutes: readingMinutes(g),
});

/** Magazine-style blog listing: featured article on page 1, then a grid, then pagination. */
export function BlogIndex({ page = 1 }: { page?: number }) {
  const all = sortedPosts();
  const start = (page - 1) * PAGE_SIZE;
  const onPage = all.slice(start, start + PAGE_SIZE);
  const [featured, ...rest] = page === 1 ? onPage : [undefined, ...onPage];
  const path = pageHref("/blog", page);

  return (
    <>
      <JsonLd data={webPageLd(page === 1 ? "Calculus Blog" : `Calculus Blog – Page ${page}`, path, BLOG_DESCRIPTION)} />
      <div className="relative isolate overflow-hidden bg-navy-gradient pb-20 pt-8 text-white sm:pt-10">
        <div aria-hidden className="absolute -right-24 -top-24 -z-10 h-[26rem] w-[26rem] rounded-full bg-[#923eff]/30 blur-3xl" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <Breadcrumbs items={[{ name: "Blog", path: "/blog" }, ...(page > 1 ? [{ name: `Page ${page}`, path }] : [])]} tone="dark" />
          <p className="mt-6 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm font-medium text-white/90 ring-1 ring-white/15">
            <Newspaper aria-hidden className="h-4 w-4 text-[#c9a8ff]" /> Tutorials and explainers
          </p>
          <h1 className="mt-5 font-display text-[clamp(2.2rem,5vw,3.4rem)] font-extrabold tracking-tight">
            Calculus <span className="text-brand-gradient">Blog</span>
            {page > 1 && <span className="text-white/60"> · Page {page}</span>}
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-white/80">
            Step-by-step tutorials for common calculus questions. For reference material, see the{" "}
            <Link href="/guides" className="font-semibold text-white underline underline-offset-2">
              study guides
            </Link>
            .
          </p>
          <p className="mt-6 flex flex-wrap gap-2 text-sm text-white/85">
            <span className="rounded-full bg-white/10 px-3 py-1 ring-1 ring-white/15">
              {posts.length} {posts.length === 1 ? "tutorial" : "tutorials"}
            </span>
            <span className="rounded-full bg-white/10 px-3 py-1 ring-1 ring-white/15">{guides.length} study guides</span>
          </p>
        </div>
      </div>

      <div className="relative z-10 mx-auto -mt-10 max-w-7xl px-4 sm:px-6">
        {featured && (
          <section aria-labelledby="featured-title">
            <h2 id="featured-title" className="sr-only">
              Featured article
            </h2>
            <ArticleCard data={card(featured, "post")} featured headingLevel="h3" />
          </section>
        )}

        {rest.length > 0 && (
          <section aria-labelledby="latest-title" className="mt-16">
            <h2 id="latest-title" className="font-display text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
              Latest articles
            </h2>
            <ul className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {rest.map((p) => (
                <li key={p!.slug}>
                  <ArticleCard data={card(p!, "post")} />
                </li>
              ))}
            </ul>
          </section>
        )}

        <Pagination base="/blog" page={page} total={all.length} />

        <section aria-labelledby="guides-title" className="mt-20">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-accent-strong">Go deeper</p>
          <h2 id="guides-title" className="mt-1 flex items-center gap-2 font-display text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
            <BookOpen aria-hidden className="h-6 w-6 text-accent-strong" /> Study guides
          </h2>
          <ul className="mt-6 grid gap-6 md:grid-cols-2">
            {guides.map((g) => (
              <li key={g.slug}>
                <ArticleCard data={card(g, "guide")} />
              </li>
            ))}
          </ul>
        </section>
      </div>
    </>
  );
}
