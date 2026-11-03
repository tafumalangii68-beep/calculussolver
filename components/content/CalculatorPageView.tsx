import Link from "next/link";
import { Solver } from "@/components/solver/Solver";
import type { CalculatorPage } from "@/data/calculators";
import { getPost } from "@/data/blog";
import { guides } from "@/data/guides";
import { calculators } from "@/data/calculators";
import { webApplicationLd } from "@/lib/seo";
import { calculatorNav } from "@/lib/site-config";
import { FaqSection } from "./FaqSection";
import { Figure } from "./Figure";
import { JsonLd } from "./JsonLd";
import { LinkCards } from "./LinkCards";
import { PageIntro } from "./PageIntro";
import { Tex } from "./Tex";
import { WorkedExample } from "./WorkedExample";

function SectionHeading({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <h2 id={id} className="font-serif text-2xl font-semibold text-ink sm:text-3xl">
      {children}
    </h2>
  );
}

export function CalculatorPageView({ page }: { page: CalculatorPage }) {
  const path = `/${page.slug}`;
  const nav = calculatorNav.find((c) => c.slug === page.slug)!;
  const label = nav.label;
  const related = page.related.map((slug) => ({
    href: `/${slug}`,
    title: calculatorNav.find((c) => c.slug === slug)!.label,
    titleClass: calculatorNav.find((c) => c.slug === slug)!.titleClass,
    description: calculators[slug].intro.split(". ")[0] + ".",
  }));

  return (
    <div className="mx-auto max-w-6xl px-4 pt-8 sm:px-6 sm:pt-10">
      <JsonLd data={webApplicationLd(page.h1, path, page.metaDescription)} />
      <PageIntro crumbs={[{ name: label, path }]} title={page.h1} titleClass={nav.titleClass}>
        <p>{page.intro}</p>
      </PageIntro>

      <div className="mt-8">
        <Solver operations={page.operations} examples={page.solverExamples} title={page.h1} initialOrder={page.initialOrder} />
      </div>

      <div className="mt-16 grid grid-cols-1 gap-16">
        <section aria-labelledby="definition" className="prose-body">
          <SectionHeading id="definition">{page.definition.heading}</SectionHeading>
          {page.image && <Figure image={page.image} />}
          {page.definition.paragraphs.map((p) => (
            <p key={p}>{p}</p>
          ))}
          {page.definition.formula && (
            <div className="rounded-card border border-line bg-surface px-4 py-3">
              <Tex display>{page.definition.formula}</Tex>
            </div>
          )}
        </section>

        <section aria-labelledby="rules">
          <SectionHeading id="rules">{page.rules.heading}</SectionHeading>
          <p className="mt-3 max-w-[72ch] text-ink-soft">{page.rules.intro}</p>
          <ul className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
            {page.rules.items.map((rule) => (
              <li key={rule.name} className="rounded-card border border-line bg-surface p-5">
                <h3 className="font-semibold text-ink">{rule.name}</h3>
                <Tex display className="mt-2 text-ink">
                  {rule.latex}
                </Tex>
                <p className="mt-2 text-sm text-muted">{rule.text}</p>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="how" className="prose-body">
          <SectionHeading id="how">How this calculator works</SectionHeading>
          {page.howItWorks.map((p) => (
            <p key={p}>{p}</p>
          ))}
          <p>
            For the full details, including how answers are verified, see{" "}
            <Link href="/how-it-works">how the solver works</Link>.
          </p>
        </section>

        <section aria-labelledby="examples">
          <SectionHeading id="examples">Worked examples</SectionHeading>
          <p className="mt-3 max-w-[72ch] text-ink-soft">
            Work through these by hand first, then enter them above to compare each step.
          </p>
          <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
            {page.examples.map((example, i) => (
              <WorkedExample key={example.title} example={example} index={i} />
            ))}
          </div>
        </section>

        <section aria-labelledby="mistakes">
          <SectionHeading id="mistakes">Common mistakes</SectionHeading>
          <ul className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
            {page.mistakes.map((m) => (
              <li key={m.title} className="rounded-card border border-line bg-surface p-5">
                <h3 className="font-semibold text-ink">{m.title}</h3>
                <p className="mt-1 text-ink-soft">{m.text}</p>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="limitations" className="prose-body">
          <SectionHeading id="limitations">Limitations</SectionHeading>
          <ul>
            {page.limitations.map((l) => (
              <li key={l}>{l}</li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="related">
          <SectionHeading id="related">Related calculators</SectionHeading>
          <div className="mt-6">
            <LinkCards
              cards={[
                { href: "/", title: "Calculus Solver", description: "All operations in one place: derivatives, integrals, limits and more." },
                ...related,
                ...(page.guide
                  ? [
                      {
                        href: page.guide.href,
                        title: page.guide.label,
                        description: "A study guide with explanations and practice examples.",
                        titleClass: guides.find((g) => page.guide!.href === `/guides/${g.slug}`)?.titleClass,
                      },
                    ]
                  : []),
                ...(page.articles ?? []).map((slug) => {
                  const post = getPost(slug)!;
                  return { href: `/blog/${slug}`, title: post.title.split(" (")[0], description: "Step-by-step tutorial on the blog.", titleClass: post.titleClass };
                }),
              ]}
            />
          </div>
        </section>
      </div>

      <FaqSection faqs={page.faqs} />

      <section className="mt-16 rounded-card bg-ink px-6 py-8 text-paper sm:px-10">
        <h2 className="font-serif text-2xl font-semibold">Next step</h2>
        <p className="mt-2 max-w-2xl text-paper/80">
          Pick one of the worked examples, solve it on paper, then enter it in the calculator and compare your steps with each
          rule shown. Spotting where your work differs is the fastest way to improve.
        </p>
        <a href="#main" className="mt-4 inline-block rounded-lg bg-paper px-5 py-2.5 font-semibold text-ink hover:bg-sunken">
          Back to the calculator
        </a>
      </section>
    </div>
  );
}
