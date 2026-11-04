import { AlertTriangle, ArrowRight, BookOpen, CheckCircle2, Cpu, Info, ListOrdered, Sigma } from "lucide-react";
import Link from "next/link";
import { Solver } from "@/components/solver/Solver";
import { getPost } from "@/data/blog";
import { calculatorThemes, type RulesLayout, type SectionKey } from "@/data/calculator-themes";
import type { CalculatorPage, Rule } from "@/data/calculators";
import { guides } from "@/data/guides";
import { webApplicationLd } from "@/lib/seo";
import { calculatorNav } from "@/lib/site-config";
import { Breadcrumbs } from "./Breadcrumbs";
import { CalculatorCards, calculatorStyle } from "./CalculatorCards";
import { CalculatorVisual, visualLabels } from "./CalculatorVisual";
import { FaqSection } from "./FaqSection";
import { JsonLd } from "./JsonLd";
import { LinkCards } from "./LinkCards";
import { Tex } from "./Tex";
import { WorkedExample } from "./WorkedExample";

function SectionHeading({ id, eyebrow, children }: { id: string; eyebrow?: string; children: React.ReactNode }) {
  return (
    <div>
      {eyebrow && <p className="text-xs font-bold uppercase tracking-[0.14em] text-accent-strong">{eyebrow}</p>}
      <h2 id={id} className="mt-1 font-display text-2xl font-extrabold tracking-tight text-ink sm:text-[2rem] sm:leading-tight">
        {children}
      </h2>
    </div>
  );
}

/** The rules or techniques of a calculator, in the layout chosen for that page. */
function RulesBlock({ items, layout }: { items: Rule[]; layout: RulesLayout }) {
  switch (layout) {
    case "table":
      return (
        <div className="mt-6 overflow-x-auto rounded-2xl border border-line bg-surface shadow-card">
          <table className="w-full min-w-[38rem] text-sm">
            <caption className="sr-only">Rules reference</caption>
            <thead>
              <tr className="border-b border-line bg-accent-soft/60 text-left">
                <th scope="col" className="w-44 px-5 py-3 font-display font-bold text-ink">
                  Rule
                </th>
                <th scope="col" className="px-5 py-3 font-display font-bold text-ink">
                  Formula
                </th>
                <th scope="col" className="px-5 py-3 font-display font-bold text-ink">
                  In words
                </th>
              </tr>
            </thead>
            <tbody>
              {items.map((rule) => (
                <tr key={rule.name} className="border-b border-line align-top transition-colors last:border-0 hover:bg-paper">
                  <th scope="row" className="px-5 py-4 text-left font-semibold text-ink">
                    {rule.name}
                  </th>
                  <td className="math-left px-5 py-2 text-ink">
                    <Tex display>{rule.latex}</Tex>
                  </td>
                  <td className="px-5 py-4 text-ink-soft">{rule.text}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    case "steps":
      return (
        <ol className="mt-8 space-y-5">
          {items.map((rule, i) => (
            <li key={rule.name} className="relative pl-14">
              <span aria-hidden className="absolute left-0 top-0 grid h-10 w-10 place-items-center rounded-2xl bg-brand-gradient font-display font-bold text-white shadow-glow">
                {i + 1}
              </span>
              {i < items.length - 1 && <span aria-hidden className="absolute bottom-[-20px] left-5 top-12 w-px bg-gradient-to-b from-accent/40 to-transparent" />}
              <div className="rounded-2xl border border-line bg-surface p-5 shadow-card">
                <h3 className="font-display text-lg font-bold text-ink">{rule.name}</h3>
                <div className="mt-2 rounded-xl bg-paper px-3 text-ink">
                  <Tex display>{rule.latex}</Tex>
                </div>
                <p className="mt-2 text-ink-soft">{rule.text}</p>
              </div>
            </li>
          ))}
        </ol>
      );
    case "sheet":
      return (
        <div className="mt-6 overflow-hidden rounded-2xl border border-line bg-surface shadow-card">
          <p className="flex items-center gap-2 border-b border-line bg-accent-soft/60 px-5 py-3 font-display font-bold text-ink">
            <Sigma aria-hidden className="h-4 w-4 text-accent-strong" /> Formula sheet
          </p>
          <dl className="divide-y divide-line">
            {items.map((rule) => (
              <div key={rule.name} className="grid gap-x-6 gap-y-1 px-5 py-4 md:grid-cols-[10rem_minmax(0,1fr)]">
                <dt className="font-display font-bold text-ink md:pt-3">{rule.name}</dt>
                <dd>
                  <div className="math-left text-ink">
                    <Tex display>{rule.latex}</Tex>
                  </div>
                  <p className="text-sm text-muted">{rule.text}</p>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      );
    default:
      return (
        <ul className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
          {items.map((rule) => (
            <li key={rule.name} className="flex flex-col rounded-2xl border border-line bg-surface p-5 shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-accent/40">
              <h3 className="font-display text-lg font-bold text-ink">{rule.name}</h3>
              <div className="mt-3 rounded-xl bg-accent-soft/60 px-3 text-ink">
                <Tex display>{rule.latex}</Tex>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-muted">{rule.text}</p>
            </li>
          ))}
        </ul>
      );
  }
}

export function CalculatorPageView({ page }: { page: CalculatorPage }) {
  const path = `/${page.slug}`;
  const nav = calculatorNav.find((c) => c.slug === page.slug)!;
  const theme = calculatorThemes[page.slug];
  const style = calculatorStyle[page.slug];
  const label = nav.label;

  const extraLinks = [
    { href: "/", title: "Calculus Solver", description: "All operations in one place: derivatives, integrals, limits and more." },
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
  ];

  const SECTIONS: Record<SectionKey, { title: string; render: () => React.ReactNode }> = {
    definition: {
      title: page.definition.heading,
      render: () => (
        <section aria-labelledby="definition" key="definition" className="scroll-mt-24">
          <SectionHeading id="definition" eyebrow="The idea">
            {page.definition.heading}
          </SectionHeading>
          <div className="prose-body mt-5 max-w-none">
            {page.definition.paragraphs.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
          {page.definition.formula && (
            <div className="relative mt-6 overflow-hidden rounded-2xl border border-accent/30 bg-surface px-5 py-4 shadow-card">
              <span aria-hidden className="absolute inset-y-0 left-0 w-1.5 bg-brand-gradient" />
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-accent-strong">Key formula</p>
              <div className="text-lg text-ink">
                <Tex display>{page.definition.formula}</Tex>
              </div>
            </div>
          )}
        </section>
      ),
    },
    rules: {
      title: page.rules.heading,
      render: () => (
        <section aria-labelledby="rules" key="rules" className="scroll-mt-24">
          <SectionHeading id="rules" eyebrow={theme.rulesLayout === "steps" ? "Step by step" : theme.rulesLayout === "sheet" ? "Reference" : "Rules"}>
            {page.rules.heading}
          </SectionHeading>
          <p className="mt-3 max-w-[72ch] text-ink-soft">{page.rules.intro}</p>
          <RulesBlock items={page.rules.items} layout={theme.rulesLayout} />
        </section>
      ),
    },
    how: {
      title: "How this calculator works",
      render: () => (
        <section aria-labelledby="how" key="how" className="scroll-mt-24 rounded-3xl border border-line bg-surface p-6 shadow-card sm:p-8">
          <div className="flex items-start gap-4">
            <span aria-hidden className="hidden h-12 w-12 shrink-0 place-items-center rounded-2xl bg-accent-soft text-accent-strong sm:grid">
              <Cpu className="h-6 w-6" />
            </span>
            <div className="min-w-0">
              <SectionHeading id="how" eyebrow="Under the hood">
                How this calculator works
              </SectionHeading>
              <div className="prose-body mt-4 max-w-none">
                {page.howItWorks.map((p) => (
                  <p key={p}>{p}</p>
                ))}
                <p>
                  For the full details, including how answers are verified, see <Link href="/how-it-works">how the solver works</Link>.
                </p>
              </div>
            </div>
          </div>
        </section>
      ),
    },
    examples: {
      title: "Worked examples",
      render: () => (
        <section aria-labelledby="examples" key="examples" className="scroll-mt-24">
          <SectionHeading id="examples" eyebrow="Practice">
            Worked examples
          </SectionHeading>
          <p className="mt-3 max-w-[72ch] text-ink-soft">Work through these by hand first, then enter them above to compare each step.</p>
          <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-2">
            {page.examples.map((example, i) => (
              <WorkedExample key={example.title} example={example} index={i} />
            ))}
          </div>
        </section>
      ),
    },
    mistakes: {
      title: "Common mistakes",
      render: () => (
        <section aria-labelledby="mistakes" key="mistakes" className="scroll-mt-24">
          <SectionHeading id="mistakes" eyebrow="Watch out">
            Common mistakes
          </SectionHeading>
          <ul className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
            {page.mistakes.map((m) => (
              <li key={m.title} className="flex gap-3 rounded-2xl border border-line bg-surface p-5 shadow-card">
                <span aria-hidden className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-danger-soft text-danger">
                  <AlertTriangle className="h-4 w-4" />
                </span>
                <div className="min-w-0">
                  <h3 className="font-display font-bold text-ink">{m.title}</h3>
                  <p className="mt-1 text-ink-soft">{m.text}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>
      ),
    },
    limitations: {
      title: "Limitations",
      render: () => (
        <section aria-labelledby="limitations" key="limitations" className="scroll-mt-24 rounded-3xl border border-warn/25 bg-warn-soft/60 p-6 sm:p-8">
          <div className="flex items-start gap-3">
            <Info aria-hidden className="mt-1.5 h-5 w-5 shrink-0 text-warn" />
            <div className="min-w-0">
              <h2 id="limitations" className="font-display text-xl font-extrabold text-ink sm:text-2xl">
                Limitations
              </h2>
              <ul className="prose-body mt-3 max-w-none">
                {page.limitations.map((l) => (
                  <li key={l}>{l}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      ),
    },
  };

  const toc = [
    ...theme.order.map((key) => ({ id: key, title: SECTIONS[key].title })),
    { id: "faq-title", title: "Frequently asked questions" },
    { id: "related", title: "Related calculators" },
  ];

  return (
    <>
      <JsonLd data={webApplicationLd(page.h1, path, page.metaDescription)} />

      {/* Hero */}
      <div className="relative isolate overflow-hidden bg-navy-gradient pb-36 pt-8 text-white sm:pt-10">
        <div aria-hidden className="absolute -right-24 -top-24 -z-10 h-[28rem] w-[28rem] rounded-full opacity-40 blur-3xl" style={{ background: theme.glow }} />
        <div aria-hidden className="absolute -bottom-40 left-1/4 -z-10 h-80 w-80 rounded-full bg-[#4c22c9]/30 blur-3xl" />
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-[1.15fr_1fr]">
          <div>
            <Breadcrumbs items={[{ name: label, path }]} tone="dark" />
            <div className="mt-6 flex items-center gap-3">
              <span aria-hidden className="grid h-12 w-12 place-items-center rounded-2xl bg-brand-gradient text-white shadow-glow">
                {style.icon}
              </span>
              <span className="rounded-full border border-white/15 bg-white/10 px-3.5 py-1.5 text-sm font-medium text-white/90">Free · Step by step · Private</span>
            </div>
            <h1 id="page-title" className="mt-5 font-display text-[clamp(2.1rem,4.6vw,3.25rem)] font-extrabold leading-[1.1] tracking-tight">
              {page.h1}
            </h1>
            <p className="mt-4 max-w-2xl text-lg leading-relaxed text-white/80">{page.intro}</p>
            <ul className="mt-6 flex flex-wrap gap-2">
              {theme.highlights.map((h) => (
                <li key={h} className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3.5 py-1.5 text-sm font-medium text-white/90 ring-1 ring-white/15">
                  <CheckCircle2 aria-hidden className="h-4 w-4 text-[#c9a8ff]" />
                  {h}
                </li>
              ))}
            </ul>
          </div>
          <div className="animate-fade-up rounded-3xl border border-white/10 bg-white/[0.04] p-4 shadow-2xl backdrop-blur-sm [animation-delay:120ms] sm:p-6">
            <CalculatorVisual slug={page.slug} label={page.image?.alt ?? visualLabels[page.slug]} />
          </div>
        </div>
      </div>

      {/* Calculator + quick start */}
      <div className="relative z-10 mx-auto -mt-28 grid max-w-7xl items-start gap-6 px-4 sm:px-6 lg:grid-cols-[minmax(0,1fr)_18rem]">
        <Solver operations={page.operations} examples={page.solverExamples} title={page.h1} heading={label} initialOrder={page.initialOrder} />
        <aside aria-labelledby="quick-start" className="rounded-3xl border border-line bg-surface p-6 shadow-[0_24px_60px_-20px_rgb(21_25_54/0.22)]">
          <h2 id="quick-start" className="flex items-center gap-2 font-display text-lg font-bold text-ink">
            <ListOrdered aria-hidden className="h-5 w-5 text-accent-strong" /> Quick start
          </h2>
          <ol className="mt-4 space-y-4">
            {theme.quickStart.map((step, i) => (
              <li key={step} className="flex gap-3 text-sm text-ink-soft">
                <span aria-hidden className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-brand-gradient text-xs font-bold text-white">
                  {i + 1}
                </span>
                <span className="pt-1">{step}</span>
              </li>
            ))}
          </ol>
          {page.guide && (
            <Link href={page.guide.href} className="group mt-6 flex items-center gap-2 rounded-xl bg-accent-soft px-4 py-3 text-sm font-semibold text-accent-strong transition-colors hover:bg-accent-soft/70">
              <BookOpen aria-hidden className="h-4 w-4 shrink-0" />
              <span className="flex-1">{page.guide.label}</span>
              <ArrowRight aria-hidden className="h-4 w-4 shrink-0 transition-transform group-hover:translate-x-1" />
            </Link>
          )}
        </aside>
      </div>

      {/* Content with an "On this page" sidebar */}
      <div className="mx-auto mt-20 grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-[minmax(0,1fr)_16rem]">
        <div className="min-w-0 space-y-20">
          {theme.order.map((key) => SECTIONS[key].render())}
          <div className="-mt-4">
            <FaqSection faqs={page.faqs} />
          </div>
        </div>
        <aside aria-label="On this page" className="hidden lg:block">
          <nav className="sticky top-24 rounded-2xl border border-line bg-surface p-5 shadow-card">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-muted">On this page</p>
            <ul className="mt-3 space-y-1 border-l border-line">
              {toc.map((item) => (
                <li key={item.id}>
                  <a href={`#${item.id}`} className="-ml-px block border-l-2 border-transparent py-1.5 pl-3 text-sm text-ink-soft transition-colors hover:border-accent hover:text-accent-strong">
                    {item.title}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </aside>
      </div>

      {/* Related */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <section aria-labelledby="related" className="mt-24 scroll-mt-24">
          <SectionHeading id="related" eyebrow="Keep going">
            Related calculators
          </SectionHeading>
          <CalculatorCards slugs={page.related} className="mt-6" />
          <div className="mt-4">
            <LinkCards cards={extraLinks} />
          </div>
        </section>

        <section aria-labelledby="next-step" className="relative isolate mt-20 overflow-hidden rounded-3xl bg-navy-gradient px-6 py-10 text-white sm:px-12">
          <div aria-hidden className="absolute -right-16 -top-16 -z-10 h-64 w-64 rounded-full opacity-40 blur-3xl" style={{ background: theme.glow }} />
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="max-w-2xl">
              <h2 id="next-step" className="font-display text-2xl font-extrabold tracking-tight sm:text-3xl">
                Next step
              </h2>
              <p className="mt-2 text-white/80">
                Pick one of the worked examples, solve it on paper, then enter it in the calculator and compare your steps with each rule
                shown. Spotting where your work differs is the fastest way to improve.
              </p>
            </div>
            <a
              href="#main"
              className="group inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-brand-gradient px-6 py-3.5 font-semibold text-white shadow-glow transition-all hover:-translate-y-0.5 hover:bg-brand-gradient-hover"
            >
              Back to the calculator
              <ArrowRight aria-hidden className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </a>
          </div>
        </section>
      </div>
    </>
  );
}
