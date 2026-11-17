// Blog posts. They share the article layout and data shape with the guides,
// but target "how to" questions rather than reference material.
// Worked examples are machine-checked by tests/content.test.ts.

import type { Guide } from "./guides";

const t = String.raw;

export const posts: Guide[] = [
  {
    slug: "how-to-find-the-derivative-of-a-function",
    titleClass: "text-blog-derivative",
    image: { src: "/images/blog-derivative.webp", alt: "Secant lines through a curve getting closer to a single point until they become the tangent line, which is how the derivative is defined", width: 1536, height: 1024, caption: "As the second point slides toward the first, the secant lines approach the tangent line, whose slope is the derivative." },
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
          {
            type: "p",
            text: "For the full method, including the first derivative test and what to do when f″(c) = 0, read",
            link: { href: "/blog/how-to-find-critical-points-and-classify-them", label: "How to Find Critical Points and Classify Them" },
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
  {
    slug: "how-to-find-critical-points-and-classify-them",
    titleClass: "text-blog-critical",
    image: { src: "/images/blog-critical-points.webp", alt: "A curve with a flat horizontal tangent at a hilltop, at a valley and at a level shelf, marking three critical points", width: 1536, height: 1024, caption: "All three marked points have f′(x) = 0: a local maximum, a local minimum, and a flat point that is neither, because the curve keeps rising through it." },
    published: "2026-11-15",
    title: "How to Find Critical Points and Classify Them (First and Second Derivative Test)",
    metaTitle: "How to Find Critical Points: First & Second Derivative Test",
    description:
      "Learn how to find critical points step by step and classify each one as a local maximum, local minimum or neither using the first and second derivative tests, with worked examples.",
    intro:
      "Critical points are where a function can turn around: the tops of hills, the bottoms of valleys, and a few places that only look like turning points. This guide shows how to find every critical point of a function, then how to decide what each one is with the first derivative test and the second derivative test. Six fully worked examples follow, including the cases where the second derivative test fails.",
    sections: [
      {
        id: "what-is-a-critical-point",
        heading: "What is a critical point?",
        blocks: [
          {
            type: "p",
            text: "A critical point of a function f is a number c in the domain of f where the derivative is either zero or does not exist:",
          },
          { type: "math", latex: t`f'(c) = 0 \qquad \text{or} \qquad f'(c) \text{ does not exist}, \qquad c \in \operatorname{dom} f` },
          {
            type: "p",
            text: "Where f′(c) = 0, the tangent line is horizontal. Where f′(c) does not exist, the graph has a sharp corner, a cusp or a vertical tangent. Both kinds matter, because a function can reach a maximum or minimum at either.",
          },
          {
            type: "p",
            text: "The reason critical points are so useful is Fermat's theorem: if f has a local maximum or local minimum at an interior point c, then c is a critical point. So to find all the peaks and valleys of a graph, you only need to look at the critical points. The reverse is not true, though. A critical point can be neither a maximum nor a minimum, which is why every critical point has to be classified.",
          },
        ],
      },
      {
        id: "how-to-find",
        heading: "How to find critical points, step by step",
        blocks: [
          { type: "p", text: "This four-step process finds every critical point of a function of one variable:" },
          {
            type: "list",
            items: [
              "Step 1: Find the domain of f. Note any values excluded by division by zero, square roots of negatives or logarithms of non-positive numbers.",
              "Step 2: Find f′(x) and simplify it into a single fraction, factored as far as possible.",
              "Step 3: Solve f′(x) = 0. For a fraction, this means setting the numerator equal to zero.",
              "Step 4: Find where f′(x) is undefined, usually where its denominator is zero. Keep only the values that are in the domain of f.",
            ],
          },
          {
            type: "p",
            text: "Every value from Steps 3 and 4 that lies in the domain of f is a critical point. To report the point on the graph, also compute f(c), so the critical point at x = c is the point (c, f(c)).",
          },
          {
            type: "p",
            text: "Step 2 does most of the work. Factoring f′ completely makes Step 3 easy and also tells you the sign of f′ on each interval, which you will need for the first derivative test. If you need a refresher on differentiating, see",
            link: { href: "/blog/how-to-find-the-derivative-of-a-function", label: "how to find the derivative of a function" },
          },
        ],
      },
      {
        id: "first-derivative-test",
        heading: "Classifying critical points with the first derivative test",
        blocks: [
          {
            type: "p",
            text: "The first derivative test looks at the sign of f′ just to the left and just to the right of a critical point c. Since f′ > 0 means f is increasing and f′ < 0 means f is decreasing, a change of sign tells you the graph turned around:",
          },
          {
            type: "table",
            caption: "The first derivative test at a critical point c",
            headers: ["Sign of f′ left of c", "Sign of f′ right of c", "c is a"],
            rows: [
              [t`+`, t`-`, t`\text{local maximum}`],
              [t`-`, t`+`, t`\text{local minimum}`],
              [t`+`, t`+`, t`\text{neither (still increasing)}`],
              [t`-`, t`-`, t`\text{neither (still decreasing)}`],
            ],
          },
          {
            type: "p",
            text: "The easiest way to apply it is a sign chart. Mark every critical point, and every point where f itself is undefined, on a number line. These split the line into intervals. In each interval, pick any test value and substitute it into the factored f′; only the sign matters, not the size. Then read off the pattern of signs around each critical point.",
          },
          {
            type: "p",
            text: "The first derivative test always gives an answer, and it works at points where f′ does not exist, such as corners and cusps. That makes it the more reliable of the two tests.",
          },
        ],
      },
      {
        id: "second-derivative-test",
        heading: "Classifying critical points with the second derivative test",
        blocks: [
          {
            type: "p",
            text: "The second derivative test uses concavity instead of a sign chart. If the graph is concave up (shaped like a cup) at a point with a horizontal tangent, that point must be the bottom of a valley; if it is concave down (shaped like a cap), it must be the top of a hill. For a critical point c with f′(c) = 0:",
          },
          {
            type: "table",
            caption: "The second derivative test at a point where f′(c) = 0",
            headers: ["Value of f″(c)", "Shape of the graph", "c is a"],
            rows: [
              [t`f''(c) > 0`, t`\text{concave up}`, t`\text{local minimum}`],
              [t`f''(c) < 0`, t`\text{concave down}`, t`\text{local maximum}`],
              [t`f''(c) = 0`, t`\text{unknown}`, t`\text{inconclusive: use the first derivative test}`],
            ],
          },
          {
            type: "p",
            text: "To apply it, find f″(x), substitute each critical point and look only at the sign of the result. It is usually faster than a sign chart, especially when there are many critical points or when f′ is hard to factor.",
          },
          {
            type: "p",
            text: "The test has two limits. It only applies where f′(c) = 0, so it cannot classify a corner or cusp where f′ does not exist. And when f″(c) = 0, it says nothing at all: x⁴, −x⁴ and x³ all have f′(0) = f″(0) = 0, yet x = 0 is a minimum, a maximum and neither, respectively.",
          },
        ],
      },
      {
        id: "which-test",
        heading: "First or second derivative test: which should you use?",
        blocks: [
          {
            type: "table",
            caption: "Comparing the first and second derivative tests",
            headers: ["", "First derivative test", "Second derivative test"],
            rows: [
              [t`\text{What you need}`, t`\text{the sign of } f' \text{ near } c`, t`\text{the value of } f''(c)`],
              [t`\text{Works where } f' \text{ is undefined}`, t`\text{yes}`, t`\text{no}`],
              [t`\text{Can be inconclusive}`, t`\text{never}`, t`\text{when } f''(c) = 0`],
              [t`\text{Best when}`, t`f' \text{ factors easily}`, t`f'' \text{ is easy to compute}`],
            ],
          },
          {
            type: "p",
            text: "A good habit: try the second derivative test first, because it is quick. If f″(c) = 0 or f′(c) does not exist, switch to the first derivative test for that point. The critical points calculator follows exactly this rule.",
          },
        ],
      },
      {
        id: "absolute-extrema",
        heading: "Critical points on a closed interval (absolute extrema)",
        blocks: [
          {
            type: "p",
            text: "The two tests find local maxima and minima. To find the absolute maximum and minimum of a continuous function on a closed interval [a, b], use the closed interval method instead. No classification is needed:",
          },
          {
            type: "list",
            items: [
              "Step 1: Find the critical points of f that lie inside (a, b).",
              "Step 2: Evaluate f at each of those critical points and at both endpoints a and b.",
              "Step 3: The largest value is the absolute maximum, and the smallest is the absolute minimum.",
            ],
          },
          {
            type: "p",
            text: "For example, take f(x) = x³ − 3x on [0, 3]. Here f′(x) = 3x² − 3 = 3(x − 1)(x + 1), and only x = 1 lies in the interval. Comparing f(0) = 0, f(1) = −2 and f(3) = 18, the absolute minimum is −2 at x = 1 and the absolute maximum is 18 at the endpoint x = 3. Note that the maximum is at an endpoint, not a critical point.",
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
              "Forgetting points where f′ is undefined. Always check the denominator of f′ as well as the numerator.",
              "Including values outside the domain. For f(x) = 1/x, f′ is undefined at 0, but 0 is not in the domain, so it is not a critical point.",
              "Reading f″(c) = 0 as “neither”. It means the second derivative test failed, not that there is no extremum.",
              "Dividing both sides of f′(x) = 0 by a factor containing x. In 4x³ − 12x² = 0, dividing by x² loses the critical point x = 0. Factor instead.",
              "Substituting into f instead of f′ (or f″) when testing signs. The sign chart uses f′; the second derivative test uses f″.",
              "Reporting only the x-value when the question asks for the point. A critical point on the graph is (c, f(c)).",
            ],
          },
        ],
      },
    ],
    examples: [
      {
        title: "A cubic, classified with the second derivative test",
        problem: t`f(x) = 2x^{3} - 9x^{2} + 12x - 4`,
        steps: [
          { text: "The domain is all real numbers. Differentiate and factor:", math: t`f'(x) = 6x^{2} - 18x + 12 = 6(x - 1)(x - 2)` },
          { text: "f′ is never undefined, so the critical points are x = 1 and x = 2. Find the second derivative and substitute:", math: t`f''(x) = 12x - 18 \quad\Rightarrow\quad f''(1) = -6 < 0,\qquad f''(2) = 6 > 0` },
          { text: "Function values: f(1) = 2 − 9 + 12 − 4 = 1 and f(2) = 16 − 36 + 24 − 4 = 0." },
        ],
        answer: t`(1,\ 1)\ \text{local max},\qquad (2,\ 0)\ \text{local min}`,
        check: { operation: "critical-points", expression: "2x^3 - 9x^2 + 12x - 4", expected: "1, 2" },
      },
      {
        title: "When the second derivative test is inconclusive",
        problem: t`f(x) = x^{4} - 4x^{3}`,
        steps: [
          { text: "Differentiate and factor completely. Do not divide by x²:", math: t`f'(x) = 4x^{3} - 12x^{2} = 4x^{2}(x - 3)` },
          { text: "The critical points are x = 0 and x = 3. Try the second derivative test:", math: t`f''(x) = 12x^{2} - 24x \quad\Rightarrow\quad f''(0) = 0,\qquad f''(3) = 36 > 0` },
          { text: "So x = 3 is a local minimum, with f(3) = 81 − 108 = −27. At x = 0 the test is inconclusive, so use the first derivative test: 4x² ≥ 0 and x − 3 < 0 near 0, so f′ is negative on both sides." },
        ],
        answer: t`(3,\ -27)\ \text{local min},\qquad x = 0\ \text{neither (}f\text{ keeps decreasing)}`,
        check: { operation: "critical-points", expression: "x^4 - 4x^3", expected: "0, 3" },
      },
      {
        title: "A rational function, classified with a sign chart",
        problem: t`f(x) = \frac{x}{x^{2} + 1}`,
        steps: [
          { text: "The denominator is never zero, so the domain is all real numbers. Quotient rule:", math: t`f'(x) = \frac{(x^{2} + 1) - x\cdot 2x}{(x^{2} + 1)^{2}} = \frac{(1 - x)(1 + x)}{(x^{2} + 1)^{2}}` },
          { text: "f′ = 0 at x = ±1 and is never undefined. The denominator is always positive, so the sign of f′ is the sign of (1 − x)(1 + x): negative on (−∞, −1), positive on (−1, 1), negative on (1, ∞)." },
          { text: "f′ goes − to + at x = −1 and + to − at x = 1. Function values: f(−1) = −1/2 and f(1) = 1/2." },
        ],
        answer: t`\left(-1,\ -\tfrac{1}{2}\right)\ \text{local min},\qquad \left(1,\ \tfrac{1}{2}\right)\ \text{local max}`,
        check: { operation: "critical-points", expression: "x/(x^2+1)", expected: "-1, 1" },
      },
      {
        title: "Critical points where f′ does not exist",
        problem: t`f(x) = \left|x^{2} - 4\right|`,
        steps: [
          { text: "The domain is all real numbers. Away from x = ±2, where x² − 4 changes sign, the absolute value can be removed piece by piece:", math: t`f'(x) = \begin{cases} 2x, & |x| > 2 \\ -2x, & |x| < 2 \end{cases}` },
          { text: "f′(x) = 0 only at x = 0 (from −2x = 0). At x = ±2 the graph has sharp corners, where the left and right slopes differ (−4 and 4 at x = 2), so f′ does not exist. All three are in the domain, so all three are critical points." },
          { text: "The second derivative test cannot be used at the corners, so use a sign chart: f′ is − on (−∞, −2), + on (−2, 0), − on (0, 2) and + on (2, ∞). Function values: f(±2) = 0 and f(0) = 4." },
        ],
        answer: t`(-2,\ 0)\ \text{and}\ (2,\ 0)\ \text{local min (corners)},\qquad (0,\ 4)\ \text{local max}`,
        check: { operation: "critical-points", expression: "abs(x^2 - 4)", expected: "-2, 0, 2" },
      },
      {
        title: "An exponential function",
        problem: t`f(x) = x^{2}e^{-x}`,
        steps: [
          { text: "Product rule, then factor out the common terms:", math: t`f'(x) = 2xe^{-x} - x^{2}e^{-x} = xe^{-x}(2 - x)` },
          { text: "Since e^(−x) is never zero, f′ = 0 only at x = 0 and x = 2. Differentiate again and simplify:", math: t`f''(x) = e^{-x}\left(x^{2} - 4x + 2\right) \quad\Rightarrow\quad f''(0) = 2 > 0,\qquad f''(2) = -\frac{2}{e^{2}} < 0` },
          { text: "Function values: f(0) = 0 and f(2) = 4/e² ≈ 0.541." },
        ],
        answer: t`(0,\ 0)\ \text{local min},\qquad \left(2,\ \tfrac{4}{e^{2}}\right)\ \text{local max}`,
        check: { operation: "critical-points", expression: "x^2 e^(-x)", expected: "0, 2" },
      },
      {
        title: "A logarithmic function with a restricted domain",
        problem: t`f(x) = \frac{\ln x}{x}`,
        steps: [
          { text: "The domain is x > 0. Quotient rule:", math: t`f'(x) = \frac{\frac{1}{x}\cdot x - \ln x}{x^{2}} = \frac{1 - \ln x}{x^{2}}` },
          { text: "The denominator is zero only at x = 0, which is outside the domain, so it is not a critical point. The numerator is zero when ln x = 1, that is x = e." },
          { text: "For 0 < x < e, ln x < 1 so f′ > 0; for x > e, f′ < 0. f′ goes + to −, and f(e) = 1/e." },
        ],
        answer: t`\left(e,\ \tfrac{1}{e}\right)\ \text{local max (also the absolute max)}`,
        check: { operation: "critical-points", expression: "ln(x)/x", expected: "e" },
      },
    ],
    faqs: [
      {
        q: "What is the difference between a critical point and a stationary point?",
        a: "A stationary point is a point where f′(x) = 0. A critical point includes those and also the points where f′ does not exist but f is defined, such as the corner of |x| at x = 0. Every stationary point is a critical point, but not the other way round.",
      },
      {
        q: "Is every critical point a maximum or a minimum?",
        a: "No. A critical point can be neither. For f(x) = x³, f′(0) = 0, but f′ is positive on both sides of 0, so the graph keeps rising. Points like this are often inflection points with a horizontal tangent.",
      },
      {
        q: "What does it mean if the second derivative is zero at a critical point?",
        a: "The second derivative test is inconclusive. The point could be a minimum (x⁴ at 0), a maximum (−x⁴ at 0) or neither (x³ at 0). Use the first derivative test to decide.",
      },
      {
        q: "Can a function have no critical points?",
        a: "Yes. f(x) = eˣ and f(x) = x³ + x have derivatives that are always positive, so they are never zero and never undefined. Such functions are always increasing and have no local maxima or minima.",
      },
      {
        q: "Are endpoints of an interval critical points?",
        a: "No. Critical points are interior points where f′ is zero or undefined. Endpoints are checked separately when you look for absolute extrema on a closed interval, and the absolute maximum or minimum often occurs there.",
      },
    ],
    calculator: { href: "/critical-points-calculator", label: "Find and classify critical points with the Critical Points Calculator" },
  },
  {
    slug: "squeeze-theorem-explained-with-examples",
    titleClass: "text-blog-squeeze",
    image: { src: "/images/blog-squeeze-theorem.webp", alt: "An oscillating curve trapped between an upper and a lower curve that meet at a single point, illustrating the squeeze theorem", width: 1536, height: 1024, caption: "The wavy function is trapped between two bounds that meet at one point, so as x approaches that point it is squeezed to the same limit." },
    published: "2026-11-16",
    title: "Squeeze Theorem Explained With Examples (Sandwich Theorem)",
    metaTitle: "Squeeze Theorem Explained With Examples (Step by Step)",
    description:
      "Learn what the squeeze theorem says, when to use it and how to find the bounding functions, with seven worked examples including x² sin(1/x) and sin(x)/x.",
    intro:
      "Some limits cannot be found by substitution, factoring or L'Hôpital's rule, usually because a factor such as sin(1/x) keeps oscillating forever. The squeeze theorem handles these by trapping the function between two simpler functions that share the same limit. This guide explains the theorem, gives a step-by-step method for finding the bounds, and works through seven examples.",
    sections: [
      {
        id: "statement",
        heading: "What the squeeze theorem says",
        blocks: [
          {
            type: "p",
            text: "Suppose three functions g, f and h satisfy g(x) ≤ f(x) ≤ h(x) for every x near a (except possibly at a itself). If g and h have the same limit L at a, then f is forced to have that limit too:",
          },
          { type: "math", latex: t`g(x) \le f(x) \le h(x) \ \text{ near } a \quad\text{and}\quad \lim_{x \to a} g(x) = \lim_{x \to a} h(x) = L \quad\Longrightarrow\quad \lim_{x \to a} f(x) = L` },
          {
            type: "p",
            text: "The idea is simple: f is sandwiched between g and h. As x approaches a, the lower function g and the upper function h both close in on L, so f, which is always between them, has nowhere else to go. That is why the result is also called the sandwich theorem or the pinching theorem.",
          },
          {
            type: "p",
            text: "The theorem works the same way for one-sided limits (x → a⁺ or x → a⁻) and for limits at infinity (x → ∞ or x → −∞). In each case the inequality only needs to hold on the side, or far enough out, that the limit looks at.",
          },
        ],
      },
      {
        id: "when-to-use",
        heading: "When should you use the squeeze theorem?",
        blocks: [
          { type: "p", text: "Reach for the squeeze theorem when the usual methods fail and the expression contains a factor that is bounded but has no limit. Typical signs:" },
          {
            type: "list",
            items: [
              "A sine or cosine of something that blows up, such as sin(1/x) as x → 0 or cos(x) as x → ∞. These oscillate between −1 and 1 forever, so they have no limit.",
              "That bounded factor is multiplied by something that goes to 0, such as x², √x or e^(−x).",
              "Substitution gives an undefined expression, and L'Hôpital's rule does not apply or makes things worse.",
            ],
          },
          {
            type: "p",
            text: "The product rule for limits, lim(f·g) = lim f · lim g, cannot be used here, because one of the two limits does not exist. The squeeze theorem gets around that by never needing the limit of the oscillating factor, only its bounds.",
          },
          {
            type: "p",
            text: "If the limit is a 0/0 or ∞/∞ fraction of smooth functions with no oscillating factor, L'Hôpital's rule is usually faster. Learn when it applies in",
            link: { href: "/blog/lhopitals-rule-explained-with-examples", label: "L'Hôpital's Rule Explained With Examples" },
          },
        ],
      },
      {
        id: "method",
        heading: "How to use the squeeze theorem, step by step",
        blocks: [
          {
            type: "list",
            items: [
              "Step 1: Find the bounded part. Write down an inequality you already know, most often −1 ≤ sin(anything) ≤ 1 or −1 ≤ cos(anything) ≤ 1.",
              "Step 2: Build up to f(x). Multiply, divide or add to every part of the inequality until the middle is exactly f(x). Multiplying by a positive quantity keeps the inequality signs; multiplying by a negative one flips them.",
              "Step 3: Find the limits of the two outer functions. They should be easy limits, found by substitution.",
              "Step 4: Check that the two outer limits are equal. If they are, f has that same limit. If they differ, the bounds are too loose and the theorem says nothing.",
            ],
          },
          {
            type: "p",
            text: "Step 2 is where care is needed. In x² sin(1/x), the factor x² is never negative, so multiplying −1 ≤ sin(1/x) ≤ 1 by x² is safe. In x sin(1/x), x can be negative, so use absolute values instead (see the next section).",
          },
        ],
      },
      {
        id: "absolute-value",
        heading: "The absolute value shortcut",
        blocks: [
          { type: "p", text: "When the limit you expect is 0, there is a quicker form of the theorem that avoids sign problems:" },
          { type: "math", latex: t`\lim_{x \to a} |f(x)| = 0 \quad\Longrightarrow\quad \lim_{x \to a} f(x) = 0` },
          {
            type: "p",
            text: "This follows from the squeeze theorem, because −|f(x)| ≤ f(x) ≤ |f(x)| and both outer functions go to 0. In practice it means you can bound |f(x)| instead of f(x). For example, |x sin(1/x)| = |x|·|sin(1/x)| ≤ |x|, and |x| → 0, so x sin(1/x) → 0 as x → 0, whether x is positive or negative.",
          },
        ],
      },
      {
        id: "sin-x-over-x",
        heading: "The most famous squeeze: sin(x)/x as x → 0",
        blocks: [
          {
            type: "p",
            text: "The limit of sin(x)/x as x → 0 is the reason the derivative of sin x is cos x, and it is usually proved with the squeeze theorem. Comparing the areas of two triangles and a circular sector in the unit circle gives, for small x ≠ 0:",
          },
          { type: "math", latex: t`\cos x \le \frac{\sin x}{x} \le 1` },
          {
            type: "p",
            text: "As x → 0, cos x → 1 and the constant 1 stays at 1. Both bounds have the same limit, so the squeeze theorem gives the result:",
          },
          { type: "math", latex: t`\lim_{x \to 0} \frac{\sin x}{x} = 1` },
          {
            type: "p",
            text: "Note that x must be in radians. In degrees, the same limit equals π/180.",
          },
          {
            type: "p",
            text: "This limit, used inside the limit definition of the derivative, is what gives d/dx[sin x] = cos x. To see how the definition turns into the everyday differentiation rules, read",
            link: { href: "/blog/how-to-find-the-derivative-of-a-function", label: "How to Find the Derivative of a Function" },
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
              "Using bounds with different limits. From −x² − 1 ≤ f(x) ≤ x² + 1 near 0, the limits are −1 and 1, which tells you nothing about f.",
              "Forgetting to flip the inequalities when multiplying by a negative number. Multiplying −1 ≤ sin(1/x) ≤ 1 by x is only safe for x > 0; use |x| or the absolute value shortcut instead.",
              "Writing lim sin(1/x) = 0 or treating lim x sin(1/x) as (lim x)(lim sin(1/x)). The limit of sin(1/x) as x → 0 does not exist, so the product rule for limits cannot be used.",
              "Checking the inequality only at the point. It must hold for all x near a, not just at x = a, where f may not even be defined.",
              "Squeezing when it isn't needed. If substitution, factoring or L'Hôpital's rule works, use it; the squeeze theorem is for the cases they cannot handle.",
            ],
          },
        ],
      },
    ],
    examples: [
      {
        title: "The classic: x² sin(1/x)",
        problem: t`\lim_{x \to 0} x^{2}\sin\!\left(\frac{1}{x}\right)`,
        steps: [
          { text: "sin(1/x) has no limit at 0, but it is always between −1 and 1:", math: t`-1 \le \sin\!\left(\frac{1}{x}\right) \le 1` },
          { text: "Multiply every part by x², which is never negative, so the inequalities keep their direction:", math: t`-x^{2} \le x^{2}\sin\!\left(\frac{1}{x}\right) \le x^{2}` },
          { text: "Both −x² and x² approach 0 as x → 0, so the middle function does too." },
        ],
        answer: t`0`,
        check: { operation: "limit", expression: "x^2 sin(1/x)", point: "0", expected: "0" },
      },
      {
        title: "Using absolute values: x sin(1/x)",
        problem: t`\lim_{x \to 0} x\sin\!\left(\frac{1}{x}\right)`,
        steps: [
          { text: "x can be negative, so multiplying by x could flip the signs. Bound the absolute value instead:", math: t`\left|x\sin\!\left(\frac{1}{x}\right)\right| = |x|\left|\sin\!\left(\frac{1}{x}\right)\right| \le |x|` },
          { text: "So −|x| ≤ x sin(1/x) ≤ |x|, and |x| → 0 as x → 0." },
        ],
        answer: t`0`,
        check: { operation: "limit", expression: "x sin(1/x)", point: "0", expected: "0" },
      },
      {
        title: "A one-sided limit",
        problem: t`\lim_{x \to 0^{+}} \sqrt{x}\,e^{\sin(\pi/x)}`,
        steps: [
          { text: "Since −1 ≤ sin(π/x) ≤ 1 and eᵗ is increasing, the exponential factor is bounded:", math: t`e^{-1} \le e^{\sin(\pi/x)} \le e` },
          { text: "For x > 0, √x is positive. Multiply through:", math: t`\frac{\sqrt{x}}{e} \le \sqrt{x}\,e^{\sin(\pi/x)} \le e\sqrt{x}` },
          { text: "Both bounds approach 0 as x → 0⁺. The limit is one-sided because √x is only defined for x ≥ 0." },
        ],
        answer: t`0`,
        check: { operation: "limit", expression: "sqrt(x) e^(sin(pi/x))", point: "0", side: "right", expected: "0" },
      },
      {
        title: "A limit at infinity: sin(x)/x",
        problem: t`\lim_{x \to \infty} \frac{\sin x}{x}`,
        steps: [
          { text: "For x > 0, divide −1 ≤ sin x ≤ 1 by x:", math: t`-\frac{1}{x} \le \frac{\sin x}{x} \le \frac{1}{x}` },
          { text: "Both −1/x and 1/x approach 0 as x → ∞. Compare this with x → 0, where the same expression has limit 1." },
        ],
        answer: t`0`,
        check: { operation: "limit", expression: "sin(x)/x", point: "inf", expected: "0" },
      },
      {
        title: "Bounds that are not symmetric",
        problem: t`\lim_{x \to \infty} \frac{2 + \cos x}{x^{2}}`,
        steps: [
          { text: "Since −1 ≤ cos x ≤ 1, the numerator is between 1 and 3:", math: t`1 \le 2 + \cos x \le 3` },
          { text: "Divide by x², which is positive:", math: t`\frac{1}{x^{2}} \le \frac{2 + \cos x}{x^{2}} \le \frac{3}{x^{2}}` },
          { text: "Both bounds approach 0 as x → ∞. The bounds do not need to be mirror images; they only need the same limit." },
        ],
        answer: t`0`,
        check: { operation: "limit", expression: "(2 + cos(x))/x^2", point: "inf", expected: "0" },
      },
      {
        title: "A squeeze to a nonzero limit",
        problem: t`\lim_{x \to \infty} \frac{x + \sin x}{x}`,
        steps: [
          { text: "Split the fraction:", math: t`\frac{x + \sin x}{x} = 1 + \frac{\sin x}{x}` },
          { text: "For x > 0, −1/x ≤ sin(x)/x ≤ 1/x. Add 1 to every part:", math: t`1 - \frac{1}{x} \le \frac{x + \sin x}{x} \le 1 + \frac{1}{x}` },
          { text: "Both bounds approach 1. L'Hôpital's rule would fail here: it gives (1 + cos x)/1, which has no limit." },
        ],
        answer: t`1`,
        check: { operation: "limit", expression: "(x + sin(x))/x", point: "inf", expected: "1" },
      },
      {
        title: "The fundamental trig limit",
        problem: t`\lim_{x \to 0} \frac{\sin x}{x}`,
        steps: [
          { text: "From the unit-circle area argument, for small x ≠ 0:", math: t`\cos x \le \frac{\sin x}{x} \le 1` },
          { text: "As x → 0, cos x → cos 0 = 1, and the upper bound is the constant 1. Both bounds approach 1." },
        ],
        answer: t`1`,
        check: { operation: "limit", expression: "sin(x)/x", point: "0", expected: "1" },
      },
    ],
    faqs: [
      {
        q: "Is the squeeze theorem the same as the sandwich theorem?",
        a: "Yes. Squeeze theorem, sandwich theorem and pinching theorem are three names for the same result. Some books also call it the sandwich rule or the two policemen theorem.",
      },
      {
        q: "How do I find the bounding functions?",
        a: "Start from a bound you already know, usually −1 ≤ sin(…) ≤ 1 or −1 ≤ cos(…) ≤ 1, then multiply, divide or add to every part until the middle matches your function. Keep track of signs: multiplying by a negative number flips the inequalities.",
      },
      {
        q: "Does the squeeze theorem work for limits at infinity?",
        a: "Yes. The inequality g(x) ≤ f(x) ≤ h(x) only needs to hold for all large enough x, and if g and h have the same limit as x → ∞, so does f. sin(x)/x → 0 is a standard example.",
      },
      {
        q: "Why can't I just use L'Hôpital's rule?",
        a: "L'Hôpital's rule needs a 0/0 or ∞/∞ form and needs the new limit to exist. For limits like x² sin(1/x) there is no such quotient, and for (x + sin x)/x the derivative quotient (1 + cos x)/1 has no limit, so the rule gives no answer.",
      },
      {
        q: "What if the upper and lower limits are different?",
        a: "Then the squeeze theorem tells you nothing. f might still have a limit, but you need tighter bounds or a different method to find it.",
      },
    ],
    calculator: { href: "/limit-calculator", label: "Check any limit with the Limit Calculator" },
  },
  {
    slug: "lhopitals-rule-explained-with-examples",
    titleClass: "text-blog-lhopital",
    published: "2026-11-17",
    title: "L'Hôpital's Rule Explained With Examples (Step by Step)",
    metaTitle: "L'Hôpital's Rule Explained With Examples (0/0 and ∞/∞)",
    description:
      "Learn when and how to use L'Hôpital's rule for 0/0 and ∞/∞ limits, how to rewrite 0·∞, ∞ − ∞, 0⁰, 1^∞ and ∞⁰ forms, and when the rule fails, with eight worked examples.",
    intro:
      "Many limits come out as 0/0 or ∞/∞ when you substitute, which tells you nothing about the actual answer. L'Hôpital's rule resolves these by replacing the fraction with the ratio of the derivatives. This guide shows exactly when the rule applies, how to use it step by step, how to turn the other indeterminate forms into 0/0 or ∞/∞, and the cases where it fails. Eight fully worked examples follow.",
    sections: [
      {
        id: "statement",
        heading: "What L'Hôpital's rule says",
        blocks: [
          {
            type: "p",
            text: "Suppose f and g are differentiable near a (except possibly at a), g′(x) ≠ 0 near a, and the limit of f(x)/g(x) is an indeterminate form 0/0 or ±∞/±∞. Then the limit of the fraction equals the limit of the ratio of derivatives, provided that second limit exists (or is ±∞):",
          },
          { type: "math", latex: t`\lim_{x \to a} \frac{f(x)}{g(x)} = \lim_{x \to a} \frac{f'(x)}{g'(x)}` },
          {
            type: "p",
            text: "The rule also works for one-sided limits and for limits as x → ∞ or x → −∞. The important detail is that you differentiate the numerator and the denominator separately. It is not the quotient rule: you never differentiate the fraction as a whole.",
          },
          {
            type: "p",
            text: "Why it works: near a point where f(a) = g(a) = 0, both functions are close to their tangent lines, so f(x) ≈ f′(a)(x − a) and g(x) ≈ g′(a)(x − a). The factors (x − a) cancel, leaving f′(a)/g′(a).",
          },
        ],
      },
      {
        id: "when-to-use",
        heading: "When can you use L'Hôpital's rule?",
        blocks: [
          { type: "p", text: "Only when direct substitution gives one of these two forms:" },
          { type: "math", latex: t`\frac{0}{0} \qquad\text{or}\qquad \frac{\pm\infty}{\pm\infty}` },
          {
            type: "p",
            text: "Always substitute first. If you get a number, that is the answer and L'Hôpital's rule must not be used. For example, the limit of (x + 1)/(x + 2) as x → 0 is 1/2 by substitution. Applying the rule anyway would give 1/1 = 1, which is wrong.",
          },
          {
            type: "p",
            text: "Forms such as 1/0, 5/∞ or ∞/3 are not indeterminate either. 1/0 means the limit is infinite or does not exist, and 5/∞ means the limit is 0. Neither needs the rule.",
          },
        ],
      },
      {
        id: "method",
        heading: "How to use L'Hôpital's rule, step by step",
        blocks: [
          {
            type: "list",
            items: [
              "Step 1: Substitute the limit point. Confirm the result is exactly 0/0 or ∞/∞. If it is another indeterminate form, rewrite it first (see below).",
              "Step 2: Differentiate the numerator and the denominator separately. Do not use the quotient rule.",
              "Step 3: Take the limit of the new fraction f′(x)/g′(x), simplifying first if you can.",
              "Step 4: If the result is still 0/0 or ∞/∞, apply the rule again. Check the form before every application.",
            ],
          },
          {
            type: "p",
            text: "Simplify between steps whenever possible. Cancelling a common factor or using a known limit such as sin(x)/x → 1 can save one or two rounds of differentiation.",
          },
        ],
      },
      {
        id: "other-forms",
        heading: "Rewriting other indeterminate forms",
        blocks: [
          { type: "p", text: "Five more indeterminate forms can be turned into 0/0 or ∞/∞, after which L'Hôpital's rule applies:" },
          {
            type: "table",
            caption: "How to convert each indeterminate form",
            headers: ["Form", "Typical example", "Rewrite as"],
            rows: [
              [t`0 \cdot \infty`, t`x \ln x \ (x \to 0^{+})`, t`\dfrac{\ln x}{1/x} \ \ (\infty/\infty)`],
              [t`\infty - \infty`, t`\dfrac{1}{x} - \dfrac{1}{e^{x} - 1}`, t`\text{one fraction over a common denominator}`],
              [t`0^{0}`, t`x^{x} \ (x \to 0^{+})`, t`e^{\,x \ln x} \text{, then find } \lim x \ln x`],
              [t`1^{\infty}`, t`\left(1 + \tfrac{3}{x}\right)^{x}`, t`e^{\,x \ln(1 + 3/x)}`],
              [t`\infty^{0}`, t`x^{1/x} \ (x \to \infty)`, t`e^{\,\ln(x)/x}`],
            ],
          },
          {
            type: "p",
            text: "The three power forms all use the same trick: write f(x)^g(x) as e^(g(x) ln f(x)), find the limit L of the exponent, and the answer is e^L. Because eˣ is continuous, the limit can move inside the exponential.",
          },
        ],
      },
      {
        id: "when-it-fails",
        heading: "When L'Hôpital's rule fails",
        blocks: [
          {
            type: "p",
            text: "The rule says that if lim f′/g′ exists, then lim f/g equals it. It says nothing when lim f′/g′ does not exist. Take the limit of (x + sin x)/x as x → ∞. It is ∞/∞, but the rule gives (1 + cos x)/1, which keeps oscillating between 0 and 2 and has no limit. The original limit is still 1, which you can show by splitting the fraction or with the squeeze theorem.",
            link: { href: "/blog/squeeze-theorem-explained-with-examples", label: "See the squeeze theorem with examples" },
          },
          {
            type: "p",
            text: "The rule can also go round in circles. For x/√(x² + 1) as x → ∞, each application flips the fraction to √(x² + 1)/x and back again. Dividing the numerator and denominator by x gives the answer 1 immediately. When derivatives get more complicated instead of simpler, switch methods.",
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
              "Using the quotient rule. L'Hôpital's rule differentiates the top and the bottom separately: f′/g′, not (f′g − fg′)/g².",
              "Applying the rule without checking the form. If substitution gives a number, or a form like 1/0, the rule does not apply and will usually give a wrong answer.",
              "Forgetting to check the form again before a second application. After one round, the new fraction may no longer be indeterminate.",
              "Applying it directly to 0·∞, ∞ − ∞ or a power form. Rewrite as a single fraction first.",
              "Forgetting to undo the logarithm in power forms. If the exponent's limit is L, the answer is e^L, not L.",
              "Concluding that the limit does not exist because lim f′/g′ does not exist. The rule is simply inconclusive then.",
            ],
          },
        ],
      },
    ],
    examples: [
      {
        title: "A basic 0/0 limit",
        problem: t`\lim_{x \to 0} \frac{e^{2x} - 1}{x}`,
        steps: [
          { text: "Substituting x = 0 gives (1 − 1)/0 = 0/0, so the rule applies." },
          { text: "Differentiate the top and bottom separately (chain rule on the top):", math: t`\lim_{x \to 0} \frac{2e^{2x}}{1}` },
          { text: "Substitute x = 0: 2e⁰/1 = 2." },
        ],
        answer: t`2`,
        check: { operation: "limit", expression: "(e^(2x) - 1)/x", point: "0", expected: "2" },
      },
      {
        title: "An ∞/∞ limit at infinity",
        problem: t`\lim_{x \to \infty} \frac{\ln x}{x}`,
        steps: [
          { text: "As x → ∞, both ln x and x grow without bound: ∞/∞." },
          { text: "Differentiate the top and bottom:", math: t`\lim_{x \to \infty} \frac{1/x}{1} = \lim_{x \to \infty} \frac{1}{x}` },
          { text: "1/x → 0. This shows that x grows faster than ln x." },
        ],
        answer: t`0`,
        check: { operation: "limit", expression: "ln(x)/x", point: "inf", expected: "0" },
      },
      {
        title: "Applying the rule twice",
        problem: t`\lim_{x \to 0} \frac{1 - \cos x}{x^{2}}`,
        steps: [
          { text: "0/0. First application:", math: t`\lim_{x \to 0} \frac{\sin x}{2x}` },
          { text: "Still 0/0. Apply the rule again:", math: t`\lim_{x \to 0} \frac{\cos x}{2}` },
          { text: "Substitute x = 0: cos 0/2 = 1/2." },
        ],
        answer: t`\frac{1}{2}`,
        check: { operation: "limit", expression: "(1 - cos(x))/x^2", point: "0", expected: "1/2" },
      },
      {
        title: "Exponentials beat polynomials",
        problem: t`\lim_{x \to \infty} \frac{x^{2}}{e^{x}}`,
        steps: [
          { text: "∞/∞. First application:", math: t`\lim_{x \to \infty} \frac{2x}{e^{x}}` },
          { text: "Still ∞/∞. Second application:", math: t`\lim_{x \to \infty} \frac{2}{e^{x}}` },
          { text: "The numerator is constant and eˣ → ∞, so the fraction → 0. The same argument works for any power xⁿ." },
        ],
        answer: t`0`,
        check: { operation: "limit", expression: "x^2/e^x", point: "inf", expected: "0" },
      },
      {
        title: "A 0 · ∞ form",
        problem: t`\lim_{x \to 0^{+}} x\ln x`,
        steps: [
          { text: "x → 0 and ln x → −∞, so this is 0 · ∞. Move x into the denominator as 1/x:", math: t`\lim_{x \to 0^{+}} \frac{\ln x}{1/x} \quad \left(\frac{-\infty}{\infty}\right)` },
          { text: "Differentiate the top and bottom, then simplify:", math: t`\lim_{x \to 0^{+}} \frac{1/x}{-1/x^{2}} = \lim_{x \to 0^{+}} (-x)` },
          { text: "−x → 0." },
        ],
        answer: t`0`,
        check: { operation: "limit", expression: "x ln(x)", point: "0", side: "right", expected: "0" },
      },
      {
        title: "An ∞ − ∞ form",
        problem: t`\lim_{x \to 0} \left(\frac{1}{x} - \frac{1}{e^{x} - 1}\right)`,
        steps: [
          { text: "Combine over a common denominator:", math: t`\frac{e^{x} - 1 - x}{x\left(e^{x} - 1\right)} \quad \left(\frac{0}{0}\right)` },
          { text: "First application (product rule on the bottom):", math: t`\frac{e^{x} - 1}{e^{x} - 1 + xe^{x}} \quad \left(\frac{0}{0}\right)` },
          { text: "Second application:", math: t`\frac{e^{x}}{2e^{x} + xe^{x}} \;\xrightarrow{\;x \to 0\;}\; \frac{1}{2}` },
        ],
        answer: t`\frac{1}{2}`,
        check: { operation: "limit", expression: "1/x - 1/(e^x - 1)", point: "0", expected: "1/2" },
      },
      {
        title: "A 0⁰ form",
        problem: t`\lim_{x \to 0^{+}} x^{x}`,
        steps: [
          { text: "Rewrite the power as an exponential:", math: t`x^{x} = e^{\,x \ln x}` },
          { text: "The exponent x ln x → 0, as shown in the 0 · ∞ example above." },
          { text: "So the limit is e⁰ = 1." },
        ],
        answer: t`1`,
        check: { operation: "limit", expression: "x^x", point: "0", side: "right", expected: "1" },
      },
      {
        title: "A 1^∞ form",
        problem: t`\lim_{x \to \infty} \left(1 + \frac{3}{x}\right)^{x}`,
        steps: [
          { text: "Write it as e^(x ln(1 + 3/x)). The exponent is ∞ · 0; rewrite it as a fraction:", math: t`x\ln\!\left(1 + \frac{3}{x}\right) = \frac{\ln(1 + 3/x)}{1/x} \quad \left(\frac{0}{0}\right)` },
          { text: "Differentiate the top and bottom, then simplify:", math: t`\frac{\dfrac{-3/x^{2}}{1 + 3/x}}{-1/x^{2}} = \frac{3}{1 + 3/x} \;\xrightarrow{\;x \to \infty\;}\; 3` },
          { text: "The exponent tends to 3, so the limit is e³ ≈ 20.09." },
        ],
        answer: t`e^{3}`,
        check: { operation: "limit", expression: "(1 + 3/x)^x", point: "inf", expected: "e^3" },
      },
    ],
    faqs: [
      {
        q: "How do you pronounce and spell L'Hôpital?",
        a: "It is pronounced “lo-pee-TAHL”. The rule is named after the French mathematician Guillaume de l'Hôpital, and is also spelled L'Hospital's rule, an older spelling of the same name.",
      },
      {
        q: "Is L'Hôpital's rule the same as the quotient rule?",
        a: "No. The quotient rule finds the derivative of a fraction. L'Hôpital's rule finds a limit by replacing f/g with f′/g′, where the numerator and denominator are differentiated separately.",
      },
      {
        q: "Can I apply L'Hôpital's rule more than once?",
        a: "Yes, as many times as needed, as long as the limit is still 0/0 or ∞/∞ before each application. Check the form every time.",
      },
      {
        q: "Does L'Hôpital's rule work for limits at infinity?",
        a: "Yes. It works for x → ∞ and x → −∞, and for one-sided limits, as long as the form is 0/0 or ∞/∞.",
      },
      {
        q: "What if L'Hôpital's rule doesn't give an answer?",
        a: "If lim f′/g′ does not exist or the derivatives keep getting worse, the rule is inconclusive. Try algebra instead: factoring, dividing by the highest power, combining fractions, a known limit, or the squeeze theorem.",
      },
    ],
    calculator: { href: "/limit-calculator", label: "Check any limit step by step with the Limit Calculator" },
  },
];

export function getPost(slug: string): Guide | undefined {
  return posts.find((p) => p.slug === slug);
}
