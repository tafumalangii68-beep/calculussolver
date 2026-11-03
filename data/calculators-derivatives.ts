// Content for the specialised derivative calculators: second derivative, partial
// derivative, chain rule and implicit differentiation. Each page answers its own
// search intent; worked examples are machine-checked by tests/content.test.ts.

import type { CalculatorPage } from "./calculators";

const t = String.raw;

export const derivativeCalculators: CalculatorPage[] = [
  {
    slug: "second-derivative-calculator",
    metaTitle: "Second Derivative Calculator with Steps – f″(x) and Concavity",
    metaDescription:
      "Find the second derivative f″(x) of any function step by step, then use it for concavity, inflection points and the second derivative test. Free and private.",
    h1: "Second Derivative Calculator",
    intro:
      "Enter a function to get its second derivative with every step shown: first f′(x), then f″(x). Use the result to see where a graph is concave up or down, locate inflection points, or classify critical points.",
    operations: ["derivative"],
    initialOrder: 2,
    solverExamples: [
      { label: "x^4 - 4x^3 + 2", operation: "derivative", expression: "x^4 - 4x^3 + 2", order: 2 },
      { label: "x e^x", operation: "derivative", expression: "x e^x", order: 2 },
      { label: "ln(x^2 + 1)", operation: "derivative", expression: "ln(x^2 + 1)", order: 2 },
      { label: "sin(2x)", operation: "derivative", expression: "sin(2x)", order: 2 },
      { label: "x/(x+1)", operation: "derivative", expression: "x/(x+1)", order: 2 },
    ],
    definition: {
      heading: "What is the second derivative?",
      paragraphs: [
        "The second derivative is the derivative of the derivative. If f′(x) tells you the slope of a graph, f″(x) tells you how fast that slope is changing. A positive second derivative means the slope is increasing, so the graph bends upward; a negative one means it bends downward.",
        "To find it, differentiate once, simplify, and differentiate again. Simplifying in between is not optional in practice: a tidy f′(x) can turn a long second differentiation into a short one.",
      ],
      formula: t`f''(x) = \frac{d}{dx}\big[f'(x)\big] = \frac{d^{2}y}{dx^{2}}`,
    },
    rules: {
      heading: "What the second derivative tells you",
      intro: "The second derivative is used far more often than higher derivatives, because of these interpretations.",
      items: [
        { name: "Concave up", latex: t`f''(x) > 0`, text: "The graph bends upward like a cup, and its slope is increasing." },
        { name: "Concave down", latex: t`f''(x) < 0`, text: "The graph bends downward like a cap, and its slope is decreasing." },
        { name: "Inflection point", latex: t`f''\ \text{changes sign at}\ x = c`, text: "Where concavity switches. f″(c) = 0 alone is not enough: x⁴ has f″(0) = 0 but no inflection point." },
        { name: "Second derivative test", latex: t`f'(c) = 0:\quad f''(c) > 0 \Rightarrow \min,\quad f''(c) < 0 \Rightarrow \max`, text: "A fast way to classify critical points. If f″(c) = 0, the test is inconclusive." },
        { name: "Acceleration", latex: t`s(t) \to s'(t) = v(t) \to s''(t) = a(t)`, text: "For a position function, the second derivative is acceleration." },
        { name: "Notation", latex: t`f''(x),\quad y'',\quad \frac{d^{2}y}{dx^{2}},\quad D^{2}f`, text: "All four mean the same thing. The exponent in d²y/dx² marks the order, not a power." },
      ],
    },
    howItWorks: [
      "The calculator differentiates your function once, showing every rule it uses, and simplifies the result exactly. It then differentiates that simplified first derivative again, with its own list of steps, so you can follow both passes separately.",
      "The answer is checked by comparing it with a numerical finite-difference estimate of the first derivative's slope at several points. The Order menu goes up to the 10th derivative if you need third or higher derivatives.",
    ],
    examples: [
      {
        title: "Polynomial and inflection points",
        problem: t`f(x) = x^{4} - 4x^{3} + 2`,
        steps: [
          { text: "First derivative by the power rule:", math: t`f'(x) = 4x^{3} - 12x^{2}` },
          { text: "Differentiate again:", math: t`f''(x) = 12x^{2} - 24x = 12x(x - 2)` },
          { text: "f″ changes sign at x = 0 and x = 2, so both are inflection points. The graph is concave up for x < 0 and x > 2, and concave down between." },
        ],
        answer: t`f''(x) = 12x^{2} - 24x`,
        check: { operation: "derivative", expression: "x^4 - 4x^3 + 2", order: 2, expected: "12x^2 - 24x" },
      },
      {
        title: "Product rule twice",
        problem: t`f(x) = x\,e^{x}`,
        steps: [
          { text: "Product rule:", math: t`f'(x) = e^{x} + x e^{x} = (x + 1)e^{x}` },
          { text: "Product rule again on (x + 1)eˣ:", math: t`f''(x) = e^{x} + (x + 1)e^{x}` },
        ],
        answer: t`f''(x) = (x + 2)\,e^{x}`,
        check: { operation: "derivative", expression: "x e^x", order: 2, expected: "(x + 2) e^x" },
      },
      {
        title: "Chain rule, then the quotient rule",
        problem: t`f(x) = \ln\left(x^{2} + 1\right)`,
        steps: [
          { text: "Chain rule:", math: t`f'(x) = \frac{2x}{x^{2} + 1}` },
          { text: "Quotient rule on f′:", math: t`f''(x) = \frac{2\left(x^{2} + 1\right) - 2x\cdot 2x}{\left(x^{2} + 1\right)^{2}}` },
          { text: "Simplify the numerator: 2x² + 2 − 4x² = 2 − 2x²." },
        ],
        answer: t`f''(x) = \frac{2 - 2x^{2}}{\left(x^{2} + 1\right)^{2}}`,
        check: { operation: "derivative", expression: "ln(x^2 + 1)", order: 2, expected: "(2 - 2x^2)/(x^2+1)^2" },
      },
      {
        title: "Trigonometric function",
        problem: t`f(x) = \sin(2x)`,
        steps: [
          { text: "Chain rule:", math: t`f'(x) = 2\cos(2x)` },
          { text: "Chain rule again:", math: t`f''(x) = 2\cdot\big(-\sin(2x)\big)\cdot 2` },
        ],
        answer: t`f''(x) = -4\sin(2x)`,
        check: { operation: "derivative", expression: "sin(2x)", order: 2, expected: "-4 sin(2x)" },
      },
      {
        title: "Acceleration from position",
        problem: t`s(t) = t^{3} - 6t^{2} + 9t`,
        steps: [
          { text: "Velocity is the first derivative:", math: t`v(t) = s'(t) = 3t^{2} - 12t + 9` },
          { text: "Acceleration is the second derivative:", math: t`a(t) = s''(t) = 6t - 12` },
          { text: "The acceleration is zero at t = 2, negative before and positive after." },
        ],
        answer: t`s''(t) = 6t - 12`,
        check: { operation: "derivative", expression: "t^3 - 6t^2 + 9t", variable: "t", order: 2, expected: "6t - 12" },
      },
    ],
    mistakes: [
      { title: "Not simplifying f′ first", text: "Differentiating an unsimplified first derivative multiplies the work, and the chance of error, for the second pass." },
      { title: "Assuming f″ = 0 means an inflection point", text: "For x⁴, f″(0) = 0, yet the graph is concave up on both sides. Check that f″ actually changes sign." },
      { title: "Confusing concavity with increasing", text: "A function can be decreasing and concave up at the same time, like e^(−x). Concavity is about the slope's change, not its sign." },
      { title: "Squaring the first derivative", text: "f″(x) is not (f′(x))². The notation d²y/dx² records the order, not a power." },
    ],
    limitations: [
      "The calculator returns f″(x); it does not list intervals of concavity automatically. Find where f″ is zero or undefined, then test its sign between those points.",
      "Second derivatives of implicit equations (d²y/dx²) are not supported; the implicit differentiation calculator finds dy/dx.",
      "Answers may be in an equivalent form to your textbook's, for example factored versus expanded.",
    ],
    faqs: [
      { q: "How do you find the second derivative?", a: "Differentiate the function once to get f′(x), simplify it, then differentiate f′(x) again. The calculator shows both passes with every rule used." },
      { q: "What does a negative second derivative mean?", a: "The graph is concave down there: its slope is decreasing. At a critical point, a negative second derivative means a local maximum." },
      { q: "Can I find the third derivative or higher?", a: "Yes. Choose a higher order from the Order menu; it goes up to the 10th derivative." },
      { q: "Is the second derivative the same as the derivative squared?", a: "No. The second derivative differentiates twice. For f(x) = x³, f″(x) = 6x, while (f′(x))² = 9x⁴." },
    ],
    related: ["derivative-calculator", "critical-points-calculator", "taylor-series-calculator"],
    articles: ["how-to-find-the-derivative-of-a-function"],
  },

  {
    slug: "partial-derivative-calculator",
    metaTitle: "Partial Derivative Calculator with Steps – fx, fy and fxy",
    metaDescription:
      "Find partial derivatives of functions of several variables step by step: ∂f/∂x, ∂f/∂y and second-order partials like fxx and fxy. Free, runs in your browser.",
    h1: "Partial Derivative Calculator",
    intro:
      "Differentiate a function of two or more variables with respect to one of them while holding the others constant. Get first partials such as ∂f/∂x and second partials such as fxx or the mixed partial fxy, with every rule shown.",
    operations: ["partial-derivative"],
    solverExamples: [
      { label: "∂/∂x  x^2 y + 3x y^3", operation: "partial-derivative", expression: "x^2 y + 3x y^3", variable: "x" },
      { label: "∂/∂y  x^2 y + 3x y^3", operation: "partial-derivative", expression: "x^2 y + 3x y^3", variable: "y" },
      { label: "f_xy  x^2 y + 3x y^3", operation: "partial-derivative", expression: "x^2 y + 3x y^3", variable: "x", variable2: "y" },
      { label: "∂/∂x  e^(x y^2)", operation: "partial-derivative", expression: "e^(x y^2)", variable: "x" },
      { label: "∂/∂z  x y z + sin(x z)", operation: "partial-derivative", expression: "x y z + sin(x z)", variable: "z" },
    ],
    definition: {
      heading: "What is a partial derivative?",
      paragraphs: [
        "A function such as f(x, y) describes a surface. A partial derivative measures how f changes when only one variable moves while the others stay fixed. ∂f/∂x is the slope of the surface in the x-direction, holding y constant; ∂f/∂y is the slope in the y-direction, holding x constant.",
        "In practice, you compute a partial derivative with the ordinary rules of differentiation, treating every other variable as if it were a number.",
      ],
      formula: t`\frac{\partial f}{\partial x} = \lim_{h \to 0} \frac{f(x + h, y) - f(x, y)}{h}`,
    },
    rules: {
      heading: "Rules and notation for partial derivatives",
      intro: "Nothing about the derivative rules changes; what changes is which letters count as constants.",
      items: [
        { name: "Notation", latex: t`\frac{\partial f}{\partial x} = f_{x},\qquad \frac{\partial f}{\partial y} = f_{y}`, text: "The curly ∂ signals that other variables are held constant." },
        { name: "Hold the others constant", latex: t`\frac{\partial}{\partial x}\left[x^{2}y^{3}\right] = 2x\,y^{3}`, text: "y³ behaves like a constant factor, exactly like the 5 in 5x²." },
        { name: "Same rules as usual", latex: t`\frac{\partial}{\partial x}\left[e^{xy}\right] = y\,e^{xy}`, text: "The chain rule still applies. Here the inner function xy has ∂/∂x = y." },
        { name: "Second partials", latex: t`f_{xx} = \frac{\partial^{2} f}{\partial x^{2}},\qquad f_{xy} = \frac{\partial^{2} f}{\partial y\,\partial x}`, text: "fxy means: differentiate with respect to x first, then y." },
        { name: "Clairaut's theorem", latex: t`f_{xy} = f_{yx}`, text: "If both mixed partials are continuous, the order of differentiation does not matter." },
        { name: "Gradient", latex: t`\nabla f = \left(f_{x},\ f_{y}\right)`, text: "The vector of first partials points in the direction of steepest increase." },
      ],
    },
    howItWorks: [
      "The calculator uses the same rule-based differentiator as the derivative calculator, with ∂ notation and one change: every letter other than the one you choose is treated as a constant. Each rule it applies is shown as a step.",
      "For second partials, choose a second variable. The calculator differentiates with respect to the first variable, simplifies, then differentiates with respect to the second, showing both stages.",
      "Each stage is checked numerically: the other variables are fixed at test values, and the result is compared with a finite-difference estimate in the chosen direction. Supported variable names are x, y, z, t, u and θ.",
    ],
    examples: [
      {
        title: "Partial derivative with respect to x",
        problem: t`\frac{\partial}{\partial x}\left[x^{2}y + 3x y^{3}\right]`,
        steps: [
          { text: "Treat y as a constant. In x²y, the factor y stays; in 3xy³, the factor 3y³ stays.", math: t`2x\cdot y + 3y^{3}\cdot 1` },
        ],
        answer: t`f_{x} = 2xy + 3y^{3}`,
        check: { operation: "partial-derivative", expression: "x^2 y + 3x y^3", variable: "x", expected: "2x y + 3y^3" },
      },
      {
        title: "Partial derivative with respect to y",
        problem: t`\frac{\partial}{\partial y}\left[x^{2}y + 3x y^{3}\right]`,
        steps: [
          { text: "Now x is the constant. x²·y gives x², and 3x·y³ gives 3x·3y².", math: t`x^{2}\cdot 1 + 3x\cdot 3y^{2}` },
        ],
        answer: t`f_{y} = x^{2} + 9xy^{2}`,
        check: { operation: "partial-derivative", expression: "x^2 y + 3x y^3", variable: "y", expected: "x^2 + 9x y^2" },
      },
      {
        title: "Mixed second partial",
        problem: t`f_{xy}\ \text{for}\ f = x^{2}y + 3x y^{3}`,
        steps: [
          { text: "Start from fx = 2xy + 3y³ and differentiate with respect to y:", math: t`\frac{\partial}{\partial y}\left[2xy + 3y^{3}\right] = 2x + 9y^{2}` },
          { text: "Differentiating fy = x² + 9xy² with respect to x gives the same 2x + 9y², as Clairaut's theorem predicts." },
        ],
        answer: t`f_{xy} = 2x + 9y^{2}`,
        check: { operation: "partial-derivative", expression: "x^2 y + 3x y^3", variable: "x", variable2: "y", expected: "2x + 9y^2" },
      },
      {
        title: "Chain rule inside a partial",
        problem: t`\frac{\partial}{\partial x}\,e^{x y^{2}}`,
        steps: [
          { text: "The outer function is eᵘ with u = xy². Holding y constant, ∂u/∂x = y².", math: t`e^{x y^{2}}\cdot y^{2}` },
        ],
        answer: t`f_{x} = y^{2}e^{x y^{2}}`,
        check: { operation: "partial-derivative", expression: "e^(x y^2)", variable: "x", expected: "y^2 e^(x y^2)" },
      },
      {
        title: "Three variables",
        problem: t`\frac{\partial}{\partial z}\left[xyz + \sin(xz)\right]`,
        steps: [
          { text: "x and y are constants. xyz gives xy; sin(xz) needs the chain rule with ∂(xz)/∂z = x.", math: t`xy + \cos(xz)\cdot x` },
        ],
        answer: t`f_{z} = xy + x\cos(xz)`,
        check: { operation: "partial-derivative", expression: "x y z + sin(x z)", variable: "z", expected: "x y + x cos(x z)" },
      },
      {
        title: "Second partial fxx",
        problem: t`f_{xx}\ \text{for}\ f = \ln\left(x^{2} + y^{2}\right)`,
        steps: [
          { text: "First partial:", math: t`f_{x} = \frac{2x}{x^{2} + y^{2}}` },
          { text: "Quotient rule with respect to x again:", math: t`f_{xx} = \frac{2\left(x^{2} + y^{2}\right) - 2x\cdot 2x}{\left(x^{2} + y^{2}\right)^{2}}` },
        ],
        answer: t`f_{xx} = \frac{2y^{2} - 2x^{2}}{\left(x^{2} + y^{2}\right)^{2}}`,
        check: { operation: "partial-derivative", expression: "ln(x^2 + y^2)", variable: "x", variable2: "x", expected: "(2y^2 - 2x^2)/(x^2+y^2)^2" },
      },
    ],
    mistakes: [
      { title: "Differentiating the constant variables", text: "In ∂/∂x of x²y³, the y³ is a constant factor. Writing 3y² anywhere in the answer means y was differentiated by mistake." },
      { title: "Dropping the inner partial in the chain rule", text: "∂/∂x of sin(xy) is y·cos(xy), not cos(xy). The inner function xy still contributes its partial derivative." },
      { title: "Reading fxy in the wrong order", text: "fxy means x first, then y. The results usually agree, but on tests with discontinuous functions the order matters." },
      { title: "Losing terms that don't contain the variable", text: "Terms with no x, such as 5y² in ∂/∂x, differentiate to 0. They do not stay in the answer." },
    ],
    limitations: [
      "Up to second-order partials (fx, fxx, fxy and so on). Higher orders can be found by running the result through the calculator again.",
      "Variables can be x, y, z, t, u or θ. Other letters are treated as constants.",
      "Gradients, Hessians, directional derivatives and the multivariable chain rule are not computed as such, but you can assemble them from the partials.",
    ],
    faqs: [
      { q: "How do you find a partial derivative?", a: "Pick the variable to differentiate with respect to, treat every other variable as a constant, and apply the usual derivative rules. The calculator shows each rule applied." },
      { q: "What is the difference between ∂ and d?", a: "d is used for functions of one variable. ∂ signals a function of several variables, where the others are held constant while you differentiate." },
      { q: "How do I get a mixed partial like fxy?", a: "Choose x as the first variable and y under “Then with respect to”. The calculator differentiates with respect to x, then y, and shows both stages." },
      { q: "Is fxy always equal to fyx?", a: "For functions with continuous second partial derivatives, yes; this is Clairaut's theorem. Every function in a typical course meets that condition where it is defined." },
    ],
    related: ["derivative-calculator", "implicit-differentiation-calculator", "chain-rule-calculator"],
  },

  {
    slug: "chain-rule-calculator",
    metaTitle: "Chain Rule Calculator with Steps – Differentiate Compositions",
    metaDescription:
      "Differentiate composite functions with the chain rule step by step. See the outer and inner functions named at every layer, including nested compositions.",
    h1: "Chain Rule Calculator",
    intro:
      "Enter a composite function such as sin(x²) or (3x² + 1)⁵ to see the chain rule applied layer by layer. Each step names the outer function, the inner function and the derivative it multiplies by.",
    operations: ["derivative"],
    solverExamples: [
      { label: "(3x^2 + 1)^5", operation: "derivative", expression: "(3x^2 + 1)^5" },
      { label: "e^(sin(x))", operation: "derivative", expression: "e^(sin(x))" },
      { label: "sqrt(x^3 + 2x)", operation: "derivative", expression: "sqrt(x^3 + 2x)" },
      { label: "sin(2x)^3", operation: "derivative", expression: "sin(2x)^3" },
      { label: "tan(e^x)", operation: "derivative", expression: "tan(e^x)" },
    ],
    definition: {
      heading: "What is the chain rule?",
      paragraphs: [
        "The chain rule differentiates a composition: a function applied to the output of another function, such as sin(x²), where sin is applied to x². You differentiate the outer function while leaving the inside untouched, then multiply by the derivative of the inside.",
        "In Leibniz notation, if y depends on u and u depends on x, the rates multiply: if y changes 3 times as fast as u, and u changes 2 times as fast as x, then y changes 6 times as fast as x.",
      ],
      formula: t`\frac{d}{dx}\,f\big(g(x)\big) = f'\big(g(x)\big)\cdot g'(x) \qquad\text{or}\qquad \frac{dy}{dx} = \frac{dy}{du}\cdot\frac{du}{dx}`,
    },
    rules: {
      heading: "Common chain rule patterns",
      intro: "Most chain rule problems are one of these patterns, sometimes nested inside each other.",
      items: [
        { name: "General power rule", latex: t`\frac{d}{dx}\big[g(x)^{n}\big] = n\,g(x)^{n-1}g'(x)`, text: "For powers and roots of an expression, such as (3x + 1)⁴ or √(x² + 1)." },
        { name: "Exponential", latex: t`\frac{d}{dx}\,e^{g(x)} = e^{g(x)}\,g'(x)`, text: "e to any power is unchanged, then multiplied by the derivative of the exponent." },
        { name: "Natural logarithm", latex: t`\frac{d}{dx}\ln g(x) = \frac{g'(x)}{g(x)}`, text: "The derivative of the inside, divided by the inside." },
        { name: "Trigonometric", latex: t`\frac{d}{dx}\sin g(x) = \cos g(x)\cdot g'(x)`, text: "The same pattern holds for cos, tan and the others." },
        { name: "Nested chains", latex: t`\frac{d}{dx}\,f\Big(g\big(h(x)\big)\Big) = f'\big(g(h(x))\big)\cdot g'\big(h(x)\big)\cdot h'(x)`, text: "Work from the outside in, one layer at a time, multiplying as you go." },
      ],
    },
    howItWorks: [
      "The calculator reads your expression as a tree and works from the outermost operation inward. Whenever a function is applied to something other than the plain variable, it applies the chain rule and records the step, naming the inner function u.",
      "The derivative of the inner function becomes its own step, so nested chains appear as a sequence of layers, indented to show the nesting. Products and quotients that contain compositions show the product or quotient rule first, with the chain rule steps inside.",
    ],
    examples: [
      {
        title: "General power rule",
        problem: t`\frac{d}{dx}\left(3x^{2} + 1\right)^{5}`,
        steps: [
          { text: "Outer: u⁵, inner: u = 3x² + 1 with u′ = 6x.", math: t`5\left(3x^{2} + 1\right)^{4}\cdot 6x` },
        ],
        answer: t`30x\left(3x^{2} + 1\right)^{4}`,
        check: { operation: "derivative", expression: "(3x^2 + 1)^5", expected: "30x (3x^2+1)^4" },
      },
      {
        title: "Exponential of a trig function",
        problem: t`\frac{d}{dx}\,e^{\sin x}`,
        steps: [{ text: "Outer: eᵘ, inner: u = sin x with u′ = cos x.", math: t`e^{\sin x}\cdot\cos x` }],
        answer: t`\cos x\,e^{\sin x}`,
        check: { operation: "derivative", expression: "e^(sin(x))", expected: "cos(x) e^(sin(x))" },
      },
      {
        title: "Square root of a polynomial",
        problem: t`\frac{d}{dx}\sqrt{x^{3} + 2x}`,
        steps: [
          { text: "Rewrite as (x³ + 2x)^(1/2). Outer: u^(1/2), inner u′ = 3x² + 2.", math: t`\frac{1}{2}\left(x^{3} + 2x\right)^{-1/2}\cdot\left(3x^{2} + 2\right)` },
        ],
        answer: t`\frac{3x^{2} + 2}{2\sqrt{x^{3} + 2x}}`,
        check: { operation: "derivative", expression: "sqrt(x^3 + 2x)", expected: "(3x^2 + 2)/(2 sqrt(x^3 + 2x))" },
      },
      {
        title: "Three layers",
        problem: t`\frac{d}{dx}\sin^{3}(2x)`,
        steps: [
          { text: "sin³(2x) means (sin(2x))³. Outermost: u³, giving 3 sin²(2x).", math: t`3\sin^{2}(2x)\cdot\frac{d}{dx}\sin(2x)` },
          { text: "Next layer: sin(v) with v = 2x, giving cos(2x)·2.", math: t`3\sin^{2}(2x)\cdot\cos(2x)\cdot 2` },
        ],
        answer: t`6\sin^{2}(2x)\cos(2x)`,
        check: { operation: "derivative", expression: "sin(2x)^3", expected: "6 sin(2x)^2 cos(2x)" },
      },
      {
        title: "Product rule with a chain inside",
        problem: t`\frac{d}{dx}\Big[x^{2}\cos(3x)\Big]`,
        steps: [
          { text: "Product rule first; the chain rule gives (cos 3x)′ = −3 sin 3x.", math: t`2x\cos(3x) + x^{2}\cdot\big(-3\sin(3x)\big)` },
        ],
        answer: t`2x\cos(3x) - 3x^{2}\sin(3x)`,
        check: { operation: "derivative", expression: "x^2 cos(3x)", expected: "2x cos(3x) - 3x^2 sin(3x)" },
      },
      {
        title: "Tangent of an exponential",
        problem: t`\frac{d}{dx}\tan\left(e^{x}\right)`,
        steps: [{ text: "Outer: tan u with derivative sec²u; inner: u = eˣ with u′ = eˣ.", math: t`\sec^{2}\left(e^{x}\right)\cdot e^{x}` }],
        answer: t`e^{x}\sec^{2}\left(e^{x}\right)`,
        check: { operation: "derivative", expression: "tan(e^x)", expected: "e^x sec(e^x)^2" },
      },
    ],
    mistakes: [
      { title: "Forgetting the inner derivative", text: "d/dx[(3x² + 1)⁵] is not 5(3x² + 1)⁴. The factor 6x from the inside is what makes it the chain rule." },
      { title: "Differentiating the inside too early", text: "d/dx[sin(x²)] is cos(x²)·2x, not cos(2x). The outer derivative keeps the original inside." },
      { title: "Stopping after two layers", text: "In sin³(2x) there are three layers: the cube, the sine and the 2x. Each contributes a factor." },
      { title: "Confusing sin²x with sin(x²)", text: "sin²x = (sin x)² has outer function u², while sin(x²) has outer function sin u. Their derivatives are completely different." },
    ],
    limitations: [
      "This page uses the general derivative engine, so products, quotients and other rules appear alongside the chain rule when the function needs them.",
      "Long nested expressions can produce many steps; very long step lists are shortened, but the final answer still includes every step.",
      "For compositions of functions of several variables (the multivariable chain rule), use the partial derivative calculator on each piece.",
    ],
    faqs: [
      { q: "When do you use the chain rule?", a: "Whenever a function is applied to something other than plain x: sin(3x), e^(x²), (x² + 1)⁵, ln(cos x). If the input to a function is itself an expression, you need the chain rule." },
      { q: "What is the formula for the chain rule?", a: "d/dx f(g(x)) = f′(g(x))·g′(x). In Leibniz form, dy/dx = dy/du·du/dx, where u is the inner function." },
      { q: "How do you use the chain rule more than once?", a: "Work from the outside in. Differentiate the outermost function, keep everything inside it unchanged, multiply by the derivative of the next layer, and repeat until you reach x." },
      { q: "Is the chain rule the same as the product rule?", a: "No. The product rule is for two functions multiplied together, like x²·sin x. The chain rule is for one function inside another, like sin(x²). Many problems need both." },
    ],
    related: ["derivative-calculator", "implicit-differentiation-calculator", "partial-derivative-calculator"],
    guide: { href: "/guides/derivative-rules", label: "Derivative rules explained with examples" },
    articles: ["how-to-find-the-derivative-of-a-function"],
  },

  {
    slug: "implicit-differentiation-calculator",
    metaTitle: "Implicit Differentiation Calculator with Steps – Find dy/dx",
    metaDescription:
      "Find dy/dx for equations like x² + y² = 25 step by step, then get the slope and tangent line at a point on the curve. Free and runs in your browser.",
    h1: "Implicit Differentiation Calculator",
    intro:
      "Enter an equation in x and y, such as x² + y² = 25 or x³ + y³ = 6xy, to find dy/dx. Add a point on the curve to get the slope and the equation of the tangent line there.",
    operations: ["implicit"],
    solverExamples: [
      { label: "x^2 + y^2 = 25", operation: "implicit", expression: "x^2 + y^2 = 25" },
      { label: "x^2 + y^2 = 25 at (3, 4)", operation: "implicit", expression: "x^2 + y^2 = 25", point: "3, 4" },
      { label: "x^3 + y^3 = 6xy", operation: "implicit", expression: "x^3 + y^3 = 6xy" },
      { label: "sin(x y) = x", operation: "implicit", expression: "sin(x y) = x" },
      { label: "e^y + x y = e at (0, 1)", operation: "implicit", expression: "e^y + x y = e", point: "0, 1" },
    ],
    definition: {
      heading: "What is implicit differentiation?",
      paragraphs: [
        "Some curves are defined by an equation that is not solved for y, such as the circle x² + y² = 25. Solving for y can be awkward or impossible, but you can still find the slope dy/dx by treating y as an unknown function of x.",
        "Differentiate both sides of the equation with respect to x. Every time you differentiate a term containing y, the chain rule attaches a factor dy/dx. Then solve the resulting equation for dy/dx. The answer usually contains both x and y, which is expected.",
      ],
      formula: t`F(x, y) = 0 \quad\Longrightarrow\quad \frac{dy}{dx} = -\frac{F_{x}}{F_{y}}`,
    },
    rules: {
      heading: "The rules you need",
      intro: "Implicit differentiation uses the ordinary rules, plus one idea: y is a function of x.",
      items: [
        { name: "Powers of y", latex: t`\frac{d}{dx}\left[y^{n}\right] = n\,y^{n-1}\frac{dy}{dx}`, text: "The chain rule, with y as the inner function." },
        { name: "Products of x and y", latex: t`\frac{d}{dx}\left[xy\right] = y + x\frac{dy}{dx}`, text: "Use the product rule; the y factor contributes dy/dx." },
        { name: "Solve for dy/dx", latex: t`\frac{dy}{dx}\big(\ldots\big) = \ldots`, text: "Move every term containing dy/dx to one side, factor it out, and divide." },
        { name: "Formula method", latex: t`\frac{dy}{dx} = -\frac{\partial F/\partial x}{\partial F/\partial y}`, text: "Write the equation as F(x, y) = 0. This gives the same answer as differentiating both sides." },
        { name: "Horizontal and vertical tangents", latex: t`\frac{dy}{dx} = 0 \ \text{(horizontal)},\qquad F_{y} = 0 \ \text{(vertical)}`, text: "Horizontal tangents occur where the numerator is zero; vertical tangents where the denominator is zero." },
      ],
    },
    howItWorks: [
      "The calculator moves every term to one side to get F(x, y) = 0, then computes the partial derivatives F_x (holding y constant) and F_y (holding x constant), showing each rule applied. It combines them as dy/dx = −F_x / F_y, simplifies, and cancels common numerical factors.",
      "If you give a point, the calculator first checks that it lies on the curve, then substitutes it exactly to get the slope and the tangent line. If F_y is zero there, it reports a vertical tangent instead of dividing by zero.",
      "The answer is checked numerically: the calculator finds points on the curve, follows the curve a tiny step either side of each one, and confirms that the slope it measures matches the formula.",
    ],
    examples: [
      {
        title: "The circle",
        problem: t`x^{2} + y^{2} = 25`,
        steps: [
          { text: "Differentiate both sides with respect to x; y² gives 2y·dy/dx by the chain rule.", math: t`2x + 2y\frac{dy}{dx} = 0` },
          { text: "Solve for dy/dx.", math: t`\frac{dy}{dx} = -\frac{2x}{2y}` },
          { text: "At the point (3, 4) the slope is −3/4, so the tangent line is y = −(3/4)x + 25/4." },
        ],
        answer: t`\frac{dy}{dx} = -\frac{x}{y}`,
        check: { operation: "implicit", expression: "x^2 + y^2 = 25", expected: "-x/y" },
      },
      {
        title: "The folium of Descartes",
        problem: t`x^{3} + y^{3} = 6xy`,
        steps: [
          { text: "Differentiate both sides; the right side needs the product rule.", math: t`3x^{2} + 3y^{2}\frac{dy}{dx} = 6y + 6x\frac{dy}{dx}` },
          { text: "Collect the dy/dx terms and factor.", math: t`\frac{dy}{dx}\left(3y^{2} - 6x\right) = 6y - 3x^{2}` },
          { text: "Divide, and cancel the common factor 3." },
        ],
        answer: t`\frac{dy}{dx} = \frac{2y - x^{2}}{y^{2} - 2x}`,
        check: { operation: "implicit", expression: "x^3 + y^3 = 6xy", expected: "(2y - x^2)/(y^2 - 2x)" },
      },
      {
        title: "Product rule terms",
        problem: t`x^{2}y + y^{3} = 4x`,
        steps: [
          { text: "Product rule on x²y, chain rule on y³:", math: t`2xy + x^{2}\frac{dy}{dx} + 3y^{2}\frac{dy}{dx} = 4` },
          { text: "Factor out dy/dx:", math: t`\frac{dy}{dx}\left(x^{2} + 3y^{2}\right) = 4 - 2xy` },
        ],
        answer: t`\frac{dy}{dx} = \frac{4 - 2xy}{x^{2} + 3y^{2}}`,
        check: { operation: "implicit", expression: "x^2 y + y^3 = 4x", expected: "(4 - 2x y)/(x^2 + 3y^2)" },
      },
      {
        title: "A trigonometric equation",
        problem: t`\sin(xy) = x`,
        steps: [
          { text: "Chain rule on the left; the inner function xy needs the product rule.", math: t`\cos(xy)\left(y + x\frac{dy}{dx}\right) = 1` },
          { text: "Expand and solve for dy/dx.", math: t`x\cos(xy)\frac{dy}{dx} = 1 - y\cos(xy)` },
        ],
        answer: t`\frac{dy}{dx} = \frac{1 - y\cos(xy)}{x\cos(xy)}`,
        check: { operation: "implicit", expression: "sin(x y) = x", expected: "(1 - y cos(x y))/(x cos(x y))" },
      },
      {
        title: "An exponential equation",
        problem: t`e^{y} + xy = e`,
        steps: [
          { text: "Differentiate: eʸ gives eʸ·dy/dx, and xy gives y + x·dy/dx.", math: t`e^{y}\frac{dy}{dx} + y + x\frac{dy}{dx} = 0` },
          { text: "Solve for dy/dx. At the point (0, 1), this gives −1/e." },
        ],
        answer: t`\frac{dy}{dx} = -\frac{y}{x + e^{y}}`,
        check: { operation: "implicit", expression: "e^y + x y = e", expected: "-y/(x + e^y)" },
      },
    ],
    mistakes: [
      { title: "Forgetting dy/dx on y terms", text: "d/dx[y²] is 2y·dy/dx, not 2y. Every term containing y needs the chain rule factor." },
      { title: "Missing the product rule on xy", text: "d/dx[xy] = y + x·dy/dx. Writing just dy/dx, or just y, loses a term." },
      { title: "Differentiating the constant side", text: "In x² + y² = 25, the right side becomes 0. Constants on either side always differentiate to zero." },
      { title: "Plugging in a point that's not on the curve", text: "The slope formula only means something at points that satisfy the equation. Check the point first; the calculator does this for you." },
    ],
    limitations: [
      "Finds dy/dx with x as the independent variable and y as the dependent one. For dx/dy, swap the roles of x and y in your equation.",
      "Second derivatives d²y/dx² of implicit equations are not computed.",
      "Other letters (such as a or r) are treated as constants.",
      "The numerical check needs real points on the curve between x = −20 and 20; if none are found, the result is shown without that check.",
    ],
    faqs: [
      { q: "When do you use implicit differentiation?", a: "When y is not given explicitly as a function of x, as in x² + y² = 25 or x³ + y³ = 6xy. It is also used for related rates problems and for proving derivative formulas such as that of arctan." },
      { q: "Why does the answer contain y?", a: "Because y depends on x through the equation, the slope at a point depends on both coordinates. On the circle x² + y² = 25, the points (3, 4) and (3, −4) have different slopes, which −x/y captures." },
      { q: "How do I find the slope at a specific point?", a: "Enter the point in the “At the point” box, for example 3, 4. The calculator checks the point is on the curve, then gives the slope and the tangent line there." },
      { q: "Is the formula −F_x/F_y the same as differentiating both sides?", a: "Yes. Both methods give the same dy/dx. The worked examples on this page show the both-sides method; the calculator's steps use the formula, which shows each partial derivative clearly." },
    ],
    related: ["derivative-calculator", "partial-derivative-calculator", "chain-rule-calculator"],
  },
];
