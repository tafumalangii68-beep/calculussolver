import Link from "next/link";
import { FaqSection } from "@/components/content/FaqSection";
import { Figure } from "@/components/content/Figure";
import { JsonLd } from "@/components/content/JsonLd";
import { LinkCards } from "@/components/content/LinkCards";
import { Tex } from "@/components/content/Tex";
import { WorkedExample } from "@/components/content/WorkedExample";
import { ReviewsSection } from "@/components/reviews/ReviewsSection";
import { StatsCard } from "@/components/reviews/StatsCard";
import { Solver } from "@/components/solver/Solver";
import { posts } from "@/data/blog";
import { homeExamples, homeFaqs, homeSolverExamples, syntaxGuide } from "@/data/home";
import { buildMetadata, webApplicationLd, websiteLd } from "@/lib/seo";
import { calculatorNav, guideNav } from "@/lib/site-config";

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

export default function HomePage() {
  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6">
      <JsonLd data={[websiteLd(), webApplicationLd("Calculus Solver", "/", description)]} />

      <section className="pt-8 sm:pt-12">
        <div className="max-w-3xl">
          <h1 className="font-serif text-4xl font-semibold leading-tight tracking-tight text-ink sm:text-[2.75rem]">
            Calculus Solver <span className="text-muted">with step-by-step solutions</span>
          </h1>
          <p className="mt-3 text-lg text-ink-soft">
            Enter a function, choose what to do with it, and see the answer worked out rule by rule. Derivatives, integrals,
            limits, Taylor series and critical points are all solved for free, in your browser.
          </p>
        </div>
        <div className="mt-6">
          <Solver
            title="Calculus Solver"
            operations={["derivative", "indefinite-integral", "definite-integral", "limit", "taylor", "critical-points", "partial-derivative", "implicit"]}
            examples={homeSolverExamples}
          />
        </div>
      </section>

      <div className="mt-20 grid grid-cols-1 gap-20">
        <StatsCard />

        <section aria-labelledby="what" className="prose-body">
          <h2 id="what">What this calculus solver does</h2>
          <p>
            This is a computer algebra tool built for learning calculus. It reads the function you type, applies the same
            rules you use on paper, and shows each one: the power rule, the chain rule, u-substitution, L&apos;Hôpital&apos;s
            rule and the rest. You get more than the final answer; you can see exactly where it came from.
          </p>
          <p>
            It is designed for high school, AP and college calculus students, for teachers preparing examples, and for anyone
            teaching themselves. All computation happens on your device, so it is fast, private and works without an account.
          </p>
          <Figure
            image={{
              src: "/images/hero-v2.webp",
              alt: "A curve with its tangent line at one point and the area under the curve shaded up to that point, the two central ideas of calculus",
              width: 1536,
              height: 1024,
            }}
          />
        </section>

        <section aria-labelledby="use" className="prose-body">
          <h2 id="use">How to use the solver</h2>
          <ol>
            <li>
              <strong>Choose an operation</strong>: derivative, indefinite or definite integral, limit, Taylor series, or critical
              points.
            </li>
            <li>
              <strong>Type your function</strong> using the syntax below, or tap <em>Show keypad</em> on a phone. Check the
              &ldquo;Reads as&rdquo; preview to confirm the solver understood you.
            </li>
            <li>
              <strong>Fill in any options</strong>: derivative order, integral bounds, the point a limit approaches, a Taylor
              center, or a search interval.
            </li>
            <li>
              <strong>Press Solve</strong>, then read the steps. Use <em>Copy answer</em> or <em>Copy LaTeX</em> to reuse the
              result, and <em>Reset</em> to start over.
            </li>
          </ol>
        </section>

        <section aria-labelledby="syntax">
          <h2 id="syntax" className="font-serif text-2xl font-semibold text-ink sm:text-3xl">
            How to type math expressions
          </h2>
          <p className="mt-3 max-w-[72ch] text-ink-soft">
            The solver accepts ordinary calculator syntax. Multiplication signs are optional (2x, x sin x and (x+1)(x−1) all
            work), and symbols such as π, √ and ² can be pasted directly.
          </p>
          <div className="mt-6 overflow-x-auto rounded-card border border-line bg-surface">
            <table className="w-full min-w-[34rem] text-sm">
              <caption className="sr-only">Expression syntax guide</caption>
              <thead>
                <tr className="border-b border-line text-left">
                  <th scope="col" className="px-4 py-3 font-semibold text-ink">Type this</th>
                  <th scope="col" className="px-4 py-3 font-semibold text-ink">Meaning</th>
                  <th scope="col" className="px-4 py-3 font-semibold text-ink">Shown as</th>
                </tr>
              </thead>
              <tbody>
                {syntaxGuide.map((row) => (
                  <tr key={row.input} className="border-b border-line last:border-0">
                    <td className="px-4 py-2.5 font-mono text-ink">{row.input}</td>
                    <td className="px-4 py-2.5 text-ink-soft">{row.meaning}</td>
                    <td className="px-4 py-2.5">
                      <Tex>{row.latex}</Tex>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section aria-labelledby="supported">
          <h2 id="supported" className="font-serif text-2xl font-semibold text-ink sm:text-3xl">
            Supported problem types
          </h2>
          <ul className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {SUPPORTED.map((s) => (
              <li key={s.op} className="rounded-card border border-line bg-surface p-5">
                <h3 className="font-semibold text-ink">{s.op}</h3>
                <Tex display className="mt-2 text-ink">
                  {s.example}
                </Tex>
                <p className="mt-2 text-sm text-muted">{s.detail}</p>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="method" className="prose-body">
          <h2 id="method">How the solver computes results and steps</h2>
          <p>
            Your input is parsed into an expression tree and simplified with exact fractions, never rounded decimals. Derivatives
            are computed by applying one rule per node of that tree, which is why every step names a rule. Integrals are attempted
            with standard forms, substitution, integration by parts and partial fractions. Only if those fail is a bundled computer
            algebra system tried as a fallback.
          </p>
          <p>
            Every answer is then checked independently. Antiderivatives are differentiated and compared with the integrand.
            Definite integrals are compared with high-accuracy numerical integration. Limits are confirmed by evaluating the
            function close to the point. If a check fails, the solver reports that it could not solve the problem rather than
            showing a doubtful answer.
          </p>
          <p>
            <Link href="/how-it-works">Read the full methodology</Link>, including the numerical methods and their accuracy.
          </p>
        </section>

        <section aria-labelledby="examples">
          <h2 id="examples" className="font-serif text-2xl font-semibold text-ink sm:text-3xl">
            Worked examples
          </h2>
          <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
            {homeExamples.map((e, i) => (
              <WorkedExample key={e.title} example={e} index={i} />
            ))}
          </div>
        </section>

        <section aria-labelledby="entry-mistakes">
          <h2 id="entry-mistakes" className="font-serif text-2xl font-semibold text-ink sm:text-3xl">
            Common mistakes when entering expressions
          </h2>
          <ul className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
            {ENTRY_MISTAKES.map((m) => (
              <li key={m.wrong} className="rounded-card border border-line bg-surface p-5">
                <p className="font-mono text-sm">
                  <span className="text-danger line-through decoration-1">{m.wrong}</span>
                  <span className="mx-2 text-muted" aria-hidden>
                    →
                  </span>
                  <span className="sr-only"> should be </span>
                  <span className="text-ok">{m.right}</span>
                </p>
                <p className="mt-2 text-sm text-ink-soft">{m.why}</p>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="limits" className="prose-body">
          <h2 id="limits">Limitations</h2>
          <p>No solver handles everything, and this one tells you when it reaches its limits. It does not currently support:</p>
          <ul>
            <li>Differential equations, multiple integrals or vector calculus. (Partial derivatives up to second order are supported.)</li>
            <li>Piecewise functions, floor and ceiling, factorials, or complex numbers.</li>
            <li>Convergence tests for infinite series, or word problems.</li>
            <li>
              Integrals without an elementary antiderivative, such as ∫e<sup>x²</sup> dx. The solver says so instead of guessing,
              and a definite integral still gets a numerical value.
            </li>
          </ul>
          <p>
            Answers may also be written in a different but equivalent form from your textbook. For example, an antiderivative can
            differ from the book&apos;s by a constant. Always check important results; see the <Link href="/disclaimer">disclaimer</Link>.
          </p>
        </section>

        <section aria-labelledby="explore">
          <h2 id="explore" className="font-serif text-2xl font-semibold text-ink sm:text-3xl">
            Dedicated calculators, guides and tutorials
          </h2>
          <p className="mt-3 max-w-[72ch] text-ink-soft">
            Each calculator focuses on one operation and comes with its own rules, worked examples and common mistakes.
          </p>
          <div className="mt-6">
            <LinkCards
              cards={[
                ...calculatorNav.map((c) => ({ href: `/${c.slug}`, title: c.label, description: c.blurb, titleClass: c.titleClass })),
                ...guideNav.map((g) => ({ href: g.href, title: g.label, description: "Study guide with worked examples", titleClass: g.titleClass })),
                ...posts.map((post) => ({ href: `/blog/${post.slug}`, title: post.title.split(" (")[0], description: "Beginner tutorial on the blog", titleClass: post.titleClass })),
              ]}
            />
          </div>
        </section>
      </div>

      <FaqSection faqs={homeFaqs} />

      {/* Student reviews: approved, real reviews only (see components/reviews). */}
      <div className="mt-20">
        <ReviewsSection limit={8} subtitle="See how students use Calculus Solver to make learning calculus easier." />
      </div>

      <section className="mt-16 rounded-card bg-ink px-6 py-8 text-paper sm:px-10">
        <h2 className="font-serif text-2xl font-semibold">Start with a problem you&apos;re stuck on</h2>
        <p className="mt-2 max-w-2xl text-paper/80">
          Solve it yourself as far as you can, then let the solver show the remaining steps. Comparing the two is where the
          learning happens. When you&apos;re ready to go deeper, the <Link href="/guides" className="underline underline-offset-2">study guides</Link> explain
          each technique from the ground up.
        </p>
        <a href="#main" className="mt-4 inline-block rounded-lg bg-paper px-5 py-2.5 font-semibold text-ink hover:bg-sunken">
          Back to the solver
        </a>
      </section>
    </div>
  );
}
