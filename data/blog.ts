// Blog posts. They share the article layout and data shape with the guides,
// but target "how to" questions rather than reference material.
// Worked examples are machine-checked by tests/content.test.ts.

import type { Guide } from "./guides";

const t = String.raw;

export const posts: Guide[] = [
  {
    slug: "how-to-find-the-derivative-of-a-function",
    titleClass: "text-blog-derivative",
    image: { src: "/images/blog-derivative.webp", alt: "Secant lines through a curve getting closer to a single point until they become the tangent line, which is how the derivative is defined", width: 1536, height: 1024 },
    published: "2026-11-02",
    title: "How to Find the Derivative of a Function (Step-by-Step Guide with Examples)",
    metaTitle: "How to Find the Derivative of a Function: Step-by-Step Guide",
    description:
      "Learn how to find the derivative of any function step by step: the limit definition, a method for choosing the right rule, worked examples, and how to check your answer.",
    intro:
      "Finding a derivative is a skill you can learn as a repeatable process. This guide starts with what a derivative means, shows the limit definition once so you know where the rules come from, then gives a step-by-step method that works on any function you'll meet in a first calculus course. Seven fully worked examples follow.",
    sections: [
      {
        id: "what-it-means",
        heading: "What the derivative of a function tells you",
        blocks: [
          {
            type: "p",
            text: "The derivative of a function f measures how fast f(x) changes as x changes. At any point, it equals the slope of the tangent line to the graph. If f(t) is the position of a car at time t, then f′(t) is its velocity; if C(q) is the cost of producing q items, C′(q) is the marginal cost.",
          },
          { type: "p", text: "You will see three common notations. They all mean the same thing:" },
          { type: "math", latex: t`f'(x) \qquad \frac{dy}{dx} \qquad \frac{d}{dx}\big[f(x)\big]` },
          {
            type: "p",
            text: "f′(x) (“f prime of x”) is Lagrange's notation. dy/dx is Leibniz's notation, which is handy when y is defined by an equation such as y = x². The operator d/dx[…] means “take the derivative of what's in the brackets with respect to x”.",
          },
        ],
      },
      {
        id: "first-principles",
        heading: "Method 1: Find the derivative from the definition",
        blocks: [
          { type: "p", text: "The derivative is defined as a limit of slopes of secant lines, taken as the two points move together:" },
          { type: "math", latex: t`f'(x) = \lim_{h \to 0} \frac{f(x + h) - f(x)}{h}` },
          {
            type: "p",
            text: "Using this definition directly is called differentiating “from first principles”. It always follows the same four steps:",
          },
          {
            type: "list",
            items: [
              "Step 1: Write out f(x + h) by replacing every x with (x + h).",
              "Step 2: Subtract f(x) and simplify. Every term without an h should cancel.",
              "Step 3: Divide by h. Factor h out of the numerator first if needed.",
              "Step 4: Let h → 0. Whatever is left is f′(x).",
            ],
          },
          { type: "p", text: "Here is the method applied to f(x) = x² + 3x. Step 1:" },
          { type: "math", latex: t`f(x + h) = (x + h)^{2} + 3(x + h) = x^{2} + 2xh + h^{2} + 3x + 3h` },
          { type: "p", text: "Step 2: subtract f(x) = x² + 3x. The x² and 3x terms cancel:" },
          { type: "math", latex: t`f(x + h) - f(x) = 2xh + h^{2} + 3h` },
          { type: "p", text: "Steps 3 and 4: divide by h, then let h approach 0:" },
          { type: "math", latex: t`\frac{2xh + h^{2} + 3h}{h} = 2x + h + 3 \;\xrightarrow{\;h \to 0\;}\; 2x + 3` },
          {
            type: "p",
            text: "So f′(x) = 2x + 3. This method is worth doing a few times, because it shows why the rules work. In practice, though, nobody uses it for every problem: the differentiation rules below give the same answers in a fraction of the time.",
          },
        ],
      },
      {
        id: "step-by-step",
        heading: "Method 2: A step-by-step process using the rules",
        blocks: [
          { type: "p", text: "This six-step process handles every function built from powers, roots, exponentials, logarithms and trig functions:" },
          {
            type: "list",
            items: [
              "Step 1: Rewrite. Turn roots and fractions into powers (√x = x^(1/2), 3/x² = 3x^(−2)) and simplify anything that can be simplified.",
              "Step 2: Find the outermost operation. Ask what the last thing you'd do is if you evaluated the function by hand: add, multiply, divide, raise to a power, or apply a function such as sin.",
              "Step 3: Apply the rule that matches that operation (see the table below).",
              "Step 4: Repeat for the inner pieces. Each rule leaves you with smaller derivatives to find; handle them the same way.",
              "Step 5: Simplify. Collect like terms, factor where it helps, and write the answer neatly.",
              "Step 6: Check. Plug in a value, or compare with a numerical estimate or a calculator.",
            ],
          },
          {
            type: "p",
            text: "Step 2 is where most mistakes happen. In sin(x²), the last operation is taking the sine, so the chain rule comes first. In x²·sin(x), the last operation is multiplying, so the product rule comes first.",
          },
        ],
      },
      {
        id: "which-rule",
        heading: "Which differentiation rule should you use?",
        blocks: [
          {
            type: "table",
            caption: "Choosing a differentiation rule from the form of the function",
            headers: ["The function looks like", "Rule", "Derivative"],
            rows: [
              [t`c \text{ (a constant)}`, t`\text{Constant rule}`, t`0`],
              [t`x^{n}`, t`\text{Power rule}`, t`n x^{n-1}`],
              [t`c\,f(x)`, t`\text{Constant multiple}`, t`c\,f'(x)`],
              [t`f(x) \pm g(x)`, t`\text{Sum / difference}`, t`f'(x) \pm g'(x)`],
              [t`f(x)\,g(x)`, t`\text{Product rule}`, t`f'g + fg'`],
              [t`\dfrac{f(x)}{g(x)}`, t`\text{Quotient rule}`, t`\dfrac{f'g - fg'}{g^{2}}`],
              [t`f\big(g(x)\big)`, t`\text{Chain rule}`, t`f'\big(g(x)\big)\,g'(x)`],
              [t`e^{x},\ \ln x`, t`\text{Exponential, log}`, t`e^{x},\ \dfrac{1}{x}`],
              [t`\sin x,\ \cos x`, t`\text{Trig}`, t`\cos x,\ -\sin x`],
              [t`u(x)^{v(x)}`, t`\text{Logarithmic differentiation}`, t`u^{v}\left(v'\ln u + \dfrac{v\,u'}{u}\right)`],
            ],
          },
          {
            type: "p",
            text: "For each rule explained in detail, with its own examples and the derivatives of every trig and inverse trig function, see",
            link: { href: "/guides/derivative-rules", label: "our guide to derivative rules" },
          },
        ],
      },
      {
        id: "rewrite-first",
        heading: "Rewrite before you differentiate",
        blocks: [
          {
            type: "p",
            text: "A minute spent rewriting often turns a quotient rule or chain rule problem into a simple power rule problem. These rewrites come up constantly:",
          },
          {
            type: "math",
            latex: t`\sqrt{x} = x^{1/2} \qquad \frac{1}{x^{3}} = x^{-3} \qquad \frac{4}{\sqrt{x}} = 4x^{-1/2} \qquad \frac{x^{2} + x}{x} = x + 1 \ (x \neq 0) \qquad \ln\left(x^{3}\right) = 3\ln x \ (x > 0)`,
          },
          {
            type: "p",
            text: "For example, d/dx[1/x³] by the quotient rule takes several lines. Rewritten as x^(−3), the power rule gives −3x^(−4) = −3/x⁴ immediately.",
          },
        ],
      },
      {
        id: "at-a-point",
        heading: "Finding the derivative at a point (and the tangent line)",
        blocks: [
          {
            type: "p",
            text: "To find the slope at a specific point, find f′(x) first, then substitute. Never substitute first: f(2) is a constant, and the derivative of a constant is 0. Take f(x) = x³ − 2x at x = 2:",
          },
          { type: "math", latex: t`f'(x) = 3x^{2} - 2 \quad\Rightarrow\quad f'(2) = 3(4) - 2 = 10` },
          {
            type: "p",
            text: "The slope of the graph at x = 2 is 10. Since f(2) = 8 − 4 = 4, the tangent line passes through (2, 4), and point–slope form gives its equation:",
          },
          { type: "math", latex: t`y - 4 = 10(x - 2) \quad\Longrightarrow\quad y = 10x - 16` },
        ],
      },
      {
        id: "higher-order",
        heading: "Second and higher-order derivatives",
        blocks: [
          {
            type: "p",
            text: "The second derivative f″(x) is the derivative of f′(x). It measures how the slope itself is changing: f″ > 0 means the graph curves upward (concave up), and for a position function, f″ is acceleration. To find it, simply differentiate the simplified first derivative again.",
          },
          { type: "math", latex: t`f''(x) = \frac{d^{2}y}{dx^{2}} = \frac{d}{dx}\big[f'(x)\big]` },
          {
            type: "p",
            text: "Simplify f′(x) fully before differentiating again; it makes the second step much shorter. Third and higher derivatives work the same way.",
          },
          {
            type: "p",
            text: "The second derivative is also how you tell a local maximum from a local minimum. To find and classify those points for any function, use",
            link: { href: "/critical-points-calculator", label: "the critical points calculator" },
          },
        ],
      },
      {
        id: "check-your-answer",
        heading: "How to check your derivative",
        blocks: [
          {
            type: "p",
            text: "A quick numerical check catches most mistakes. Pick a value such as x = 1 and compute the symmetric difference quotient with a small step, for example h = 0.001:",
          },
          { type: "math", latex: t`f'(1) \approx \frac{f(1.001) - f(0.999)}{0.002}` },
          {
            type: "p",
            text: "For f(x) = x² + 3x, this gives (4.005001 − 3.995001) / 0.002 = 5.000, which matches f′(1) = 2(1) + 3 = 5. If the two numbers disagree, recheck your work. You can also graph f and f′ together: wherever f is increasing, f′ should be positive, and wherever f has a peak or valley, f′ should be zero.",
          },
          {
            type: "p",
            text: "To compare every step with your own working, enter the function in",
            link: { href: "/derivative-calculator", label: "the derivative calculator" },
          },
        ],
      },
      {
        id: "mistakes",
        heading: "Common mistakes to avoid",
        blocks: [
          {
            type: "list",
            items: [
              "Stopping the chain rule too early: d/dx[cos(5x)] is −5 sin(5x), not −sin(5x).",
              "Differentiating a product factor by factor: d/dx[x·eˣ] is eˣ + x·eˣ, not 1·eˣ.",
              "Swapping the quotient rule numerator: it is f′g − fg′, in that order.",
              "Using the power rule on exponentials: d/dx[2ˣ] is 2ˣ ln 2, not x·2ˣ⁻¹. The power rule needs the variable in the base, not the exponent.",
              "Substituting a number before differentiating, which always gives 0.",
              "Forgetting that the derivative of a constant, including π, e and ln 2, is 0.",
            ],
          },
        ],
      },
    ],
    examples: [
      {
        title: "Power rule after rewriting",
        problem: t`\frac{d}{dx}\left(4x^{3} - \frac{2}{x} + 5\sqrt{x}\right)`,
        steps: [
          { text: "Rewrite every term as a power of x.", math: t`4x^{3} - 2x^{-1} + 5x^{1/2}` },
          { text: "Apply the power rule term by term.", math: t`12x^{2} + 2x^{-2} + \frac{5}{2}x^{-1/2}` },
          { text: "Rewrite the negative and fractional powers." },
        ],
        answer: t`12x^{2} + \frac{2}{x^{2}} + \frac{5}{2\sqrt{x}}`,
        check: { operation: "derivative", expression: "4x^3 - 2/x + 5sqrt(x)", expected: "12x^2 + 2/x^2 + 5/(2sqrt(x))" },
      },
      {
        title: "Product rule",
        problem: t`\frac{d}{dx}\Big[\left(x^{2} + 1\right)\sin x\Big]`,
        steps: [
          { text: "The outermost operation is multiplication. Let f = x² + 1 and g = sin x, so f′ = 2x and g′ = cos x." },
          { text: "Apply (fg)′ = f′g + fg′.", math: t`2x\sin x + \left(x^{2} + 1\right)\cos x` },
        ],
        answer: t`2x\sin x + \left(x^{2} + 1\right)\cos x`,
        check: { operation: "derivative", expression: "(x^2+1) sin(x)", expected: "2x sin(x) + (x^2+1) cos(x)" },
      },
      {
        title: "Quotient rule",
        problem: t`\frac{d}{dx}\,\frac{3x - 1}{x^{2} + 1}`,
        steps: [
          { text: "Top f = 3x − 1, so f′ = 3. Bottom g = x² + 1, so g′ = 2x.", math: t`\frac{3\left(x^{2} + 1\right) - (3x - 1)(2x)}{\left(x^{2} + 1\right)^{2}}` },
          { text: "Expand the numerator: 3x² + 3 − 6x² + 2x = −3x² + 2x + 3." },
        ],
        answer: t`\frac{-3x^{2} + 2x + 3}{\left(x^{2} + 1\right)^{2}}`,
        check: { operation: "derivative", expression: "(3x-1)/(x^2+1)", expected: "(-3x^2 + 2x + 3)/(x^2+1)^2" },
      },
      {
        title: "Chain rule",
        problem: t`\frac{d}{dx}\left(2x^{2} - 5\right)^{4}`,
        steps: [
          { text: "The outermost operation is raising to the 4th power. The inner function is u = 2x² − 5, with u′ = 4x." },
          { text: "Power rule on the outside, times the derivative of the inside.", math: t`4\left(2x^{2} - 5\right)^{3}\cdot 4x` },
        ],
        answer: t`16x\left(2x^{2} - 5\right)^{3}`,
        check: { operation: "derivative", expression: "(2x^2 - 5)^4", expected: "16x (2x^2-5)^3" },
      },
      {
        title: "Product rule and chain rule together",
        problem: t`\frac{d}{dx}\Big[e^{2x}\cos(3x)\Big]`,
        steps: [
          { text: "Product rule first. Each factor then needs the chain rule: (e^(2x))′ = 2e^(2x) and (cos 3x)′ = −3 sin 3x.", math: t`2e^{2x}\cos(3x) + e^{2x}\cdot\big(-3\sin(3x)\big)` },
          { text: "Factor out e^(2x)." },
        ],
        answer: t`e^{2x}\big(2\cos(3x) - 3\sin(3x)\big)`,
        check: { operation: "derivative", expression: "e^(2x) cos(3x)", expected: "e^(2x)(2cos(3x) - 3sin(3x))" },
      },
      {
        title: "Logarithmic differentiation",
        problem: t`\frac{d}{dx}\,x^{\sin x}`,
        steps: [
          { text: "The variable is in both the base and the exponent, so take logs: if y = x^(sin x), then ln y = sin x · ln x." },
          { text: "Differentiate both sides (product rule on the right):", math: t`\frac{y'}{y} = \cos x\,\ln x + \frac{\sin x}{x}` },
          { text: "Multiply both sides by y = x^(sin x)." },
        ],
        answer: t`x^{\sin x}\left(\cos x\,\ln x + \frac{\sin x}{x}\right)`,
        check: { operation: "derivative", expression: "x^(sin(x))", expected: "x^(sin(x)) (cos(x) ln(x) + sin(x)/x)" },
      },
      {
        title: "Second derivative",
        problem: t`\frac{d^{2}}{dx^{2}}\left(x^{4} - 3x^{2} + \ln x\right)`,
        steps: [
          { text: "First derivative:", math: t`f'(x) = 4x^{3} - 6x + \frac{1}{x}` },
          { text: "Differentiate again. Rewrite 1/x as x^(−1), whose derivative is −x^(−2).", math: t`f''(x) = 12x^{2} - 6 - \frac{1}{x^{2}}` },
        ],
        answer: t`12x^{2} - 6 - \frac{1}{x^{2}}`,
        check: { operation: "derivative", expression: "x^4 - 3x^2 + ln(x)", expected: "12x^2 - 6 - 1/x^2", order: 2 },
      },
    ],
    faqs: [
      {
        q: "What is the easiest way to find the derivative of a function?",
        a: "Rewrite the function using powers, identify its outermost operation, and apply the matching rule: power, product, quotient or chain. Repeat for the inner pieces, then simplify. With practice, most derivatives take only a few lines.",
      },
      {
        q: "Do I need to use the limit definition every time?",
        a: "No. The limit definition explains what a derivative is and is often required on a test when the question says “from first principles” or “using the definition”. Otherwise, use the differentiation rules, which are derived from the definition and give the same answers faster.",
      },
      {
        q: "Is f′(x) the same as dy/dx?",
        a: "Yes. If y = f(x), then f′(x) and dy/dx are two notations for the same derivative. Leibniz's dy/dx is convenient for the chain rule and related rates; f′(x) is shorter when you need to evaluate at a point, as in f′(2).",
      },
      {
        q: "How do I know when to use the chain rule?",
        a: "Use the chain rule whenever a function is applied to something other than plain x: sin(3x), e^(x²), (x² + 1)⁵ or ln(cos x). If you'd write parentheses with more than just x inside, you almost certainly need it.",
      },
      {
        q: "Can a function fail to have a derivative?",
        a: "Yes, at specific points. |x| has a sharp corner at x = 0, the cube root of x has a vertical tangent at 0, and any function with a jump or hole has no derivative there. Everywhere else, these functions can still be differentiated normally.",
      },
    ],
    calculator: { href: "/derivative-calculator", label: "Check your answers with the Derivative Calculator" },
  },
];

export function getPost(slug: string): Guide | undefined {
  return posts.find((p) => p.slug === slug);
}
