import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  GraduationCap,
  Keyboard,
  LayoutGrid,
  ListChecks,
  Lock,
  MonitorSmartphone,
  MousePointerClick,
  Newspaper,
  Play,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { CalculatorCards } from "@/components/content/CalculatorCards";
import { FaqSection } from "@/components/content/FaqSection";
import { JsonLd } from "@/components/content/JsonLd";
import { SectionHeader } from "@/components/content/SectionHeader";
import { Tex } from "@/components/content/Tex";
import { WorkedExample } from "@/components/content/WorkedExample";
import { HeroIllustration } from "@/components/home/HeroIllustration";
import { TangentAreaFigure } from "@/components/home/TangentAreaFigure";
import { StudentReviews } from "@/components/reviews/StudentReviews";
import { StatsCard } from "@/components/reviews/StatsCard";
import { Solver } from "@/components/solver/Solver";
import { posts } from "@/data/blog";
import { guides } from "@/data/guides";
import { homeExamples, homeFaqs, homeSolverExamples, syntaxGuide } from "@/data/home";
import { buildMetadata, webApplicationLd, websiteLd } from "@/lib/seo";
import { calculatorNav } from "@/lib/site-config";

// Approved reviews and the solve counter refresh every 5 minutes.
export const revalidate = 300;

const description =
  "Free calculus solver with step-by-step solutions for derivatives, integrals, limits, Taylor series and critical points. Private: everything runs in your browser.";

export const metadata = buildMetadata({
  title: "Calculus Solver with Steps – Derivatives, Integrals & Limits",
  description,
  path: "/",
  absoluteTitle: true,
});

const t = String.raw;

const SUPPORTED = [
  { op: "Derivatives", detail: "Any order up to 10, with sum, product, quotient, power and chain rule steps.", example: t`\frac{d}{dx}\,x^{2}\sin x` },
  { op: "Indefinite integrals", detail: "Standard forms, u-substitution, integration by parts and partial fractions, each answer verified.", example: t`\int x e^{x}\,dx` },
  { op: "Definite integrals", detail: "Exact values via the Fundamental Theorem of Calculus, improper integrals, and numerical values when needed.", example: t`\int_{0}^{\infty} e^{-x}\,dx` },
  { op: "Limits", detail: "Two-sided, one-sided and at ±∞, using substitution, factoring and L'Hôpital's rule.", example: t`\lim_{x\to 0}\frac{\sin x}{x}` },
  { op: "Taylor series", detail: "Taylor and Maclaurin polynomials up to order 10 about any center.", example: t`e^{x} \approx 1 + x + \tfrac{x^{2}}{2}` },
  { op: "Critical points", detail: "Solve f′(x) = 0 or undefined, then classify as local max, min or neither.", example: t`f'(x) = 3x^{2} - 3` },
  { op: "Partial derivatives", detail: "∂f/∂x, ∂f/∂y and second partials such as fxy, holding other variables constant.", example: t`\frac{\partial}{\partial y}\,x^{2}y^{3}` },
  { op: "Implicit differentiation", detail: "dy/dx for equations in x and y, plus the slope and tangent line at a point.", example: t`x^{2} + y^{2} = 25` },
];

const ENTRY_MISTAKES = [
  { wrong: "1/2x", right: "1/(2x)", why: "Without parentheses, 1/2x means (1/2)·x. The preview shows how your input is read." },
  { wrong: "sin x^2", right: "(sin(x))^2", why: "sin x^2 is read as sin(x²). Write sin(x)^2 or sin^2(x) for the square of sine." },
  { wrong: "e^2x", right: "e^(2x)", why: "The exponent stops at the first term: e^2x means e²·x. Wrap longer exponents in parentheses." },
  { wrong: "log(x) for base 10", right: "log10(x)", why: "log(x) is the natural logarithm here, as in most computer algebra systems." },
  { wrong: "y = x^2", right: "x^2", why: "Enter only the expression, not an equation." },
  { wrong: "sin^-1(x)", right: "asin(x)", why: "sin⁻¹ is ambiguous (inverse or reciprocal), so the solver asks you to choose." },
];

const STEPS = [
  {
    icon: MousePointerClick,
    title: "Choose an operation",
    text: (
      <>Derivative, indefinite or definite integral, limit, Taylor series, critical points, partial derivative or implicit differentiation.</>
    ),
  },
  {
    icon: Keyboard,
    title: "Type your function",
    text: (
      <>
        Use the syntax below, or open the keypad on a phone. Check the &ldquo;Reads as&rdquo; preview to confirm the solver understood you.
      </>
    ),
  },
  {
    icon: SlidersHorizontal,
    title: "Fill in any options",
    text: <>Derivative order, integral bounds, the point a limit approaches, a Taylor center, or a search interval.</>,
  },
  {
    icon: Play,
    title: "Press Solve and read the steps",
    text: (
      <>
        Use <em>Copy answer</em> or <em>Copy LaTeX</em> to reuse the result, and <em>Reset</em> to start over.
      </>
    ),
  },
];

const WHY = [
  { icon: ListChecks, title: "Every rule shown", text: "Each step names the rule it uses, from the power rule to L'Hôpital's rule." },
  { icon: ShieldCheck, title: "Answers verified", text: "Results are checked independently before they are shown to you." },
  { icon: Lock, title: "Private by design", text: "Everything is computed on your device. Nothing you type is uploaded." },
  { icon: Zap, title: "Free, no account", text: "No sign-up, no limits and no paywall on the step-by-step working." },
];

const HERO_TICKS = ["Accurate Results", "Step-by-Step Work", "Free & Easy to Use"];

export default function HomePage() {
  const stats = [
    { icon: GraduationCap, value: `${calculatorNav.length} Calculus Tools`, label: "One for every common problem" },
    { icon: Zap, value: "Step-by-Step", label: "Detailed solutions" },
    { icon: MonitorSmartphone, value: "100% Free", label: "No sign-up required" },
    { icon: ShieldCheck, value: "Verified Answers", label: "Every result double-checked" },
  ];

  return (
    <>
      <JsonLd data={[websiteLd(), webApplicationLd("Calculus Solver", "/", description)]} />

      {/* Hero */}
      <section aria-labelledby="hero-title" className="relative isolate overflow-hidden bg-navy-gradient pb-40 pt-12 text-white sm:pt-16 lg:pb-44">
        {/* Decorative curves */}
        <svg aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-40 w-full" viewBox="0 0 1440 160" preserveAspectRatio="none">
          <path d="M0 110 C 320 40, 620 150, 960 90 S 1320 40, 1440 70 L1440 160 L0 160 Z" fill="#7438f5" fillOpacity="0.16" />
          <path d="M0 140 C 380 80, 760 170, 1100 110 S 1380 90, 1440 110 L1440 160 L0 160 Z" fill="#923eff" fillOpacity="0.14" />
        </svg>
        <div aria-hidden className="pointer-events-none absolute -left-40 top-20 -z-10 h-96 w-96 rounded-full bg-[#4c22c9]/30 blur-3xl" />

        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-[1.15fr_1fr]">
          <div className="animate-fade-up">
            <p className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-medium text-white/90 backdrop-blur">
              <GraduationCap aria-hidden className="h-4 w-4 text-[#c9a8ff]" />
              Free Online Calculus Calculator
            </p>
            <h1 id="hero-title" className="mt-6 font-display text-[clamp(2.2rem,4.4vw,2.85rem)] font-extrabold leading-[1.12] tracking-tight">
              Solve Calculus Problems <br className="hidden xl:block" />
              with{" "}
              <span className="relative inline-block text-brand-gradient xl:whitespace-nowrap">
                Step-by-Step Solutions
                <svg aria-hidden viewBox="0 0 300 12" preserveAspectRatio="none" className="absolute -bottom-2 left-0 h-3 w-full">
                  <path d="M2 9 C 80 2, 200 2, 298 7" fill="none" stroke="#923eff" strokeWidth="3" strokeLinecap="round" />
                </svg>
              </span>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/80">
              Calculate derivatives, integrals, limits, Taylor series and more with clear, accurate and easy-to-follow explanations,
              solved for free in your browser.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href="#calculator"
                className="group inline-flex items-center justify-center gap-2.5 rounded-xl bg-brand-gradient px-7 py-3.5 font-semibold text-white shadow-glow transition-all duration-200 hover:-translate-y-0.5 hover:bg-brand-gradient-hover"
              >
                <Play aria-hidden className="h-4 w-4 fill-current" />
                Start Solving Now
                <ArrowRight aria-hidden className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </a>
              <a
                href="#calculators"
                className="inline-flex items-center justify-center gap-2.5 rounded-xl border border-white/25 bg-white/5 px-7 py-3.5 font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:border-white/50 hover:bg-white/10"
              >
                <LayoutGrid aria-hidden className="h-4 w-4" />
                Explore Calculators
              </a>
            </div>
            <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-3">
              {HERO_TICKS.map((tick) => (
                <li key={tick} className="flex items-center gap-2 text-sm font-medium text-white/85">
                  <span aria-hidden className="grid h-6 w-6 place-items-center rounded-full bg-brand-gradient">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                  </span>
                  {tick}
                </li>
              ))}
            </ul>
          </div>
          <HeroIllustration className="mx-auto w-full max-w-[400px] sm:max-w-[520px] lg:max-w-[640px] animate-fade-up [animation-delay:150ms]" />
        </div>
      </section>

      {/* Main calculator, overlapping the hero */}
      <div id="calculator" className="relative z-10 mx-auto -mt-32 max-w-6xl px-4 sm:px-6">
        <Solver
          title="Calculus Solver"
          heading="Calculus Calculator"
          operations={["derivative", "indefinite-integral", "limit", "taylor", "definite-integral", "critical-points", "partial-derivative", "implicit"]}
          primaryOperations={["derivative", "indefinite-integral", "limit", "taylor"]}
          examples={homeSolverExamples}
        />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* Calculator categories */}
        <section aria-labelledby="calculators-title" id="calculators" className="pt-20 sm:pt-24">
          <SectionHeader id="calculators-title" title="Explore Our" highlight="Calculators">
            A complete set of calculus tools to solve different types of problems quickly and accurately. Each one comes with its own
            rules, worked examples and common mistakes.
          </SectionHeader>
          <CalculatorCards className="mt-10" />

          <ul className="mt-10 grid grid-cols-1 gap-y-6 rounded-3xl bg-navy-gradient px-6 py-7 text-white shadow-[0_24px_50px_-20px_rgb(16_20_59/0.6)] sm:grid-cols-2 sm:px-10 lg:grid-cols-4 lg:divide-x lg:divide-white/10">
            {stats.map((s) => (
              <li key={s.value} className="flex items-center gap-4 lg:px-6 lg:first:pl-0">
                <span aria-hidden className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-white/10 text-[#c9a8ff]">
                  <s.icon className="h-6 w-6" />
                </span>
                <span>
                  <span className="block font-display text-lg font-bold leading-tight">{s.value}</span>
                  <span className="block text-sm text-white/70">{s.label}</span>
                </span>
              </li>
            ))}
          </ul>
        </section>

        <StatsCard />

        {/* How it works */}
        <section aria-labelledby="use" className="pt-24">
          <SectionHeader id="use" eyebrow="How it works" title="How to use the" highlight="solver">
            Four steps from a problem to a fully worked solution.
          </SectionHeader>
          <ol className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((step, i) => (
              <li key={step.title} className="group relative rounded-2xl border border-line bg-surface p-6 shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-accent/40">
                <span aria-hidden className="absolute right-5 top-4 font-display text-5xl font-extrabold text-accent-soft">
                  {i + 1}
                </span>
                <span aria-hidden className="relative grid h-12 w-12 place-items-center rounded-xl bg-brand-gradient text-white shadow-glow">
                  <step.icon className="h-5 w-5" />
                </span>
                <h3 className="relative mt-5 font-display text-lg font-bold text-ink">
                  <span className="sr-only">Step {i + 1}: </span>
                  {step.title}
                </h3>
                <p className="relative mt-2 text-sm leading-relaxed text-muted">{step.text}</p>
              </li>
            ))}
          </ol>
        </section>
      </div>

      {/* Why use our tools */}
      <section aria-labelledby="what" className="mt-24 border-y border-line bg-surface py-20">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2">
          <div>
            <SectionHeader id="what" eyebrow="Why use our calculus tools" title="What this calculus solver" highlight="does" align="left" />
            <div className="prose-body mt-6">
              <p>
                This is a computer algebra tool built for learning calculus. It reads the function you type, applies the same rules
                you use on paper, and shows each one: the power rule, the chain rule, u-substitution, L&apos;Hôpital&apos;s rule and
                the rest. You get more than the final answer; you can see exactly where it came from.
              </p>
              <p>
                It is designed for high school, AP and college calculus students, for teachers preparing examples, and for anyone
                teaching themselves. All computation happens on your device, so it is fast, private and works without an account.
              </p>
            </div>
            <ul className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {WHY.map((w) => (
                <li key={w.title} className="flex gap-3 rounded-2xl bg-paper p-4">
                  <span aria-hidden className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-accent-soft text-accent-strong">
                    <w.icon className="h-5 w-5" />
                  </span>
                  <span>
                    <span className="block font-display font-bold text-ink">{w.title}</span>
                    <span className="mt-0.5 block text-sm text-muted">{w.text}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <TangentAreaFigure />
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* Supported problem types */}
        <section aria-labelledby="supported" className="pt-24">
          <SectionHeader id="supported" eyebrow="Popular calculators" title="Supported problem" highlight="types">
            Everything the solver handles, with a typical example of each.
          </SectionHeader>
          <ul className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {SUPPORTED.map((s) => (
              <li key={s.op} className="flex flex-col rounded-2xl border border-line bg-surface p-5 shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-accent/40">
                <h3 className="font-display font-bold text-ink">{s.op}</h3>
                <div className="mt-3 rounded-xl bg-accent-soft/60 px-3 py-1 text-ink">
                  <Tex display>{s.example}</Tex>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-muted">{s.detail}</p>
              </li>
            ))}
          </ul>
        </section>

        {/* Syntax + entry mistakes */}
        <section aria-labelledby="syntax" className="pt-24">
          <SectionHeader id="syntax" eyebrow="Input guide" title="How to type math" highlight="expressions">
            The solver accepts ordinary calculator syntax. Multiplication signs are optional (2x, x sin x and (x+1)(x−1) all work), and
            symbols such as π, √ and ² can be pasted directly.
          </SectionHeader>
          <div className="mt-10 overflow-x-auto rounded-2xl border border-line bg-surface shadow-card">
            <table className="w-full min-w-[34rem] text-sm">
              <caption className="sr-only">Expression syntax guide</caption>
              <thead>
                <tr className="border-b border-line bg-accent-soft/60 text-left">
                  <th scope="col" className="px-5 py-3.5 font-display font-bold text-ink">
                    Type this
                  </th>
                  <th scope="col" className="px-5 py-3.5 font-display font-bold text-ink">
                    Meaning
                  </th>
                  <th scope="col" className="px-5 py-3.5 font-display font-bold text-ink">
                    Shown as
                  </th>
                </tr>
              </thead>
              <tbody>
                {syntaxGuide.map((row) => (
                  <tr key={row.input} className="border-b border-line transition-colors last:border-0 hover:bg-paper">
                    <td className="px-5 py-3 font-mono text-accent-strong">{row.input}</td>
                    <td className="px-5 py-3 text-ink-soft">{row.meaning}</td>
                    <td className="px-5 py-3">
                      <Tex>{row.latex}</Tex>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section aria-labelledby="entry-mistakes" className="pt-20">
          <h2 id="entry-mistakes" className="font-display text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
            Common mistakes when entering expressions
          </h2>
          <ul className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {ENTRY_MISTAKES.map((m) => (
              <li key={m.wrong} className="rounded-2xl border border-line bg-surface p-5 shadow-card">
                <p className="flex flex-wrap items-center gap-2 font-mono text-sm">
                  <span className="rounded-lg bg-danger-soft px-2 py-0.5 text-danger line-through decoration-1">{m.wrong}</span>
                  <ArrowRight aria-hidden className="h-4 w-4 text-muted" />
                  <span className="sr-only"> should be </span>
                  <span className="rounded-lg bg-ok-soft px-2 py-0.5 text-ok">{m.right}</span>
                </p>
                <p className="mt-3 text-sm leading-relaxed text-ink-soft">{m.why}</p>
              </li>
            ))}
          </ul>
        </section>

        {/* Method */}
        <section aria-labelledby="method" className="mt-24 grid gap-10 rounded-3xl border border-line bg-surface p-6 shadow-card sm:p-10 lg:grid-cols-[1fr_1.4fr]">
          <div>
            <SectionHeader id="method" eyebrow="Methodology" title="How the solver computes results and" highlight="steps" align="left" />
            <Link
              href="/how-it-works"
              className="group mt-6 inline-flex items-center gap-2 rounded-xl bg-brand-gradient px-5 py-3 font-semibold text-white shadow-glow transition-all hover:-translate-y-0.5 hover:bg-brand-gradient-hover"
            >
              Read the full methodology
              <ArrowRight aria-hidden className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
          <div className="prose-body">
            <p>
              Your input is parsed into an expression tree and simplified with exact fractions, never rounded decimals. Derivatives are
              computed by applying one rule per node of that tree, which is why every step names a rule. Integrals are attempted with
              standard forms, substitution, integration by parts and partial fractions. Only if those fail is a bundled computer
              algebra system tried as a fallback.
            </p>
            <p>
              Every answer is then checked independently. Antiderivatives are differentiated and compared with the integrand. Definite
              integrals are compared with high-accuracy numerical integration. Limits are confirmed by evaluating the function close to
              the point. If a check fails, the solver reports that it could not solve the problem rather than showing a doubtful answer.
            </p>
            <p>
              <Link href="/how-it-works">Read the full methodology</Link>, including the numerical methods and their accuracy.
            </p>
          </div>
        </section>

        {/* Worked examples */}
        <section aria-labelledby="examples" className="pt-24">
          <SectionHeader id="examples" eyebrow="Practice" title="Worked" highlight="examples">
            Try these by hand first, then enter them in the calculator to compare each step.
          </SectionHeader>
          <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-2">
            {homeExamples.map((e, i) => (
              <WorkedExample key={e.title} example={e} index={i} />
            ))}
          </div>
        </section>

        {/* Limitations */}
        <section aria-labelledby="limits" className="mt-24 rounded-3xl border border-warn/25 bg-warn-soft/60 p-6 sm:p-10">
          <div className="prose-body max-w-none">
            <h2 id="limits" className="mt-0">
              Limitations
            </h2>
            <p>No solver handles everything, and this one tells you when it reaches its limits. It does not currently support:</p>
            <ul>
              <li>Differential equations, multiple integrals or vector calculus. (Partial derivatives up to second order are supported.)</li>
              <li>Piecewise functions, floor and ceiling, factorials, or complex numbers.</li>
              <li>Convergence tests for infinite series, or word problems.</li>
              <li>
                Integrals without an elementary antiderivative, such as ∫e<sup>x²</sup> dx. The solver says so instead of guessing, and a
                definite integral still gets a numerical value.
              </li>
            </ul>
            <p>
              Answers may also be written in a different but equivalent form from your textbook. For example, an antiderivative can
              differ from the book&apos;s by a constant. Always check important results; see the <Link href="/disclaimer">disclaimer</Link>.
            </p>
          </div>
        </section>

        {/* Learning guides and articles */}
        <section aria-labelledby="explore" className="pt-24">
          <SectionHeader id="explore" eyebrow="Learn" title="Learning guides and" highlight="featured articles">
            Each calculator focuses on one operation; these guides and tutorials explain the techniques behind them from the ground up.
          </SectionHeader>
          <ul className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-3">
            {[
              ...guides.map((g) => ({ href: `/guides/${g.slug}`, title: g.title, text: g.description, kind: "Study guide", icon: BookOpen })),
              ...posts.map((p) => ({ href: `/blog/${p.slug}`, title: p.title.split(" (")[0], text: p.description, kind: "Blog tutorial", icon: Newspaper })),
            ].map((card) => (
              <li key={card.href} className="flex">
                <Link
                  href={card.href}
                  className="group flex w-full flex-col rounded-2xl border border-line bg-surface p-6 shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-accent/40"
                >
                  <span className="flex items-center gap-3">
                    <span aria-hidden className="grid h-11 w-11 place-items-center rounded-xl bg-accent-soft text-accent-strong">
                      <card.icon className="h-5 w-5" />
                    </span>
                    <span className="text-xs font-bold uppercase tracking-wider text-accent-strong">{card.kind}</span>
                  </span>
                  <span className="mt-4 font-display text-lg font-bold leading-snug text-ink">{card.title}</span>
                  <span className="mt-2 flex-1 text-sm leading-relaxed text-muted">{card.text}</span>
                  <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-accent-strong">
                    {card.kind === "Study guide" ? "Read the guide" : "Read the tutorial"}
                    <ArrowRight aria-hidden className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
          <p className="mt-6 text-center">
            <Link href="/guides" className="font-semibold text-accent-strong underline-offset-4 hover:underline">
              Browse all guides
            </Link>
            <span aria-hidden className="mx-3 text-muted">
              ·
            </span>
            <Link href="/blog" className="font-semibold text-accent-strong underline-offset-4 hover:underline">
              Visit the blog
            </Link>
          </p>
        </section>

        <FaqSection faqs={homeFaqs} />
      </div>

      {/* Testimonials: a full-width band so three cards fit with partial cards at both edges. */}
      <div className="mt-20">
        <StudentReviews limit={12} />
      </div>

      {/* Final call to action */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <section aria-labelledby="cta" className="relative isolate mt-20 overflow-hidden rounded-3xl bg-navy-gradient px-6 py-12 text-center text-white sm:px-12 sm:py-16">
          <div aria-hidden className="absolute -right-20 -top-20 -z-10 h-72 w-72 rounded-full bg-[#923eff]/30 blur-3xl" />
          <div aria-hidden className="absolute -bottom-24 -left-16 -z-10 h-72 w-72 rounded-full bg-[#4c22c9]/40 blur-3xl" />
          <Sparkles aria-hidden className="mx-auto h-8 w-8 text-[#c9a8ff]" />
          <h2 id="cta" className="mt-4 font-display text-[clamp(1.75rem,3.5vw,2.6rem)] font-extrabold tracking-tight">
            Start with a problem you&apos;re stuck on
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-white/80">
            Solve it yourself as far as you can, then let the solver show the remaining steps. Comparing the two is where the learning
            happens. When you&apos;re ready to go deeper, the{" "}
            <Link href="/guides" className="font-semibold text-white underline underline-offset-2">
              study guides
            </Link>{" "}
            explain each technique from the ground up.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <a
              href="#calculator"
              className="group inline-flex items-center justify-center gap-2 rounded-xl bg-brand-gradient px-7 py-3.5 font-semibold text-white shadow-glow transition-all hover:-translate-y-0.5 hover:bg-brand-gradient-hover"
            >
              Back to the solver
              <ArrowRight aria-hidden className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </a>
            <Link
              href="/guides"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/25 px-7 py-3.5 font-semibold text-white transition-colors hover:border-white/50 hover:bg-white/10"
            >
              <BookOpen aria-hidden className="h-4 w-4" />
              Browse study guides
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}
