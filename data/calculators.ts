// Content for the dedicated calculator pages. Each page targets its own search
// intent; worked examples are machine-checked by tests/content.test.ts.

import type { CalculatorSlug } from "@/lib/site-config";
import type { Faq, Illustration, SolverExample, WorkedExample } from "@/types/content";
import type { Operation } from "@/types/solver";

const t = String.raw;

export interface Rule {
  name: string;
  latex: string;
  text: string;
}

export interface CalculatorPage {
  slug: CalculatorSlug;
  metaTitle: string;
  metaDescription: string;
  h1: string;
  intro: string;
  /** Optional illustration shown with the definition section. */
  image?: Illustration;
  operations: Operation[];
  solverExamples: SolverExample[];
  definition: { heading: string; paragraphs: string[]; formula?: string };
  rules: { heading: string; intro: string; items: Rule[] };
  howItWorks: string[];
  examples: WorkedExample[];
  mistakes: { title: string; text: string }[];
  limitations: string[];
  faqs: Faq[];
  related: CalculatorSlug[];
  guide?: { href: string; label: string };
}

export const calculators: Record<CalculatorSlug, CalculatorPage> = {
  "derivative-calculator": {
    slug: "derivative-calculator",
    image: { src: "/images/derivative.webp", alt: "A curve with tangent lines at three points: rising, flat at the peak, and falling", width: 1600, height: 800 },
    metaTitle: "Derivative Calculator with Steps (1st to 10th Order)",
    metaDescription:
      "Free derivative calculator that shows every step: power, product, quotient and chain rules, plus second and higher-order derivatives. Runs in your browser.",
    h1: "Derivative Calculator",
    intro:
      "Type a function to see its derivative and the rule used at every stage, from the first derivative up to the tenth. Use it to check homework, study for a test, or see where a long product or chain rule went wrong.",
    operations: ["derivative"],
    solverExamples: [
      { label: "x^2 sin(x)", operation: "derivative", expression: "x^2 sin(x)" },
      { label: "(x^2+1)/(x-1)", operation: "derivative", expression: "(x^2+1)/(x-1)" },
      { label: "e^(3x) cos(x)", operation: "derivative", expression: "e^(3x) cos(x)" },
      { label: "ln(x^2+1)", operation: "derivative", expression: "ln(x^2+1)" },
      { label: "x^x", operation: "derivative", expression: "x^x" },
      { label: "2nd: x^3 ln(x)", operation: "derivative", expression: "x^3 ln(x)", order: 2 },
    ],
    definition: {
      heading: "What is a derivative?",
      paragraphs: [
        "The derivative of a function measures its instantaneous rate of change. Geometrically, f′(a) is the slope of the tangent line to the graph of y = f(x) at x = a. In physics, the derivative of position is velocity; in economics, the derivative of cost is marginal cost.",
        "Formally, the derivative is defined as a limit of difference quotients. In practice nobody evaluates that limit each time: a small set of rules, applied in the right order, differentiates every function built from powers, exponentials, logarithms and trigonometric functions.",
      ],
      formula: t`f'(x) = \lim_{h \to 0} \frac{f(x+h) - f(x)}{h}`,
    },
    rules: {
      heading: "Differentiation rules the calculator uses",
      intro: "Every step in a solution names one of these rules. Learning to spot which one applies is most of the work.",
      items: [
        { name: "Power rule", latex: t`\frac{d}{dx}\,x^{n} = n\,x^{n-1}`, text: "Works for any real exponent, including roots such as √x = x^(1/2) and reciprocals such as 1/x² = x^(−2)." },
        { name: "Constant multiple and sum rules", latex: t`\frac{d}{dx}\big[c\,f + g\big] = c\,f' + g'`, text: "Differentiate term by term and keep constant factors in front." },
        { name: "Product rule", latex: t`(fg)' = f'g + fg'`, text: "Used when two non-constant factors are multiplied." },
        { name: "Quotient rule", latex: t`\left(\frac{f}{g}\right)' = \frac{f'g - fg'}{g^{2}}`, text: "The order in the numerator matters: derivative of the top first." },
        { name: "Chain rule", latex: t`\frac{d}{dx}\,f\big(g(x)\big) = f'\big(g(x)\big)\cdot g'(x)`, text: "Differentiate the outer function, keep the inside, then multiply by the derivative of the inside." },
        { name: "Exponentials and logarithms", latex: t`(e^{x})' = e^{x},\quad (a^{x})' = a^{x}\ln a,\quad (\ln x)' = \frac{1}{x}`, text: "For u(x)^v(x), where both base and exponent vary, the calculator uses logarithmic differentiation." },
        { name: "Trigonometric functions", latex: t`(\sin x)' = \cos x,\quad (\cos x)' = -\sin x,\quad (\tan x)' = \sec^{2} x`, text: "Inverse trig functions are covered too, e.g. (arctan x)′ = 1/(1 + x²)." },
      ],
    },
    howItWorks: [
      "Your input is parsed into an expression tree, which the live preview shows so you can confirm it was read the way you meant. The calculator then walks the tree from the outside in. At each node it applies exactly one rule (sum, product, quotient, power, chain, or a table derivative) and records that step with the intermediate result.",
      "Each intermediate result is simplified exactly, using fractions rather than decimals: like terms are combined, powers of the same base merged, and values such as sin(π/6) = 1/2 evaluated. When expanding a product gives a shorter answer, the expanded form is shown; otherwise the factored form is kept.",
      "For higher-order derivatives the process repeats on the simplified previous result, and every order gets its own list of steps. Finally the answer is compared against a numerical finite-difference estimate at several sample points as an independent check.",
    ],
    examples: [
      {
        title: "Polynomial: power, constant multiple and sum rules",
        problem: t`\frac{d}{dx}\left(3x^{4} - 5x^{2} + 7x - 2\right)`,
        steps: [
          { text: "Differentiate term by term (sum rule), keeping each constant coefficient in front.", math: t`3\cdot 4x^{3} - 5\cdot 2x + 7\cdot 1 - 0` },
          { text: "Multiply out the coefficients." },
        ],
        answer: t`12x^{3} - 10x + 7`,
        check: { operation: "derivative", expression: "3x^4 - 5x^2 + 7x - 2", expected: "12x^3 - 10x + 7" },
      },
      {
        title: "Product rule",
        problem: t`\frac{d}{dx}\left(x^{2}e^{x}\right)`,
        steps: [
          { text: "Let f = x² and g = eˣ, so f′ = 2x and g′ = eˣ.", math: t`(fg)' = f'g + fg' = 2x\,e^{x} + x^{2}e^{x}` },
          { text: "Factor out eˣ (optional)." },
        ],
        answer: t`e^{x}\left(x^{2} + 2x\right)`,
        check: { operation: "derivative", expression: "x^2 e^x", expected: "e^x (x^2 + 2x)" },
      },
      {
        title: "Quotient rule",
        problem: t`\frac{d}{dx}\,\frac{x^{2} + 1}{x - 1}`,
        steps: [
          { text: "With f = x² + 1 and g = x − 1, we have f′ = 2x and g′ = 1.", math: t`\frac{2x(x - 1) - (x^{2} + 1)\cdot 1}{(x - 1)^{2}}` },
          { text: "Expand the numerator: 2x² − 2x − x² − 1 = x² − 2x − 1." },
        ],
        answer: t`\frac{x^{2} - 2x - 1}{(x - 1)^{2}}`,
        check: { operation: "derivative", expression: "(x^2+1)/(x-1)", expected: "(x^2 - 2x - 1)/(x-1)^2" },
      },
      {
        title: "Chain rule",
        problem: t`\frac{d}{dx}\,\sin\left(3x^{2} + 1\right)`,
        steps: [
          { text: "The outer function is sin(u) with inner function u = 3x² + 1, so u′ = 6x.", math: t`\cos\left(3x^{2} + 1\right)\cdot 6x` },
        ],
        answer: t`6x\cos\left(3x^{2} + 1\right)`,
        check: { operation: "derivative", expression: "sin(3x^2 + 1)", expected: "6x cos(3x^2+1)" },
      },
      {
        title: "Second derivative",
        problem: t`\frac{d^{2}}{dx^{2}}\left(x^{3}\ln x\right)`,
        steps: [
          { text: "First derivative (product rule):", math: t`3x^{2}\ln x + x^{3}\cdot\frac{1}{x} = 3x^{2}\ln x + x^{2}` },
          { text: "Differentiate again (product rule on the first term, power rule on the second):", math: t`6x\ln x + 3x^{2}\cdot\frac{1}{x} + 2x = 6x\ln x + 5x` },
        ],
        answer: t`6x\ln x + 5x`,
        check: { operation: "derivative", expression: "x^3 ln(x)", expected: "6x ln(x) + 5x", order: 2 },
      },
    ],
    mistakes: [
      { title: "Forgetting the inner derivative", text: "d/dx sin(3x) is 3cos(3x), not cos(3x). Whenever the argument is anything other than plain x, the chain rule adds a factor." },
      { title: "Multiplying derivatives in a product", text: "(fg)′ is not f′·g′. For x²·sin x that shortcut gives 2x·cos x, which is wrong; the product rule gives 2x sin x + x² cos x." },
      { title: "Swapping the quotient rule numerator", text: "f′g − fg′ and fg′ − f′g differ by a sign. Remember “low d-high minus high d-low”." },
      { title: "Ambiguous input", text: "1/2x is read as (1/2)·x, and sin x^2 as sin(x²). Use parentheses, such as 1/(2x) or (sin x)^2, and check the preview before solving." },
      { title: "log versus ln", text: "Like most computer algebra systems, the calculator reads log(x) as the natural log ln(x). For base 10, type log10(x) or log(x, 10)." },
    ],
    limitations: [
      "Implicit differentiation (for example dy/dx from x² + y² = 25) is not supported; enter an explicit function instead.",
      "Other letters are treated as constants, which gives a partial derivative with respect to the chosen variable. Mixed or multivariable derivatives are not available.",
      "Piecewise, floor, ceiling and factorial functions are not supported.",
      "The derivative of |x| is shown as x/|x|, which is undefined at x = 0. That is correct, but it is easy to overlook.",
      "Answers can be written differently from your textbook (factored versus expanded, sec²x versus 1 + tan²x) and still be equal.",
    ],
    faqs: [
      { q: "How do I find a second or third derivative?", a: "Choose the order from the Order menu (up to the 10th derivative). The solution shows the steps for each order separately, so you can follow how the first derivative feeds into the second." },
      { q: "Can the derivative calculator do partial derivatives?", a: "Yes, in a limited way. Pick the variable you are differentiating with respect to; every other letter is treated as a constant. For example, with variable x, d/dx (a x² y) = 2axy. It does not compute mixed partials in one step." },
      { q: "Why doesn't my answer match the textbook exactly?", a: "Derivatives can be written in many equivalent ways. The calculator chooses a compact form, which may be expanded where your book factors (or the reverse). Check equivalence by expanding both, or by plugging in a value of x." },
      { q: "Does it support implicit differentiation?", a: "No. The calculator differentiates explicit functions y = f(x). For implicit differentiation, differentiate both sides by hand, using the calculator to check individual pieces." },
      { q: "How does the calculator know which rule to apply?", a: "It looks at the outermost operation of the expression. A sum gets the sum rule, a product the product rule, a quotient the quotient rule, and a function of something other than plain x gets the chain rule. It then works inward." },
    ],
    related: ["critical-points-calculator", "taylor-series-calculator", "integral-calculator"],
    guide: { href: "/guides/derivative-rules", label: "Derivative rules explained with examples" },
  },

  "integral-calculator": {
    slug: "integral-calculator",
    image: { src: "/images/integral.webp", alt: "Thin rectangles filling the area under a curve, approximating its integral", width: 1600, height: 800 },
    metaTitle: "Integral Calculator with Steps – Definite and Indefinite",
    metaDescription:
      "Solve indefinite and definite integrals step by step: u-substitution, integration by parts, partial fractions and improper integrals, with every antiderivative verified.",
    h1: "Integral Calculator",
    intro:
      "Find antiderivatives and evaluate definite integrals, including improper ones with infinite bounds. Each solution names the technique used, and every antiderivative is checked by differentiating it before you see it.",
    operations: ["indefinite-integral", "definite-integral"],
    solverExamples: [
      { label: "x e^x", operation: "indefinite-integral", expression: "x e^x" },
      { label: "x e^(x^2)", operation: "indefinite-integral", expression: "x e^(x^2)" },
      { label: "1/(x^2-4)", operation: "indefinite-integral", expression: "1/(x^2-4)" },
      { label: "sin(x)^2", operation: "indefinite-integral", expression: "sin(x)^2" },
      { label: "∫₀^π sin(x)", operation: "definite-integral", expression: "sin(x)", lower: "0", upper: "pi" },
      { label: "∫₁^∞ 1/x^2", operation: "definite-integral", expression: "1/x^2", lower: "1", upper: "inf" },
    ],
    definition: {
      heading: "Indefinite and definite integrals",
      paragraphs: [
        "An indefinite integral ∫f(x) dx is the family of all antiderivatives of f: functions F with F′ = f. Because any constant disappears when you differentiate, the answer always includes an arbitrary constant + C.",
        "A definite integral ∫ₐᵇ f(x) dx is a number: the signed area between the graph of f and the x-axis from a to b. The Fundamental Theorem of Calculus links the two ideas. Any antiderivative F turns a definite integral into a subtraction.",
      ],
      formula: t`\int_{a}^{b} f(x)\,dx = F(b) - F(a), \qquad F'(x) = f(x)`,
    },
    rules: {
      heading: "Integration rules and techniques",
      intro: "Unlike differentiation, integration has no rule that always works. The calculator tries these techniques in order, from the simplest to the most involved.",
      items: [
        { name: "Power rule", latex: t`\int x^{n}\,dx = \frac{x^{n+1}}{n+1} + C,\quad n \neq -1`, text: "The workhorse for polynomials and roots." },
        { name: "Reciprocal rule", latex: t`\int \frac{1}{x}\,dx = \ln|x| + C`, text: "The absolute value keeps the answer valid for negative x as well." },
        { name: "Exponential and trig forms", latex: t`\int e^{x}dx = e^{x} + C,\quad \int \sin x\,dx = -\cos x + C,\quad \int \cos x\,dx = \sin x + C`, text: "Linear inner functions such as e^(3x+1) are handled by dividing by the slope." },
        { name: "u-substitution", latex: t`\int f\big(g(x)\big)\,g'(x)\,dx = \int f(u)\,du,\quad u = g(x)`, text: "The reverse of the chain rule: look for a function and its derivative appearing together." },
        { name: "Integration by parts", latex: t`\int u\,dv = uv - \int v\,du`, text: "The reverse of the product rule. Choose u by LIATE: Logs, Inverse trig, Algebraic, Trig, Exponential." },
        { name: "Partial fractions", latex: t`\frac{1}{x^{2} - 4} = \frac{1/4}{x - 2} - \frac{1/4}{x + 2}`, text: "Rational functions are split into simple fractions after any polynomial long division." },
      ],
    },
    howItWorks: [
      "The calculator first applies the constant, sum and constant-multiple rules, then checks a table of standard forms. If neither finishes the job, it tries rewriting (expanding products, splitting fractions), polynomial long division and partial fractions for rational functions, then u-substitution with every plausible inner function, then integration by parts. Each successful technique is recorded as a step.",
      "If none of these rules works, a bundled computer algebra system (Algebrite, running in your browser) is tried as a fallback. Answers from the fallback are labelled as such and come without full steps.",
      "Whatever the source, the answer is differentiated and compared with your integrand at a range of sample points. If they disagree, the answer is not shown; you see an honest “could not find an antiderivative” message instead.",
      "For definite integrals, the calculator evaluates F(b) − F(a), using limits for infinite bounds or where F is undefined at an endpoint. It cross-checks the result with tanh-sinh numerical integration. When there is no elementary antiderivative, such as ∫e^(−x²) dx, you get an accurate numerical value instead.",
    ],
    examples: [
      {
        title: "Polynomial (power rule)",
        problem: t`\int \left(6x^{2} - 4x + 3\right)dx`,
        steps: [{ text: "Integrate term by term with the power rule.", math: t`6\cdot\frac{x^{3}}{3} - 4\cdot\frac{x^{2}}{2} + 3x + C` }],
        answer: t`2x^{3} - 2x^{2} + 3x + C`,
        check: { operation: "indefinite-integral", expression: "6x^2 - 4x + 3", expected: "2x^3 - 2x^2 + 3x" },
      },
      {
        title: "u-substitution",
        problem: t`\int 2x\cos\left(x^{2}\right)dx`,
        steps: [
          { text: "Let u = x², so du = 2x dx. The integrand is exactly cos(u) du.", math: t`\int \cos u\,du = \sin u + C` },
          { text: "Substitute back u = x²." },
        ],
        answer: t`\sin\left(x^{2}\right) + C`,
        check: { operation: "indefinite-integral", expression: "2x cos(x^2)", expected: "sin(x^2)" },
      },
      {
        title: "Integration by parts",
        problem: t`\int x\cos x\,dx`,
        steps: [
          { text: "Choose u = x (algebraic) and dv = cos x dx, so du = dx and v = sin x.", math: t`x\sin x - \int \sin x\,dx` },
          { text: "The remaining integral is −cos x, and subtracting it adds cos x." },
        ],
        answer: t`x\sin x + \cos x + C`,
        check: { operation: "indefinite-integral", expression: "x cos(x)", expected: "x sin(x) + cos(x)" },
      },
      {
        title: "Partial fractions",
        problem: t`\int \frac{1}{x^{2} - 4}\,dx`,
        steps: [
          { text: "Factor x² − 4 = (x − 2)(x + 2) and split the fraction. The cover-up method gives A = 1/4 and B = −1/4.", math: t`\frac{1}{x^{2}-4} = \frac{1}{4}\cdot\frac{1}{x - 2} - \frac{1}{4}\cdot\frac{1}{x + 2}` },
          { text: "Each piece integrates to a logarithm." },
        ],
        answer: t`\frac{1}{4}\ln|x - 2| - \frac{1}{4}\ln|x + 2| + C`,
        check: { operation: "indefinite-integral", expression: "1/(x^2-4)", expected: "ln(abs(x-2))/4 - ln(abs(x+2))/4" },
      },
      {
        title: "Definite integral",
        problem: t`\int_{0}^{2}\left(x^{3} + 1\right)dx`,
        steps: [
          { text: "An antiderivative is F(x) = x⁴/4 + x.", math: t`\left[\frac{x^{4}}{4} + x\right]_{0}^{2} = \left(4 + 2\right) - \left(0 + 0\right)` },
        ],
        answer: t`6`,
        check: { operation: "definite-integral", expression: "x^3 + 1", lower: "0", upper: "2", expected: "6" },
      },
      {
        title: "Improper integral",
        problem: t`\int_{1}^{\infty}\frac{1}{x^{2}}\,dx`,
        steps: [
          { text: "Replace the infinite bound with a limit.", math: t`\lim_{b\to\infty}\left[-\frac{1}{x}\right]_{1}^{b} = \lim_{b\to\infty}\left(1 - \frac{1}{b}\right)` },
          { text: "As b grows, 1/b → 0, so the area is finite." },
        ],
        answer: t`1`,
        check: { operation: "definite-integral", expression: "1/x^2", lower: "1", upper: "inf", expected: "1" },
      },
    ],
    mistakes: [
      { title: "Dropping + C", text: "An indefinite integral is a family of functions. Leaving out the constant loses information and often costs marks." },
      { title: "Forgetting du", text: "In u-substitution the dx must become du as well. ∫cos(x²) dx cannot be done with u = x² because there is no 2x factor to absorb." },
      { title: "Missing absolute values", text: "∫1/x dx = ln|x| + C. Writing ln x silently restricts the answer to x > 0." },
      { title: "Integrating across an asymptote", text: "∫ from −1 to 1 of 1/x² dx is not −2. The integrand blows up at x = 0, so the integral diverges. The calculator checks for this and says so." },
      { title: "Sign errors in integration by parts", text: "∫u dv = uv − ∫v du. The minus sign applies to the whole remaining integral, which matters when you integrate by parts twice." },
    ],
    limitations: [
      "Some integrals, such as ∫e^(x²) dx and ∫sin(x)/x dx, have no antiderivative made of elementary functions. The calculator says so instead of inventing one. Definite versions still get a numerical value.",
      "Double and triple integrals, line integrals and integrals with symbolic bounds are not supported.",
      "Trig substitution and some advanced partial-fraction cases are handled by the computer algebra fallback without detailed steps.",
      "Antiderivatives can differ from your textbook's by a constant, or be written in an equivalent form, and still be correct.",
      "Numerical values are typically accurate to about 10 significant digits. Highly oscillatory improper integrals may not converge numerically.",
    ],
    faqs: [
      { q: "How do I enter a definite integral?", a: "Select “Definite integral”, type the integrand, then enter the lower and upper bounds. Bounds can be numbers, expressions like pi/2, or inf and -inf for improper integrals." },
      { q: "Why is my answer different from the back of the book?", a: "Two antiderivatives of the same function can differ by a constant. For example, sin²(x)/2 and −cos²(x)/4 + C are both valid for ∫sin x cos x dx. Differentiate both answers: if you get the integrand each time, both are right." },
      { q: "What does “no elementary antiderivative” mean?", a: "Some functions have antiderivatives that cannot be written using powers, roots, exponentials, logs and trig functions. e^(x²) is the classic example. Its antiderivative is expressed with the special error function. Definite integrals of such functions can still be computed numerically." },
      { q: "How is each answer checked?", a: "The calculator differentiates its own answer and compares it numerically with your integrand at many sample points. Definite integrals are also compared with an independent numerical integration." },
      { q: "Can it solve improper integrals?", a: "Yes. Use inf or -inf as a bound. The calculator also detects vertical asymptotes inside the interval and reports when an integral diverges." },
    ],
    related: ["derivative-calculator", "limit-calculator", "taylor-series-calculator"],
    guide: { href: "/guides/integration-techniques", label: "Integration techniques: when to use each one" },
  },

  "limit-calculator": {
    slug: "limit-calculator",
    metaTitle: "Limit Calculator with Steps – One-Sided and at Infinity",
    metaDescription:
      "Evaluate limits step by step with direct substitution, factoring, L'Hôpital's rule and degree comparison. Supports one-sided limits and limits at infinity.",
    h1: "Limit Calculator",
    intro:
      "Evaluate two-sided, one-sided and infinite limits. The calculator shows whether the limit was found by substitution, algebra or L'Hôpital's rule, and it checks every answer numerically from the side you asked about.",
    operations: ["limit"],
    solverExamples: [
      { label: "sin(x)/x, x→0", operation: "limit", expression: "sin(x)/x", point: "0" },
      { label: "(x^2-9)/(x-3), x→3", operation: "limit", expression: "(x^2-9)/(x-3)", point: "3" },
      { label: "(1+1/x)^x, x→∞", operation: "limit", expression: "(1+1/x)^x", point: "inf" },
      { label: "x ln(x), x→0⁺", operation: "limit", expression: "x ln(x)", point: "0", side: "right" },
      { label: "1/x, x→0", operation: "limit", expression: "1/x", point: "0" },
    ],
    definition: {
      heading: "What is a limit?",
      paragraphs: [
        "The limit of f(x) as x approaches a is the value f(x) gets arbitrarily close to when x gets close to a, without x ever having to equal a. That is why limits can exist at points where the function itself is undefined, such as (x² − 9)/(x − 3) at x = 3.",
        "A one-sided limit only lets x approach from one direction: from the left (x → a⁻) or from the right (x → a⁺). The two-sided limit exists only when both one-sided limits exist and are equal. Limits at infinity describe the long-run behaviour of a function, such as horizontal asymptotes.",
      ],
      formula: t`\lim_{x \to a} f(x) = L \iff \lim_{x \to a^{-}} f(x) = \lim_{x \to a^{+}} f(x) = L`,
    },
    rules: {
      heading: "Techniques for evaluating limits",
      intro: "The calculator applies these in order and stops at the first that settles the limit.",
      items: [
        { name: "Direct substitution", latex: t`\lim_{x\to a} f(x) = f(a)\ \text{ if } f \text{ is continuous at } a`, text: "Always try this first. Polynomials, exponentials and trig functions are continuous wherever they are defined." },
        { name: "Factor and cancel", latex: t`\lim_{x\to 3}\frac{x^{2}-9}{x-3} = \lim_{x\to 3}(x+3) = 6`, text: "For a 0/0 rational function, cancel the common factor that causes the zero." },
        { name: "L'Hôpital's rule", latex: t`\lim_{x\to a}\frac{f(x)}{g(x)} = \lim_{x\to a}\frac{f'(x)}{g'(x)}\quad\text{for } \tfrac{0}{0} \text{ or } \tfrac{\infty}{\infty}`, text: "Differentiate the top and bottom separately. Not the quotient rule." },
        { name: "Degree comparison at infinity", latex: t`\lim_{x\to\infty}\frac{a_n x^{n} + \cdots}{b_m x^{m} + \cdots} = \begin{cases} 0 & n < m \\ a_n/b_m & n = m \\ \pm\infty & n > m \end{cases}`, text: "Only the leading terms matter for rational functions." },
        { name: "Other indeterminate forms", latex: t`0\cdot\infty \to \frac{0}{0},\qquad 1^{\infty},\ 0^{0},\ \infty^{0} \to e^{\lim (g \ln f)}`, text: "Products are rewritten as quotients, and exponential forms are handled with logarithms." },
      ],
    },
    howItWorks: [
      "The calculator first probes the function numerically from the requested side or sides, evaluating it closer and closer to the point. If the left and right behaviour disagree, it reports that the two-sided limit does not exist and shows both one-sided values.",
      "It then tries to evaluate the limit exactly: direct substitution, factor-and-cancel using a polynomial greatest common divisor, L'Hôpital's rule (repeated if needed), degree comparison for rational functions at infinity, and logarithmic rewriting for forms like 1^∞. Every exact answer must agree with the numerical probe before it is shown.",
      "If no symbolic method completes, the numerical estimate is shown and clearly labelled. When the estimate matches a simple value such as π/2 or 1/2, that value is suggested as a strong estimate, not presented as a proof.",
    ],
    examples: [
      {
        title: "Direct substitution",
        problem: t`\lim_{x\to 2}\left(x^{2} + 3x\right)`,
        steps: [{ text: "Polynomials are continuous everywhere, so substitute x = 2.", math: t`2^{2} + 3\cdot 2 = 4 + 6` }],
        answer: t`10`,
        check: { operation: "limit", expression: "x^2 + 3x", point: "2", expected: "10" },
      },
      {
        title: "Factor and cancel (0/0)",
        problem: t`\lim_{x\to 3}\frac{x^{2} - 9}{x - 3}`,
        steps: [
          { text: "Substitution gives 0/0, an indeterminate form. Factor the numerator.", math: t`\frac{(x-3)(x+3)}{x-3} = x + 3 \quad (x \neq 3)` },
          { text: "Now substitute x = 3." },
        ],
        answer: t`6`,
        check: { operation: "limit", expression: "(x^2-9)/(x-3)", point: "3", expected: "6" },
      },
      {
        title: "L'Hôpital's rule twice",
        problem: t`\lim_{x\to 0}\frac{e^{x} - 1 - x}{x^{2}}`,
        steps: [
          { text: "At x = 0 this is 0/0. Differentiate numerator and denominator:", math: t`\lim_{x\to 0}\frac{e^{x} - 1}{2x}` },
          { text: "Still 0/0, so apply the rule again:", math: t`\lim_{x\to 0}\frac{e^{x}}{2} = \frac{1}{2}` },
        ],
        answer: t`\frac{1}{2}`,
        check: { operation: "limit", expression: "(e^x - 1 - x)/x^2", point: "0", expected: "1/2" },
      },
      {
        title: "Limit at infinity",
        problem: t`\lim_{x\to\infty}\frac{4x^{3} - x}{2x^{3} + 5}`,
        steps: [
          { text: "Divide every term by x³, the highest power in the denominator.", math: t`\lim_{x\to\infty}\frac{4 - 1/x^{2}}{2 + 5/x^{3}} = \frac{4}{2}` },
        ],
        answer: t`2`,
        check: { operation: "limit", expression: "(4x^3 - x)/(2x^3 + 5)", point: "inf", expected: "2" },
      },
      {
        title: "One-sided limits that disagree",
        problem: t`\lim_{x\to 0}\frac{|x|}{x}`,
        steps: [
          { text: "For x > 0, |x|/x = 1. For x < 0, |x|/x = −1.", math: t`\lim_{x\to 0^{+}}\frac{|x|}{x} = 1,\qquad \lim_{x\to 0^{-}}\frac{|x|}{x} = -1` },
          { text: "The one-sided limits differ, so the two-sided limit does not exist." },
        ],
        answer: t`\text{does not exist}`,
        check: { operation: "limit", expression: "abs(x)/x", point: "0", expected: "dne" },
      },
    ],
    mistakes: [
      { title: "Reading 0/0 as 0 or as “undefined”", text: "0/0 is indeterminate: it tells you that more work is needed, not what the answer is. The limit can be any number, infinite, or nonexistent." },
      { title: "Using L'Hôpital's rule when the form is not 0/0 or ∞/∞", text: "For lim x→0 of (x + 1)/(x + 2), substitution gives 1/2. Applying L'Hôpital anyway would give 1/1 = 1, which is wrong." },
      { title: "Applying the quotient rule instead", text: "L'Hôpital's rule differentiates the numerator and denominator separately. It does not differentiate the fraction as a whole." },
      { title: "Ignoring direction", text: "At a vertical asymptote such as 1/x at 0, the left and right behaviour can differ. Always check both sides for a two-sided limit." },
      { title: "Treating ∞ as a number", text: "Writing lim = ∞ means the function grows without bound. The limit does not exist as a real number, and ∞ − ∞ is not 0." },
    ],
    limitations: [
      "Piecewise-defined functions cannot be entered directly; evaluate each one-sided limit with the matching formula instead.",
      "Limits that need series expansions or squeeze-theorem arguments may be answered numerically, with a clear label.",
      "Strongly oscillating functions such as sin(1/x) near 0 are reported as undetermined rather than guessed.",
      "Multivariable limits are not supported.",
    ],
    faqs: [
      { q: "How do I enter a limit at infinity?", a: "Type inf (or infinity, or ∞) in the “approaches” box. Use -inf for negative infinity. The direction setting is ignored at infinity." },
      { q: "What is the difference between a one-sided and a two-sided limit?", a: "A one-sided limit only looks at values of x on one side of the point. The two-sided limit exists only when both one-sided limits exist and agree." },
      { q: "When does a limit not exist?", a: "When the one-sided limits differ (a jump), when the function oscillates without settling (sin(1/x) near 0), or when it grows without bound. In that last case we often write ±∞ to describe how it fails to exist." },
      { q: "Why does the calculator sometimes say “numerical estimate”?", a: "If none of the symbolic methods settles the limit, the calculator evaluates the function very close to the point instead. That is reliable for well-behaved functions, but it is not a proof, so the answer is labelled accordingly." },
      { q: "Is L'Hôpital's rule always the best method?", a: "No. It only applies to 0/0 and ∞/∞ forms, and factoring or simplifying is often faster and clearer. The calculator tries substitution and factoring first." },
    ],
    related: ["derivative-calculator", "integral-calculator", "taylor-series-calculator"],
  },

  "taylor-series-calculator": {
    slug: "taylor-series-calculator",
    image: { src: "/images/taylor-series.webp", alt: "Several approximating curves hugging an original curve closely near one central point", width: 1600, height: 800 },
    metaTitle: "Taylor Series Calculator – Taylor and Maclaurin Polynomials",
    metaDescription:
      "Compute Taylor and Maclaurin polynomials up to order 10 about any center, with a table of exact derivatives and coefficients for every term.",
    h1: "Taylor Series Calculator",
    intro:
      "Build the Taylor polynomial of a function about any center, or a Maclaurin polynomial about 0. The calculator lists each derivative, its exact value at the center and the resulting coefficient, so you can follow the construction term by term.",
    operations: ["taylor"],
    solverExamples: [
      { label: "e^x, a = 0", operation: "taylor", expression: "e^x", point: "0", order: 5 },
      { label: "sin(x), a = 0", operation: "taylor", expression: "sin(x)", point: "0", order: 7 },
      { label: "ln(x), a = 1", operation: "taylor", expression: "ln(x)", point: "1", order: 4 },
      { label: "sqrt(x), a = 4", operation: "taylor", expression: "sqrt(x)", point: "4", order: 3 },
      { label: "cos(x), a = π", operation: "taylor", expression: "cos(x)", point: "pi", order: 4 },
    ],
    definition: {
      heading: "What is a Taylor polynomial?",
      paragraphs: [
        "A Taylor polynomial approximates a smooth function near a point a using the function's derivatives at that single point. The degree-n polynomial matches f and its first n derivatives at a, so it hugs the graph closely near the center and usually drifts away further out.",
        "Letting n grow without bound gives the Taylor series. When the center is a = 0, the polynomial and series are called Maclaurin polynomials and series. The calculator computes the polynomial up to the order you choose, which is what most homework and approximation problems need.",
      ],
      formula: t`T_{n}(x) = \sum_{k=0}^{n}\frac{f^{(k)}(a)}{k!}\,(x - a)^{k}`,
    },
    rules: {
      heading: "Series worth knowing by heart",
      intro: "These Maclaurin series appear constantly. The calculator reproduces them, and you can check each against its output.",
      items: [
        { name: "Exponential", latex: t`e^{x} = 1 + x + \frac{x^{2}}{2!} + \frac{x^{3}}{3!} + \cdots`, text: "Converges for every real x." },
        { name: "Sine", latex: t`\sin x = x - \frac{x^{3}}{3!} + \frac{x^{5}}{5!} - \cdots`, text: "Only odd powers, because sine is an odd function." },
        { name: "Cosine", latex: t`\cos x = 1 - \frac{x^{2}}{2!} + \frac{x^{4}}{4!} - \cdots`, text: "Only even powers, because cosine is even." },
        { name: "Geometric series", latex: t`\frac{1}{1 - x} = 1 + x + x^{2} + x^{3} + \cdots`, text: "Converges only for |x| < 1." },
        { name: "Natural log", latex: t`\ln(1 + x) = x - \frac{x^{2}}{2} + \frac{x^{3}}{3} - \cdots`, text: "Converges for −1 < x ≤ 1." },
        { name: "Lagrange remainder", latex: t`R_{n}(x) = \frac{f^{(n+1)}(c)}{(n+1)!}(x - a)^{n+1}`, text: "For some c between a and x; use it to bound the approximation error." },
      ],
    },
    howItWorks: [
      "The calculator differentiates your function repeatedly using the same symbolic engine as the derivative calculator. It simplifies each derivative before taking the next, so expressions stay manageable.",
      "Each derivative is evaluated at the center exactly: sin(π) = 0, e⁰ = 1, √4 = 2, with no rounding. Each value is then divided by k! to get the coefficient. Terms with a zero coefficient are skipped, and the rest are combined in increasing powers of (x − a).",
      "If the function or one of its derivatives is undefined at the center (for example ln(x) at 0), there is no Taylor polynomial there, and the calculator says so instead of producing nonsense.",
    ],
    examples: [
      {
        title: "Maclaurin polynomial of eˣ",
        problem: t`T_{4}(x)\ \text{for}\ e^{x}\ \text{about}\ 0`,
        steps: [{ text: "Every derivative of eˣ is eˣ, and e⁰ = 1, so each coefficient is 1/k!.", math: t`\frac{1}{0!} + \frac{1}{1!}x + \frac{1}{2!}x^{2} + \frac{1}{3!}x^{3} + \frac{1}{4!}x^{4}` }],
        answer: t`1 + x + \frac{x^{2}}{2} + \frac{x^{3}}{6} + \frac{x^{4}}{24}`,
        check: { operation: "taylor", expression: "e^x", point: "0", order: 4, expected: "1 + x + x^2/2 + x^3/6 + x^4/24" },
      },
      {
        title: "Cosine to order 6",
        problem: t`T_{6}(x)\ \text{for}\ \cos x\ \text{about}\ 0`,
        steps: [{ text: "The derivatives cycle cos, −sin, −cos, sin. At 0 they give 1, 0, −1, 0, 1, 0, −1.", math: t`1 - \frac{x^{2}}{2!} + \frac{x^{4}}{4!} - \frac{x^{6}}{6!}` }],
        answer: t`1 - \frac{x^{2}}{2} + \frac{x^{4}}{24} - \frac{x^{6}}{720}`,
        check: { operation: "taylor", expression: "cos(x)", point: "0", order: 6, expected: "1 - x^2/2 + x^4/24 - x^6/720" },
      },
      {
        title: "ln x about a = 1",
        problem: t`T_{4}(x)\ \text{for}\ \ln x\ \text{about}\ 1`,
        steps: [
          { text: "The derivatives are 1/x, −1/x², 2/x³, −6/x⁴. At x = 1 they equal 1, −1, 2, −6, and ln 1 = 0.", math: t`\frac{1}{1!}(x-1) - \frac{1}{2!}(x-1)^{2} + \frac{2}{3!}(x-1)^{3} - \frac{6}{4!}(x-1)^{4}` },
        ],
        answer: t`(x-1) - \frac{(x-1)^{2}}{2} + \frac{(x-1)^{3}}{3} - \frac{(x-1)^{4}}{4}`,
        check: { operation: "taylor", expression: "ln(x)", point: "1", order: 4, expected: "(x-1) - (x-1)^2/2 + (x-1)^3/3 - (x-1)^4/4" },
      },
      {
        title: "Approximating √4.1",
        problem: t`T_{2}(x)\ \text{for}\ \sqrt{x}\ \text{about}\ 4`,
        steps: [
          { text: "f(4) = 2, f′(x) = 1/(2√x) gives 1/4, and f″(x) = −1/(4x^{3/2}) gives −1/32. Divide the last by 2! to get −1/64.", math: t`T_{2}(x) = 2 + \frac{x - 4}{4} - \frac{(x - 4)^{2}}{64}` },
          { text: "At x = 4.1: 2 + 0.025 − 0.00015625 = 2.02484375. The true value is 2.0248457…, so the error is about 2 × 10⁻⁶.", math: t`\sqrt{4.1} \approx 2.02484375` },
        ],
        answer: t`2 + \frac{x - 4}{4} - \frac{(x - 4)^{2}}{64}`,
        check: { operation: "taylor", expression: "sqrt(x)", point: "4", order: 2, expected: "2 + (x-4)/4 - (x-4)^2/64" },
      },
    ],
    mistakes: [
      { title: "Forgetting the factorial", text: "The coefficient is f⁽ᵏ⁾(a)/k!, not f⁽ᵏ⁾(a). Missing the k! is the single most common error." },
      { title: "Using x instead of (x − a)", text: "Away from a = 0, every term involves powers of (x − a). Expanding in powers of x mixes up the coefficients." },
      { title: "Confusing order with number of terms", text: "“Order 6” means the highest power is 6. For cos x that is only four nonzero terms, because the odd coefficients vanish." },
      { title: "Trusting the polynomial far from the center", text: "The polynomial for 1/(1 − x) is useless at x = 2 because the series diverges for |x| ≥ 1. Stay inside the interval of convergence." },
    ],
    limitations: [
      "Polynomials are computed up to order 10. General nth-term formulas and full infinite series are not derived.",
      "The radius and interval of convergence are not computed automatically.",
      "Functions whose derivatives grow very complicated (high powers of tan x, for instance) may exceed the size limit at higher orders. Lower the order if that happens.",
      "Centers must be finite numbers or constant expressions such as pi/2.",
    ],
    faqs: [
      { q: "What is the difference between a Taylor series and a Maclaurin series?", a: "A Maclaurin series is simply a Taylor series centered at a = 0. Set the center to 0 in the calculator to get a Maclaurin polynomial." },
      { q: "What does the order of a Taylor polynomial mean?", a: "It is the highest power of (x − a) kept. An order-5 polynomial includes terms up to (x − a)⁵, although some of those coefficients may be zero." },
      { q: "How accurate is a Taylor polynomial?", a: "Very accurate close to the center and less accurate further away. The Lagrange remainder formula bounds the error, and the calculator reports a sample comparison between f and the polynomial near the center." },
      { q: "Why can't I center ln(x) at 0?", a: "ln(x) is undefined at 0, so it has no derivatives there and no Taylor polynomial. Use a = 1, or expand ln(1 + x) about 0 instead." },
    ],
    related: ["derivative-calculator", "limit-calculator", "integral-calculator"],
  },

  "critical-points-calculator": {
    slug: "critical-points-calculator",
    image: { src: "/images/critical-points.webp", alt: "A curve with a flat tangent at the top of a hill and at the bottom of a valley, marking a local maximum and minimum", width: 1600, height: 800 },
    metaTitle: "Critical Points Calculator – Find Local Maxima and Minima",
    metaDescription:
      "Find critical points where f′(x) = 0 or is undefined, then classify each as a local maximum, minimum or neither with the second or first derivative test.",
    h1: "Critical Points Calculator",
    intro:
      "Find every critical point of a function in an interval and classify each one as a local maximum, a local minimum or neither. Roots are exact whenever the derivative factors nicely; otherwise they are found numerically and marked as approximate.",
    operations: ["critical-points"],
    solverExamples: [
      { label: "x^3 - 3x^2 - 9x + 5", operation: "critical-points", expression: "x^3 - 3x^2 - 9x + 5" },
      { label: "x^4 - 2x^2", operation: "critical-points", expression: "x^4 - 2x^2" },
      { label: "x e^(-x)", operation: "critical-points", expression: "x e^(-x)" },
      { label: "x^(2/3)", operation: "critical-points", expression: "x^(2/3)" },
      { label: "sin(x) + cos(x)", operation: "critical-points", expression: "sin(x) + cos(x)" },
    ],
    definition: {
      heading: "What is a critical point?",
      paragraphs: [
        "A critical point of f is a number c in the domain of f where either f′(c) = 0 (a horizontal tangent) or f′(c) does not exist (a corner, cusp or vertical tangent). Fermat's theorem says every local maximum or minimum of a function on an open interval occurs at a critical point.",
        "The converse is false: not every critical point is an extremum. f(x) = x³ has f′(0) = 0, but the graph keeps rising through the origin. That is why critical points must be classified.",
      ],
      formula: t`c \text{ is critical} \iff c \in \operatorname{dom} f \ \text{and}\ \big(f'(c) = 0 \ \text{or}\ f'(c) \text{ undefined}\big)`,
    },
    rules: {
      heading: "How critical points are classified",
      intro: "Two standard tests decide what kind of point each candidate is.",
      items: [
        { name: "Second derivative test", latex: t`f'(c) = 0,\ f''(c) > 0 \Rightarrow \text{local min};\quad f''(c) < 0 \Rightarrow \text{local max}`, text: "Quick when f″ is easy to evaluate. It is inconclusive when f″(c) = 0." },
        { name: "First derivative test", latex: t`f' : - \to + \ \Rightarrow \text{min},\qquad f' : + \to - \ \Rightarrow \text{max}`, text: "Look at the sign of f′ just left and right of c. It also works where f′ is undefined." },
        { name: "No sign change", latex: t`f' : + \to + \ \text{or}\ - \to - \ \Rightarrow \text{neither}`, text: "The graph flattens momentarily but keeps going the same way, as x³ does at 0." },
      ],
    },
    howItWorks: [
      "The calculator differentiates f with full steps, then splits f′ into a numerator and a denominator. Polynomial factors of the numerator are solved exactly, using the rational root theorem and then the quadratic formula. That is how answers like x = ±√2 appear in exact form.",
      "Zeros of the denominator, and of any absolute value inside f′, are candidates where f′ is undefined; they count only if f itself is defined there. A dense numerical scan of the search interval then catches any remaining roots, such as those of trigonometric or exponential derivatives.",
      "Each point is classified with the second derivative test when f″ is nonzero, and with the first derivative test otherwise. The function value at each point is computed exactly when possible.",
    ],
    examples: [
      {
        title: "A cubic with a maximum and a minimum",
        problem: t`f(x) = x^{3} - 3x^{2} - 9x + 5`,
        steps: [
          { text: "Differentiate and factor:", math: t`f'(x) = 3x^{2} - 6x - 9 = 3(x - 3)(x + 1)` },
          { text: "The critical points are x = −1 and x = 3. Use f″(x) = 6x − 6:", math: t`f''(-1) = -12 < 0\ (\text{max}),\qquad f''(3) = 12 > 0\ (\text{min})` },
          { text: "Function values: f(−1) = 10 and f(3) = −22." },
        ],
        answer: t`x = -1\ (\text{local max},\ f = 10),\quad x = 3\ (\text{local min},\ f = -22)`,
        check: { operation: "critical-points", expression: "x^3 - 3x^2 - 9x + 5", expected: "-1, 3" },
      },
      {
        title: "A quartic with three critical points",
        problem: t`f(x) = x^{4} - 2x^{2}`,
        steps: [
          { text: "Differentiate and factor completely:", math: t`f'(x) = 4x^{3} - 4x = 4x(x - 1)(x + 1)` },
          { text: "Classify with f″(x) = 12x² − 4:", math: t`f''(\pm 1) = 8 > 0,\qquad f''(0) = -4 < 0` },
        ],
        answer: t`x = \pm 1\ (\text{local min},\ f = -1),\quad x = 0\ (\text{local max},\ f = 0)`,
        check: { operation: "critical-points", expression: "x^4 - 2x^2", expected: "-1, 0, 1" },
      },
      {
        title: "A cusp where f′ is undefined",
        problem: t`f(x) = x^{2/3}`,
        steps: [
          { text: "The derivative has x in the denominator:", math: t`f'(x) = \frac{2}{3}x^{-1/3} = \frac{2}{3\sqrt[3]{x}}` },
          { text: "f′(x) is never 0, but it is undefined at x = 0, where f(0) = 0 is defined. f′ changes from negative to positive there." },
        ],
        answer: t`x = 0\ (\text{local min, a cusp})`,
        check: { operation: "critical-points", expression: "x^(2/3)", expected: "0" },
      },
      {
        title: "An exponential example",
        problem: t`f(x) = x\,e^{-x}`,
        steps: [
          { text: "Product rule:", math: t`f'(x) = e^{-x} - x e^{-x} = e^{-x}(1 - x)` },
          { text: "Since e^(−x) > 0 always, f′ = 0 only at x = 1, where f′ changes from + to −." },
        ],
        answer: t`x = 1\ \left(\text{local max},\ f = \tfrac{1}{e}\right)`,
        check: { operation: "critical-points", expression: "x e^(-x)", expected: "1" },
      },
    ],
    mistakes: [
      { title: "Assuming f″(c) = 0 means “neither”", text: "x⁴ has f″(0) = 0 yet a clear minimum at 0. When the second derivative test is inconclusive, switch to the first derivative test." },
      { title: "Forgetting points where f′ is undefined", text: "|x| and x^(2/3) have their minimum exactly where f′ fails to exist. Check the denominator of f′ as well as the numerator." },
      { title: "Including points outside the domain", text: "For f(x) = 1/x, f′ is undefined at 0, but 0 is not in the domain of f, so it is not a critical point." },
      { title: "Mixing up local and absolute extrema", text: "On a closed interval [a, b], the absolute maximum may occur at an endpoint. Compare the endpoint values with the critical values yourself." },
    ],
    limitations: [
      "Only the search interval you set is examined (default −10 to 10). Periodic functions have infinitely many critical points, and only those in the interval are listed.",
      "Roots of non-polynomial derivatives are found numerically and marked ≈. Very close or tangent roots can occasionally be missed; narrowing the interval helps.",
      "Absolute extrema on closed intervals and endpoint analysis are not computed automatically.",
      "Functions of more than one variable (saddle points, gradients) are not supported.",
    ],
    faqs: [
      { q: "Are critical points the same as local maxima and minima?", a: "No. Every local extremum (in the interior of the domain) is a critical point, but some critical points are neither, like x = 0 for x³. Classification decides which is which." },
      { q: "What if the second derivative is zero?", a: "The second derivative test is then inconclusive, so the calculator falls back to the first derivative test, checking the sign of f′ on each side of the point." },
      { q: "Why do some answers show ≈?", a: "When the derivative does not factor into polynomials, the critical points are found numerically to about 10 significant digits and marked with ≈ so you know they are approximations." },
      { q: "Can I change where the calculator searches?", a: "Yes. Edit the “Search from” and “Search to” boxes. Narrow intervals give the numerical search more precision; wide ones help when you don't know where the points are." },
    ],
    related: ["derivative-calculator", "limit-calculator", "taylor-series-calculator"],
    guide: { href: "/guides/derivative-rules", label: "Derivative rules refresher" },
  },
};

export const calculatorList = Object.values(calculators);
