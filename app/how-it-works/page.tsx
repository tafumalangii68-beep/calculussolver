import Link from "next/link";
import { Figure } from "@/components/content/Figure";
import { ProsePage } from "@/components/content/ProsePage";
import { Tex } from "@/components/content/Tex";
import { buildMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site-config";

const description =
  "The methods behind Calculus Solver: parsing, exact simplification, rule-based differentiation and integration, limits, numerical integration and how every answer is verified.";

export const metadata = buildMetadata({ title: "How the Solver Works", description, path: "/how-it-works" });

const t = String.raw;

export default function HowItWorksPage() {
  return (
    <ProsePage
      title="How the Solver Works"
      path="/how-it-works"
      description={description}
      updated={siteConfig.contentUpdated}
      lead={<p>A transparent description of the methods behind every answer, and of what they cannot do.</p>}
    >
      <Figure
        image={{ src: "/images/how-it-works.webp", alt: "Diagram: an expression tree flows into a set of gears and ends at a checkmark, showing input being parsed, solved and verified", width: 1600, height: 533 }}
      />

      <h2>1. Reading your input</h2>
      <p>
        Your text is split into numbers, names and symbols, then parsed into an expression tree using the usual order of
        operations. Powers come first and associate to the right, then multiplication and division from left to right, then
        addition and subtraction. Implicit multiplication (2x, x sin x) has the same precedence as an explicit *.
      </p>
      <p>
        Function names are recognised inside runs of letters, so sinx becomes sin(x) and xe becomes x·e. Errors are reported
        with the likely cause, such as a missing bracket, two operators in a row or an unknown function. The &ldquo;Reads
        as&rdquo; preview shows the tree typeset, so you can spot a misreading before solving.
      </p>

      <h2>2. Exact arithmetic and simplification</h2>
      <p>
        Numbers are stored as exact fractions, so 0.1 + 0.2 is exactly 3/10. The simplifier flattens sums and products,
        combines like terms and like powers, and evaluates exact values such as
      </p>
      <Tex display>{t`\sin\frac{\pi}{6} = \frac{1}{2},\quad \sqrt{12} = 2\sqrt{3},\quad \ln e^{3} = 3,\quad e^{2\ln x} = x^{2}.`}</Tex>
      <p>
        Where both a factored and an expanded form are available, the shorter one is shown.
      </p>

      <h2>3. Derivatives</h2>
      <p>
        The differentiator walks the expression tree from the outside in and applies one rule per node: sum, constant
        multiple, product, quotient, power, exponential, chain rule, or a table derivative for each function. Each application
        is recorded as a step together with its intermediate result. When both base and exponent vary, it uses logarithmic
        differentiation:
      </p>
      <Tex display>{t`\frac{d}{dx}u^{w} = u^{w}\left(w'\ln u + \frac{w\,u'}{u}\right)`}</Tex>
      <p>
        <strong>Check:</strong> the result is compared with a central finite-difference estimate of the previous derivative at
        several sample points.
      </p>

      <h2>4. Integrals</h2>
      <p>Indefinite integrals are attempted with these strategies, in this order:</p>
      <ol>
        <li>constant, sum and constant-multiple rules;</li>
        <li>a table of standard forms, including linear inner functions such as e^(3x+1) and sin(2x − 5);</li>
        <li>rewriting: expanding products and splitting fractions over a monomial;</li>
        <li>rational functions: polynomial long division, partial fractions for distinct or repeated linear factors, and
          completing the square for irreducible quadratics;</li>
        <li>u-substitution, trying each plausible inner function;</li>
        <li>integration by parts, choosing u by the LIATE ordering.</li>
      </ol>
      <p>
        If every rule fails, the problem is passed to <a href="https://algebrite.org/" rel="noopener">Algebrite</a>, an
        open-source computer algebra system bundled with the site that runs in your browser. Its answers are labelled and come
        without detailed steps. Integrands known to have no elementary antiderivative, such as e^(x²) and sin(x)/x, are
        reported as such.
      </p>
      <p>
        <strong>Check:</strong> every antiderivative, whatever its source, is differentiated and compared numerically with the
        integrand at up to 18 sample points. Any disagreement means the answer is discarded.
      </p>

      <h2>5. Definite and improper integrals</h2>
      <p>
        With an antiderivative F, the solver applies the Fundamental Theorem of Calculus. At an infinite bound, or where F is
        undefined at an endpoint, it uses the corresponding limit instead. Before that, it scans the interval for points where
        the integrand blows up. If it finds one, the theorem cannot be applied directly, and the integral is treated as
        improper.
      </p>
      <p>
        Independently, the integral is computed with <strong>tanh-sinh (double exponential) quadrature</strong> (Takahasi
        and Mori, 1974). This method handles endpoint singularities such as 1/√x well, and maps infinite intervals onto finite
        ones. The exact and numerical values must agree. When there is no antiderivative, the numerical value is reported,
        marked ≈.
      </p>

      <h2>6. Limits</h2>
      <p>
        The function is first evaluated numerically at points approaching the target from the requested side or sides, to
        detect convergence, divergence to ±∞, or disagreement between left and right. Then the exact methods are tried:
        direct substitution (checked for continuity), cancelling a common polynomial factor found by a polynomial GCD,
        L&apos;Hôpital&apos;s rule for 0/0 and ∞/∞ forms (repeated up to six times), degree comparison at infinity, rewriting
        0·∞ as a quotient, and rewriting 1^∞-type forms through logarithms.
      </p>
      <p>
        <strong>Check:</strong> an exact answer is shown only if it agrees with the numerical behaviour. Otherwise the
        numerical estimate is shown and labelled. Matches to simple constants such as π/2 are offered as suggestions, not
        proofs.
      </p>

      <h2>7. Taylor polynomials</h2>
      <Tex display>{t`T_{n}(x) = \sum_{k=0}^{n} \frac{f^{(k)}(a)}{k!}(x-a)^{k}`}</Tex>
      <p>
        Derivatives are computed symbolically and evaluated at the center by exact substitution. If any of them is undefined
        there, the solver says that no Taylor polynomial exists at that center.
      </p>

      <h2>8. Critical points</h2>
      <p>
        f′ is split into a numerator and a denominator. Polynomial factors are solved exactly (rational root theorem, then the
        quadratic formula). Zeros of the denominator are kept if f is defined there. A dense numerical scan of your search
        interval, refined by bisection, finds any remaining roots. Points are classified with the second derivative test, or,
        when f″ is zero or undefined, with the first derivative test.
      </p>

      <h2>9. Partial derivatives</h2>
      <p>
        Partial derivatives use the same differentiator, with ∂ notation, and treat every letter other than the chosen variable
        as a constant. For second partials such as f<sub>xy</sub>, the result of the first stage is differentiated again with
        respect to the second variable. <strong>Check:</strong> the other variables are fixed at test values and each stage is
        compared with a finite-difference estimate.
      </p>

      <h2>10. Implicit differentiation</h2>
      <p>The equation is rewritten as F(x, y) = 0, and dy/dx comes from the implicit function theorem:</p>
      <Tex display>{t`\frac{dy}{dx} = -\frac{F_{x}}{F_{y}}`}</Tex>
      <p>
        Both partial derivatives are shown step by step, and common numerical factors are cancelled. A point you supply is
        checked against the equation before the slope and tangent line are computed. <strong>Check:</strong> points on the
        curve are found numerically, the curve is followed a tiny step either side of each one with Newton&apos;s method, and
        the measured slope must match the formula.
      </p>

      <h2>Accuracy and limitations</h2>
      <ul>
        <li>Exact answers are exact. Numerical values are typically accurate to about 10 significant digits.</li>
        <li>Computer algebra can produce answers that are equivalent to, but look different from, a textbook&apos;s.</li>
        <li>The solver does not support differential equations, multiple integrals, vector calculus, piecewise functions or
          complex numbers. For several variables it computes partial derivatives up to second order.</li>
        <li>Problems that take more than about 12 seconds are stopped, so the page stays responsive.</li>
      </ul>
      <p>
        More than a hundred automated tests, run before each release, check the solver against problems with known answers,
        including every worked example on this site.
      </p>

      <h2>References</h2>
      <ul>
        <li>J. Stewart, <em>Calculus: Early Transcendentals</em>, Cengage. Standard reference for the rules and techniques used.</li>
        <li>
          G. Strang and E. Herman, <em>Calculus</em>, Volumes 1–2, OpenStax (free and openly licensed),{" "}
          <a href="https://openstax.org/details/books/calculus-volume-1" rel="noopener">openstax.org</a>.
        </li>
        <li>H. Takahasi and M. Mori, &ldquo;Double exponential formulas for numerical integration,&rdquo; <em>Publications of the
          RIMS, Kyoto University</em> 9 (1974), 721–741.</li>
        <li>KaTeX, used to typeset math: <a href="https://katex.org/" rel="noopener">katex.org</a>.</li>
      </ul>
      <p>
        Have a question about a specific result? See the <Link href="/faq">FAQ</Link> or <Link href="/contact">contact us</Link>.
      </p>
    </ProsePage>
  );
}
