// Long-form guides. Each covers an intent the calculator pages do not:
// learning the rules and choosing a technique, rather than computing an answer.

import type { Faq, Illustration, WorkedExample } from "@/types/content";

const t = String.raw;

export type Block =
  /** A paragraph; an optional link is appended after the text. */
  | { type: "p"; text: string; link?: { href: string; label: string } }
  | { type: "math"; latex: string }
  | { type: "list"; items: string[] }
  | { type: "table"; caption: string; headers: string[]; rows: string[][] };

export interface Guide {
  slug: string;
  title: string;
  metaTitle: string;
  description: string;
  intro: string;
  image?: Illustration;
  /** Colour class for this article's title on cards and on its own page. */
  titleClass?: string;
  /** Publication date (YYYY-MM-DD) for blog posts; guides show the site's review date instead. */
  published?: string;
  sections: { id: string; heading: string; blocks: Block[] }[];
  examples: WorkedExample[];
  faqs: Faq[];
  calculator: { href: string; label: string };
}

export const guides: Guide[] = [
  {
    slug: "derivative-rules",
    titleClass: "text-guide-derivative",
    image: { src: "/images/guide-derivative-rules.webp", alt: "Connected gears and circles, representing derivative rules that combine and chain together", width: 1600, height: 800, caption: "Derivative rules work together: most functions need several of them, applied from the outside in." },
    title: "Derivative Rules: A Complete Guide with Examples",
    metaTitle: "Derivative Rules Explained – Power, Product, Quotient, Chain",
    description:
      "Learn every core derivative rule with clear explanations, a reference table, and worked examples, plus a step-by-step strategy for differentiating any function.",
    intro:
      "Differentiating a function comes down to recognising its structure and applying the matching rule. This guide covers every rule you need for a first calculus course, shows when each one applies, and ends with a strategy you can use on any problem.",
    sections: [
      {
        id: "reference",
        heading: "Quick reference table",
        blocks: [
          { type: "p", text: "Memorise these basic derivatives. Every other derivative is built from them using the combination rules below." },
          {
            type: "table",
            caption: "Basic derivatives",
            headers: ["f(x)", "f′(x)"],
            rows: [
              [t`c`, t`0`],
              [t`x^{n}`, t`n x^{n-1}`],
              [t`e^{x}`, t`e^{x}`],
              [t`a^{x}`, t`a^{x}\ln a`],
              [t`\ln x`, t`\frac{1}{x}`],
              [t`\sin x`, t`\cos x`],
              [t`\cos x`, t`-\sin x`],
              [t`\tan x`, t`\sec^{2}x`],
              [t`\sec x`, t`\sec x\tan x`],
              [t`\arcsin x`, t`\frac{1}{\sqrt{1 - x^{2}}}`],
              [t`\arctan x`, t`\frac{1}{1 + x^{2}}`],
            ],
          },
        ],
      },
      {
        id: "power-rule",
        heading: "The power rule",
        blocks: [
          { type: "math", latex: t`\frac{d}{dx}x^{n} = n x^{n-1}` },
          { type: "p", text: "Bring the exponent down as a coefficient, then subtract one from the exponent. The rule holds for every real n, not just positive integers. That makes it the fastest way to handle roots and reciprocals once you rewrite them as powers." },
          { type: "list", items: ["√x = x^(1/2), so its derivative is (1/2)x^(−1/2) = 1/(2√x).", "1/x³ = x^(−3), so its derivative is −3x^(−4) = −3/x⁴.", "Constants differentiate to 0, and a constant factor stays put: (5x²)′ = 10x."] },
        ],
      },
      {
        id: "product-quotient",
        heading: "Product and quotient rules",
        blocks: [
          { type: "math", latex: t`(fg)' = f'g + fg' \qquad \left(\frac{f}{g}\right)' = \frac{f'g - fg'}{g^{2}}` },
          { type: "p", text: "Use the product rule whenever two non-constant factors are multiplied. The quotient rule is the product rule applied to f·g⁻¹, and is worth memorising for speed. The numerator starts with the derivative of the top: “low d-high minus high d-low, over low squared.”" },
          { type: "p", text: "Before reaching for the quotient rule, check whether simplifying first is easier. (x³ + x)/x is just x² + 1 for x ≠ 0." },
        ],
      },
      {
        id: "chain-rule",
        heading: "The chain rule",
        blocks: [
          { type: "math", latex: t`\frac{d}{dx}f\big(g(x)\big) = f'\big(g(x)\big)\,g'(x)` },
          { type: "p", text: "The chain rule handles compositions, meaning a function inside another function. Identify the outer function, differentiate it while leaving the inside untouched, then multiply by the derivative of the inside. For nested compositions, repeat from the outside in." },
          { type: "list", items: ["(3x + 1)⁵ → 5(3x + 1)⁴ · 3", "e^(x²) → e^(x²) · 2x", "ln(cos x) → (1/cos x) · (−sin x) = −tan x"] },
        ],
      },
      {
        id: "log-differentiation",
        heading: "Logarithmic differentiation",
        blocks: [
          { type: "p", text: "When both the base and the exponent contain x, as in xˣ, none of the basic rules apply directly. Take logarithms first: if y = xˣ then ln y = x ln x. Differentiate both sides (y′/y = ln x + 1) and multiply by y." },
          { type: "math", latex: t`\frac{d}{dx}x^{x} = x^{x}\left(\ln x + 1\right)` },
        ],
      },
      {
        id: "strategy",
        heading: "A strategy that works every time",
        blocks: [
          {
            type: "list",
            items: [
              "Simplify first: expand small products, cancel common factors, rewrite roots and reciprocals as powers.",
              "Look at the outermost operation. A sum calls for the sum rule, a product for the product rule, a quotient for the quotient rule, and a function of something other than x for the chain rule.",
              "Apply that one rule, then repeat on each smaller piece.",
              "Simplify the result and sanity-check it, for example by plugging in a value or comparing with a graph.",
            ],
          },
          { type: "p", text: "The derivative calculator follows exactly this outside-in process and labels each step with the rule it used, so you can compare your own work line by line." },
          {
            type: "p",
            text: "New to derivatives? Start with the limit definition and a full walkthrough in",
            link: { href: "/blog/how-to-find-the-derivative-of-a-function", label: "How to Find the Derivative of a Function" },
          },
        ],
      },
    ],
    examples: [
      {
        title: "Combining product and chain rules",
        problem: t`\frac{d}{dx}\left(x\,e^{2x}\right)`,
        steps: [
          { text: "Product rule with f = x, g = e^(2x). The chain rule gives g′ = 2e^(2x).", math: t`1\cdot e^{2x} + x\cdot 2e^{2x}` },
        ],
        answer: t`e^{2x}\left(1 + 2x\right)`,
        check: { operation: "derivative", expression: "x e^(2x)", expected: "e^(2x)(1 + 2x)" },
      },
      {
        title: "Rewriting a root as a power",
        problem: t`\frac{d}{dx}\sqrt{x^{2} + 4}`,
        steps: [
          { text: "Rewrite as (x² + 4)^(1/2), then use the power rule with the chain rule.", math: t`\frac{1}{2}\left(x^{2} + 4\right)^{-1/2}\cdot 2x` },
        ],
        answer: t`\frac{x}{\sqrt{x^{2} + 4}}`,
        check: { operation: "derivative", expression: "sqrt(x^2 + 4)", expected: "x/sqrt(x^2+4)" },
      },
      {
        title: "A nested chain rule",
        problem: t`\frac{d}{dx}\ln\left(\cos x\right)`,
        steps: [{ text: "The outer function is ln u with u = cos x.", math: t`\frac{1}{\cos x}\cdot\left(-\sin x\right)` }],
        answer: t`-\tan x`,
        check: { operation: "derivative", expression: "ln(cos(x))", expected: "-tan(x)" },
      },
    ],
    faqs: [
      { q: "Which derivative rule should I use first?", a: "Look at the outermost operation of the expression. That single operation decides the first rule; the inner pieces are handled afterwards." },
      { q: "Do I always need the quotient rule for fractions?", a: "No. If the denominator is a constant, just use the constant multiple rule. If the fraction simplifies, simplify first. You can also rewrite f/g as f·g⁻¹ and use the product and chain rules." },
    ],
    calculator: { href: "/derivative-calculator", label: "Check your derivatives with the Derivative Calculator" },
  },
  {
    slug: "integration-techniques",
    titleClass: "text-guide-integration",
    image: { src: "/images/guide-integration.webp", alt: "One path branching into several routes, each ending at a different shape, representing the choice of integration technique", width: 1600, height: 800, caption: "Each integral calls for a technique. The key skill is choosing the right route before you start." },
    title: "Integration Techniques: How to Choose the Right Method",
    metaTitle: "Integration Techniques – Substitution, Parts, Partial Fractions",
    description:
      "A practical guide to choosing an integration technique: basic forms, u-substitution, integration by parts, trig identities and partial fractions, with worked examples.",
    intro:
      "Integration is harder than differentiation because no single procedure always works. Instead, you recognise the shape of the integrand and pick the matching technique. This guide gives you a decision order and explains each technique with an example.",
    sections: [
      {
        id: "decision-order",
        heading: "A decision order for any integral",
        blocks: [
          {
            type: "list",
            items: [
              "Simplify: expand products, split fractions with a single-term denominator, use identities.",
              "Is it a basic form? Check the table of standard integrals.",
              "Is there a function and its derivative? Try u-substitution.",
              "Is it a product of different types of function, such as x·eˣ or x·sin x? Try integration by parts.",
              "Is it a ratio of polynomials? Use long division, then partial fractions.",
              "Powers of sin and cos? Use power-reducing or Pythagorean identities.",
            ],
          },
        ],
      },
      {
        id: "substitution",
        heading: "u-substitution",
        blocks: [
          { type: "math", latex: t`\int f\big(g(x)\big)g'(x)\,dx = \int f(u)\,du` },
          { type: "p", text: "Look for an inner function whose derivative also appears as a factor, possibly up to a constant multiple. Set u equal to that inner function, replace dx using du = g′(x) dx, and check that no x is left over. If some x remains, the choice of u was wrong or substitution alone will not work." },
          { type: "p", text: "Good candidates for u are the inside of a power, the exponent of e, the argument of a trig function, or a denominator whose derivative is the numerator." },
        ],
      },
      {
        id: "parts",
        heading: "Integration by parts",
        blocks: [
          { type: "math", latex: t`\int u\,dv = uv - \int v\,du` },
          { type: "p", text: "Integration by parts reverses the product rule. Choose u as the factor that gets simpler when differentiated, using LIATE as a guide: Logarithms, Inverse trig, Algebraic, Trigonometric, Exponential. Choose dv as the rest, which must be something you can integrate." },
          { type: "p", text: "Polynomials times eˣ or sin x need one round of parts per degree of the polynomial. Products like eˣ·cos x return to the original integral after two rounds, which can then be solved for algebraically." },
        ],
      },
      {
        id: "trig",
        heading: "Trigonometric integrals",
        blocks: [
          { type: "math", latex: t`\sin^{2}x = \frac{1 - \cos 2x}{2}, \qquad \cos^{2}x = \frac{1 + \cos 2x}{2}` },
          { type: "p", text: "Even powers of sine and cosine are lowered with these power-reducing identities. For an odd power, split off one factor and convert the rest using sin²x + cos²x = 1; the leftover factor becomes du in a substitution." },
        ],
      },
      {
        id: "partial-fractions",
        heading: "Partial fractions",
        blocks: [
          { type: "p", text: "For a rational function P(x)/Q(x), first divide if the degree of P is at least the degree of Q. Then factor Q and write the fraction as a sum of simpler pieces: A/(x − r) for each linear factor, and (Bx + C)/(quadratic) for each irreducible quadratic factor. Linear pieces integrate to logarithms; irreducible quadratics give a logarithm plus an arctangent." },
          { type: "math", latex: t`\frac{1}{(x-1)(x+2)} = \frac{1/3}{x - 1} - \frac{1/3}{x + 2}` },
        ],
      },
      {
        id: "no-antiderivative",
        heading: "When there is no elementary answer",
        blocks: [
          { type: "p", text: "Some integrals cannot be expressed with elementary functions at all. Common examples are ∫e^(−x²) dx, ∫sin(x)/x dx and ∫1/ln(x) dx. This is a proven fact, not a gap in technique. For such integrands, definite integrals are computed numerically." },
        ],
      },
    ],
    examples: [
      {
        title: "Substitution with a constant adjustment",
        problem: t`\int x\left(x^{2} + 1\right)^{3}dx`,
        steps: [
          { text: "Let u = x² + 1, so du = 2x dx and x dx = du/2.", math: t`\frac{1}{2}\int u^{3}\,du = \frac{u^{4}}{8} + C` },
        ],
        answer: t`\frac{\left(x^{2} + 1\right)^{4}}{8} + C`,
        check: { operation: "indefinite-integral", expression: "x (x^2+1)^3", expected: "(x^2+1)^4/8" },
      },
      {
        title: "Parts twice: x² eˣ",
        problem: t`\int x^{2}e^{x}\,dx`,
        steps: [
          { text: "u = x², dv = eˣ dx:", math: t`x^{2}e^{x} - \int 2x\,e^{x}\,dx` },
          { text: "Parts again with u = 2x:", math: t`x^{2}e^{x} - \left(2x e^{x} - 2e^{x}\right)` },
        ],
        answer: t`e^{x}\left(x^{2} - 2x + 2\right) + C`,
        check: { operation: "indefinite-integral", expression: "x^2 e^x", expected: "e^x (x^2 - 2x + 2)" },
      },
      {
        title: "Partial fractions with two linear factors",
        problem: t`\int \frac{1}{(x-1)(x+2)}\,dx`,
        steps: [{ text: "Split into A/(x − 1) + B/(x + 2) with A = 1/3 and B = −1/3, then integrate each.", math: t`\frac{1}{3}\ln|x - 1| - \frac{1}{3}\ln|x + 2| + C` }],
        answer: t`\frac{1}{3}\ln\left|\frac{x - 1}{x + 2}\right| + C`,
        check: { operation: "indefinite-integral", expression: "1/((x-1)(x+2))", expected: "ln(abs(x-1))/3 - ln(abs(x+2))/3" },
      },
    ],
    faqs: [
      { q: "How do I know whether to use substitution or integration by parts?", a: "If one part of the integrand is (up to a constant) the derivative of another part, use substitution. If the integrand is a product of two unrelated kinds of function, such as a polynomial times an exponential, use integration by parts." },
      { q: "Why do different methods give answers that look different?", a: "Antiderivatives are only unique up to a constant, and trig identities can rewrite the same function in many ways. Differentiate each answer to confirm that both are correct." },
    ],
    calculator: { href: "/integral-calculator", label: "Practise with the Integral Calculator" },
  },
];

export function getGuide(slug: string): Guide | undefined {
  return guides.find((g) => g.slug === slug);
}
