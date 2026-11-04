import { ArrowRight, BadgeCheck, Ban, Cpu, Gift, ListChecks, Lock, ScanText, Sparkles, Workflow } from "lucide-react";
import Link from "next/link";
import { calculatorNav } from "@/lib/site-config";
import { SectionHeader } from "./SectionHeader";
import { Tex } from "./Tex";

const t = String.raw;

const card = "rounded-3xl border border-line bg-surface p-6 shadow-card sm:p-7";
const iconChip = "grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-brand-gradient text-white shadow-glow [&>svg]:h-5 [&>svg]:w-5";

// ---------- How It Works ----------

const PROCESS = [
  { icon: <ScanText />, title: "Read", text: "Your text is parsed into an expression tree, and the “Reads as” preview shows exactly how it was understood." },
  { icon: <Workflow />, title: "Solve", text: "Exact rules are applied one node at a time. Every rule used is recorded as a step with its intermediate result." },
  { icon: <BadgeCheck />, title: "Verify", text: "The answer is checked by an independent method, such as differentiating an antiderivative or a numerical estimate." },
  { icon: <ListChecks />, title: "Show", text: "You get the steps and the answer, plus the check that was done, or a plain explanation when it can't be solved." },
];

/** Four numbered cards that summarise the solving pipeline. */
export function ProcessCards() {
  return (
    <section aria-labelledby="process-title" className="rounded-3xl border border-line bg-surface p-6 shadow-[0_24px_60px_-24px_rgb(21_25_54/0.25)] sm:p-10">
      <SectionHeader id="process-title" eyebrow="The process" title="Every answer takes" highlight="four steps" />
      <ol className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {PROCESS.map((step, i) => (
          <li key={step.title} className="relative rounded-2xl border border-line bg-paper p-5 transition-all duration-300 hover:-translate-y-1 hover:border-accent/40">
            <div className="flex items-center justify-between">
              <span aria-hidden className={iconChip}>
                {step.icon}
              </span>
              <span className="font-display text-3xl font-extrabold text-accent-strong">
                {String(i + 1).padStart(2, "0")}
              </span>
            </div>
            <h3 className="mt-4 font-display text-lg font-bold text-ink">
              {step.title}
            </h3>
            <p className="mt-1.5 text-sm leading-relaxed text-muted">{step.text}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}

const EXAMPLE_STEPS = [
  { label: "Read", text: "The input x^2 sin(x) is read as a product of two factors.", math: t`x^{2}\cdot\sin x` },
  { label: "Solve", text: "The product rule applies, with u = x² and v = sin x.", math: t`\frac{d}{dx}(uv) = u'v + uv'` },
  { label: "Solve", text: "Differentiate each factor with the power rule and the table derivative of sin.", math: t`u' = 2x,\qquad v' = \cos x` },
  { label: "Verify", text: "At a sample point such as x = 1, the result agrees with a central finite-difference estimate.", math: t`2\sin 1 + \cos 1 \approx 2.22324` },
];

/** A worked example that follows one derivative through the pipeline. */
export function ExampleCalculation() {
  return (
    <section aria-labelledby="example-title" className="grid items-start gap-8 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
      <div className="lg:sticky lg:top-24">
        <SectionHeader id="example-title" align="left" eyebrow="Example calculation" title="One derivative," highlight="start to finish">
          <p>How the pipeline handles a typical product-rule problem. The calculators show steps like these for every answer.</p>
        </SectionHeader>
        <div className="mt-6 rounded-3xl bg-navy-gradient p-6 text-white shadow-glow">
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-white/60">Problem</p>
          <Tex display className="mt-2 text-lg [&_.katex]:text-white">{t`\frac{d}{dx}\left[x^{2}\sin x\right]`}</Tex>
          <p className="mt-4 text-sm font-semibold uppercase tracking-[0.14em] text-white/60">Answer</p>
          <Tex display className="mt-2 text-lg [&_.katex]:text-white">{t`2x\sin x + x^{2}\cos x`}</Tex>
          <Link
            href="/derivative-calculator"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-brand-gradient px-5 py-3 text-sm font-semibold text-white hover:bg-brand-gradient-hover"
          >
            Try it in the Derivative Calculator <ArrowRight aria-hidden className="h-4 w-4" />
          </Link>
        </div>
      </div>
      <ol className="space-y-4">
        {EXAMPLE_STEPS.map((s, i) => (
          <li key={i} className={`${card} flex gap-4`}>
            <span aria-hidden className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-accent-soft font-display font-extrabold text-accent-strong">
              {i + 1}
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-accent-strong">{s.label}</p>
              <p className="mt-1 text-ink-soft">{s.text}</p>
              <Tex display className="mt-3 rounded-xl bg-paper px-4 py-3">{s.math}</Tex>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}

// ---------- About ----------

/** Grid of every calculator, with what each one does. */
export function FeatureGrid() {
  return (
    <section aria-labelledby="features-title">
      <SectionHeader id="features-title" eyebrow="Features" title="Nine calculators," highlight="one engine">
        <p>Each one shows its steps and checks its answer before showing it.</p>
      </SectionHeader>
      <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {calculatorNav.map((c) => (
          <li key={c.slug} className="flex">
            <Link
              href={`/${c.slug}`}
              className="group flex w-full items-start gap-4 rounded-2xl border border-line bg-surface p-5 shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-accent/40"
            >
              <span aria-hidden className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-accent-soft text-accent-strong">
                <Sparkles className="h-5 w-5" />
              </span>
              <span className="min-w-0 flex-1">
                <span className={`block font-display font-bold ${c.titleClass}`}>{c.label}</span>
                <span className="mt-1 block text-sm text-muted">{c.blurb}</span>
              </span>
              <ArrowRight aria-hidden className="mt-1 h-4 w-4 shrink-0 text-accent-strong transition-transform group-hover:translate-x-1" />
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

const TRUST = [
  { icon: <BadgeCheck />, title: "Checked before shown", text: "Every answer passes an independent check. If the check fails, you are told instead of shown a guess." },
  { icon: <Cpu />, title: "No AI, no guessing", text: "Deterministic algebra rules and standard numerical methods: the same input always gives the same output." },
  { icon: <Lock />, title: "Your problems stay with you", text: "The solver runs in your browser. Expressions are never uploaded or stored." },
  { icon: <Gift />, title: "Free, with no account", text: "Every calculator and every step is available immediately, with nothing to sign up for." },
  { icon: <Ban />, title: "Open about limits", text: "The methods and what they cannot do are documented in full on How It Works." },
  { icon: <ListChecks />, title: "Tested examples", text: "Each worked example on the site is fed to the solver by an automated test before every release." },
];

/** Trust and transparency cards on the About page. Every claim is described in detail elsewhere on the site. */
export function TrustGrid() {
  return (
    <section aria-labelledby="trust-title" className="relative isolate overflow-hidden rounded-[2rem] bg-navy-gradient px-6 py-12 text-white sm:px-10 sm:py-14">
      <div aria-hidden className="absolute -right-20 -top-20 -z-10 h-80 w-80 rounded-full bg-[#923eff]/30 blur-3xl" />
      <div className="mx-auto max-w-3xl text-center">
        <p className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.14em] text-white/90 ring-1 ring-white/15">
          <span aria-hidden>✦</span> Trust and transparency
        </p>
        <h2 id="trust-title" className="mt-4 font-display text-[clamp(1.75rem,3.2vw,2.6rem)] font-extrabold leading-[1.15] tracking-tight">
          What you can rely on
        </h2>
      </div>
      <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {TRUST.map((item) => (
          <li key={item.title} className="rounded-2xl border border-white/10 bg-white/[0.06] p-5 backdrop-blur-sm">
            <span aria-hidden className={iconChip}>
              {item.icon}
            </span>
            <h3 className="mt-4 font-display text-lg font-bold">{item.title}</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-white/75">{item.text}</p>
          </li>
        ))}
      </ul>
      <div className="mt-10 flex flex-wrap justify-center gap-3">
        <Link href="/how-it-works" className="inline-flex items-center gap-2 rounded-xl bg-brand-gradient px-5 py-3 font-semibold text-white shadow-glow hover:bg-brand-gradient-hover">
          How it works <ArrowRight aria-hidden className="h-4 w-4" />
        </Link>
        <Link href="/privacy-policy" className="inline-flex items-center gap-2 rounded-xl border border-white/25 px-5 py-3 font-semibold text-white hover:bg-white/10">
          Privacy policy
        </Link>
      </div>
    </section>
  );
}
