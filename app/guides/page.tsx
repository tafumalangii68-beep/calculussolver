import { LinkCards } from "@/components/content/LinkCards";
import { PageIntro } from "@/components/content/PageIntro";
import { posts } from "@/data/blog";
import { guides } from "@/data/guides";
import { buildMetadata, webPageLd } from "@/lib/seo";
import { JsonLd } from "@/components/content/JsonLd";
import { calculatorNav } from "@/lib/site-config";

const description = "Calculus study guides: derivative rules and integration techniques explained with worked examples you can check in the solver.";

export const metadata = buildMetadata({ title: "Calculus Study Guides", description, path: "/guides" });

export default function GuidesPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 pt-8 sm:px-6 sm:pt-10">
      <JsonLd data={webPageLd("Calculus Study Guides", "/guides", description)} />
      <PageIntro crumbs={[{ name: "Guides", path: "/guides" }]} title="Calculus Study Guides">
        <p>
          Explanations of the core techniques, written to be read alongside the calculators. Each guide ends with worked
          examples you can check step by step.
        </p>
      </PageIntro>
      <section aria-labelledby="all-guides" className="mt-10">
        <h2 id="all-guides" className="font-serif text-2xl font-semibold text-ink">Guides</h2>
        <div className="mt-4">
          <LinkCards cards={guides.map((g) => ({ href: `/guides/${g.slug}`, title: g.title, description: g.description }))} />
        </div>
      </section>
      <section aria-labelledby="from-blog" className="mt-14">
        <h2 id="from-blog" className="font-serif text-2xl font-semibold text-ink">From the blog</h2>
        <div className="mt-4">
          <LinkCards cards={posts.map((p) => ({ href: `/blog/${p.slug}`, title: p.title, description: p.description }))} />
        </div>
      </section>
      <section aria-labelledby="tools" className="mt-14">
        <h2 id="tools" className="font-serif text-2xl font-semibold text-ink">Calculators to practise with</h2>
        <div className="mt-4">
          <LinkCards cards={calculatorNav.map((c) => ({ href: `/${c.slug}`, title: c.label, description: c.blurb, titleClass: c.titleClass }))} />
        </div>
      </section>
    </div>
  );
}
