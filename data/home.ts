import type { Faq, SolverExample, WorkedExample } from "@/types/content";

const t = String.raw;

export const homeSolverExamples: SolverExample[] = [
  { label: "d/dx x^2 sin(x)", operation: "derivative", expression: "x^2 sin(x)" },
  { label: "∫ x e^x dx", operation: "indefinite-integral", expression: "x e^x" },
  { label: "∫₀¹ x^2 dx", operation: "definite-integral", expression: "x^2", lower: "0", upper: "1" },
  { label: "lim sin(x)/x, x→0", operation: "limit", expression: "sin(x)/x", point: "0" },
  { label: "Taylor e^x", operation: "taylor", expression: "e^x", point: "0", order: 5 },
  { label: "Critical x^3 - 3x", operation: "critical-points", expression: "x^3 - 3x" },
  { label: "∂/∂y x^2 y^3", operation: "partial-derivative", expression: "x^2 y^3", variable: "y" },
  { label: "dy/dx x^2+y^2=25", operation: "implicit", expression: "x^2 + y^2 = 25" },
];

export const syntaxGuide: { input: string; meaning: string; latex: string }[] = [
  { input: "x^2", meaning: "Powers", latex: t`x^{2}` },
  { input: "3x or 3*x", meaning: "Multiplication (the * is optional)", latex: t`3x` },
  { input: "(x+1)/(x-1)", meaning: "Fractions: wrap numerator and denominator in parentheses", latex: t`\frac{x+1}{x-1}` },
  { input: "sqrt(x), cbrt(x)", meaning: "Square and cube roots", latex: t`\sqrt{x},\ \sqrt[3]{x}` },
  { input: "x^(1/3)", meaning: "Fractional powers", latex: t`x^{1/3}` },
  { input: "e^x or exp(x)", meaning: "Exponential function", latex: t`e^{x}` },
  { input: "ln(x)", meaning: "Natural logarithm (log(x) is also read as ln)", latex: t`\ln x` },
  { input: "log10(x), log(x, 2)", meaning: "Logarithms in other bases", latex: t`\log_{10}x,\ \log_{2}x` },
  { input: "sin(x), cos(x), tan(x)", meaning: "Trig functions (also sec, csc, cot)", latex: t`\sin x` },
  { input: "sin(x)^2 or sin^2(x)", meaning: "Powers of trig functions", latex: t`\sin^{2}x` },
  { input: "asin(x), atan(x)", meaning: "Inverse trig (arcsin, arccos and arctan also work)", latex: t`\arcsin x` },
  { input: "abs(x) or |x|", meaning: "Absolute value", latex: t`|x|` },
  { input: "pi, e", meaning: "Constants π and e", latex: t`\pi,\ e` },
  { input: "inf, -inf", meaning: "Infinity, in bounds and limit points only", latex: t`\infty` },
];

export const homeExamples: WorkedExample[] = [
  {
    title: "Derivative",
    problem: t`\frac{d}{dx}\left(x^{2}\sin x\right)`,
    steps: [{ text: "Product rule with f = x² and g = sin x.", math: t`2x\sin x + x^{2}\cos x` }],
    answer: t`2x\sin x + x^{2}\cos x`,
    check: { operation: "derivative", expression: "x^2 sin(x)", expected: "2x sin(x) + x^2 cos(x)" },
  },
  {
    title: "Indefinite integral",
    problem: t`\int x\,e^{x}\,dx`,
    steps: [{ text: "Integration by parts with u = x and dv = eˣ dx.", math: t`x e^{x} - \int e^{x}\,dx` }],
    answer: t`x e^{x} - e^{x} + C`,
    check: { operation: "indefinite-integral", expression: "x e^x", expected: "x e^x - e^x" },
  },
  {
    title: "Definite integral",
    problem: t`\int_{0}^{\pi}\sin x\,dx`,
    steps: [{ text: "An antiderivative is −cos x.", math: t`\left[-\cos x\right]_{0}^{\pi} = -(-1) - (-1)` }],
    answer: t`2`,
    check: { operation: "definite-integral", expression: "sin(x)", lower: "0", upper: "pi", expected: "2" },
  },
  {
    title: "Limit",
    problem: t`\lim_{x\to 0}\frac{\sin x}{x}`,
    steps: [{ text: "Substitution gives 0/0, so apply L'Hôpital's rule.", math: t`\lim_{x\to 0}\frac{\cos x}{1} = \cos 0` }],
    answer: t`1`,
    check: { operation: "limit", expression: "sin(x)/x", point: "0", expected: "1" },
  },
];

export const homeFaqs: Faq[] = [
  { q: "Is this calculus solver free?", a: "Yes. Every feature is free to use, with no account, no sign-up and no limit on the number of problems." },
  { q: "Does the solver show steps?", a: "Yes. Derivatives and most integrals show every rule applied. Limits show substitution, factoring or L'Hôpital steps. Taylor polynomials show a table of derivatives and coefficients. When steps are not available (for example, an integral solved by the computer algebra fallback), the solver says so." },
  { q: "Is my input sent anywhere?", a: "No. The math engine runs inside your browser. Your expressions are never uploaded, logged or stored; the only thing sent is an anonymous +1 to the public count of problems solved. Once the page has loaded, solving does not need an internet connection." },
  { q: "How accurate are the answers?", a: "Symbolic answers are exact, and each is checked independently: antiderivatives by differentiation, limits numerically, derivatives against finite differences. Numerical answers are labelled as such and are typically accurate to about 10 significant digits." },
  { q: "Can I use it for homework or exams?", a: "Use it to learn and to check your own work. Follow your teacher's and school's rules: many courses do not allow calculators like this on graded assignments or exams." },
  { q: "What problems can't it solve?", a: "Differential equations, multiple integrals, vector calculus, series convergence tests and word problems are not supported. For several variables, it handles partial derivatives up to second order. Some integrals have no elementary antiderivative, and the solver tells you when that is the case." },
];
