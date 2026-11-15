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
];

export function getPost(slug: string): Guide | undefined {
  return posts.find((p) => p.slug === slug);
}
