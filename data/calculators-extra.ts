// Content for the mixed partial, Clairaut's theorem, derivative notation and average value
// calculator pages. Worked examples are machine-checked by tests/content.test.ts.

import type { CalculatorPage } from "./calculators";

const t = String.raw;

export const extraCalculators: CalculatorPage[] = [
  {
    slug: "mixed-partial-derivative-calculator",
    image: { src: "/images/mixed-partial-derivative.webp", alt: "A saddle-shaped surface with one cross-section curving upward and the perpendicular cross-section curving downward through the same point", width: 1600, height: 800, caption: "On a saddle, the x-slice curves up (f_xx > 0) while the y-slice curves down (f_yy < 0). Second partials, including the mixed partial f_xy, describe this shape." },
    metaTitle: "Mixed Partial Derivative Calculator with Steps – fxy, fyx, fxx",
    metaDescription:
      "Find mixed partial derivatives like fxy and fyx, and repeated partials like fxx and fyy, step by step. Both stages are shown and checked. Free, runs in your browser.",
    h1: "Mixed Partial Derivative Calculator",
    intro:
      "Find second-order partial derivatives of a function of two or more variables: mixed partials such as fxy and fyx, and repeated partials such as fxx and fyy. Each stage of differentiation is shown with the rule used.",
    operations: ["partial-derivative"],
    initialVariable2: "y",
    solverExamples: [
      { label: "f_xy  x^3 y^2 + x y", operation: "partial-derivative", expression: "x^3 y^2 + x y", variable: "x", variable2: "y" },
      { label: "f_yx  x^3 y^2 + x y", operation: "partial-derivative", expression: "x^3 y^2 + x y", variable: "y", variable2: "x" },
      { label: "f_xy  sin(x y)", operation: "partial-derivative", expression: "sin(x y)", variable: "x", variable2: "y" },
      { label: "f_yy  x^2 y^3", operation: "partial-derivative", expression: "x^2 y^3", variable: "y", variable2: "y" },
      { label: "f_xz  x y z + x^2 z^3", operation: "partial-derivative", expression: "x y z + x^2 z^3", variable: "x", variable2: "z" },
    ],
    definition: {
      heading: "What is a mixed partial derivative?",
      paragraphs: [
        "A mixed partial derivative is a second-order partial derivative taken with respect to two different variables. f_xy means: differentiate f with respect to x, then differentiate that result with respect to y. It measures how the slope in the x-direction changes as you move in the y-direction, the “twist” of the surface.",
        "Repeated partials such as f_xx and f_yy use the same variable twice; they measure how the surface curves along one direction. Together, f_xx, f_yy and f_xy describe the shape of the surface near a point.",
      ],
      formula: t`f_{xy} = \frac{\partial}{\partial y}\left(\frac{\partial f}{\partial x}\right) = \frac{\partial^{2} f}{\partial y\,\partial x}`,
    },
    rules: {
      heading: "Notation and rules for second partial derivatives",
      intro: "The notation reverses between the subscript and the fraction forms, which is a common source of confusion.",
      items: [
        { name: "Subscript notation", latex: t`f_{xy} = \left(f_{x}\right)_{y}`, text: "Read left to right: x first, then y." },
        { name: "Fraction notation", latex: t`\frac{\partial^{2} f}{\partial y\,\partial x}`, text: "Read right to left: the variable nearest f (x) is applied first." },
        { name: "Repeated partials", latex: t`f_{xx} = \frac{\partial^{2} f}{\partial x^{2}},\qquad f_{yy} = \frac{\partial^{2} f}{\partial y^{2}}`, text: "Curvature of the surface along the x- and y-directions." },
        { name: "Clairaut's theorem", latex: t`f_{xy} = f_{yx}`, text: "If both mixed partials are continuous near a point, the order of differentiation does not matter there." },
        { name: "Hessian matrix", latex: t`H = \begin{pmatrix} f_{xx} & f_{xy} \\ f_{yx} & f_{yy} \end{pmatrix}`, text: "All four second partials together; its determinant drives the second derivative test in two variables." },
        { name: "Second derivative test", latex: t`D = f_{xx}f_{yy} - f_{xy}^{2}`, text: "At a critical point: D > 0 and f_xx > 0 is a minimum, D > 0 and f_xx < 0 a maximum, D < 0 a saddle point." },
      ],
    },
    howItWorks: [
      "Choose the first variable under “With respect to” and the second under “Then with respect to”. The calculator differentiates with respect to the first, simplifies, then differentiates the result with respect to the second. Both stages are shown, with every rule named.",
      "Every letter other than the current variable is treated as a constant at each stage. Supported variables are x, y, z, t, u and θ, so mixed partials such as f_xz in three variables work too.",
      "Each stage is checked numerically against a finite-difference estimate, with the other variables fixed at test values. To compare f_xy with f_yx automatically, use the Clairaut's theorem calculator.",
    ],
    examples: [
      {
        title: "Mixed partial f_xy of a polynomial",
        problem: t`f_{xy}\ \text{for}\ f = x^{3}y^{2} + xy`,
        steps: [
          { text: "Differentiate with respect to x, holding y constant:", math: t`f_{x} = 3x^{2}y^{2} + y` },
          { text: "Differentiate that with respect to y, holding x constant:", math: t`f_{xy} = 6x^{2}y + 1` },
        ],
        answer: t`f_{xy} = 6x^{2}y + 1`,
        check: { operation: "partial-derivative", expression: "x^3 y^2 + x y", variable: "x", variable2: "y" , expected: "6x^2 y + 1" },
      },
      {
        title: "The other order: f_yx",
        problem: t`f_{yx}\ \text{for}\ f = x^{3}y^{2} + xy`,
        steps: [
          { text: "Differentiate with respect to y first:", math: t`f_{y} = 2x^{3}y + x` },
          { text: "Then with respect to x:", math: t`f_{yx} = 6x^{2}y + 1` },
          { text: "The same as f_xy, as Clairaut's theorem predicts for a polynomial." },
        ],
        answer: t`f_{yx} = 6x^{2}y + 1`,
        check: { operation: "partial-derivative", expression: "x^3 y^2 + x y", variable: "y", variable2: "x", expected: "6x^2 y + 1" },
      },
      {
        title: "Product and chain rules inside a mixed partial",
        problem: t`f_{xy}\ \text{for}\ f = \sin(xy)`,
        steps: [
          { text: "Chain rule in x:", math: t`f_{x} = y\cos(xy)` },
          { text: "Product rule in y: y times cos(xy), where ∂/∂y of cos(xy) is −x sin(xy).", math: t`f_{xy} = \cos(xy) - xy\sin(xy)` },
        ],
        answer: t`f_{xy} = \cos(xy) - xy\sin(xy)`,
        check: { operation: "partial-derivative", expression: "sin(x y)", variable: "x", variable2: "y", expected: "cos(x y) - x y sin(x y)" },
      },
      {
        title: "An exponential",
        problem: t`f_{xy}\ \text{for}\ f = e^{x^{2}y}`,
        steps: [
          { text: "In x, the inner function x²y has ∂/∂x = 2xy:", math: t`f_{x} = 2xy\,e^{x^{2}y}` },
          { text: "In y, use the product rule on 2xy · e^(x²y), where ∂/∂y of e^(x²y) is x²e^(x²y):", math: t`f_{xy} = 2x\,e^{x^{2}y} + 2x^{3}y\,e^{x^{2}y}` },
        ],
        answer: t`f_{xy} = 2x\,e^{x^{2}y}\left(1 + x^{2}y\right)`,
        check: { operation: "partial-derivative", expression: "e^(x^2 y)", variable: "x", variable2: "y", expected: "2x e^(x^2 y)(1 + x^2 y)" },
      },
      {
        title: "A repeated partial f_yy",
        problem: t`f_{yy}\ \text{for}\ f = x^{2}y^{3}`,
        steps: [
          { text: "x² is a constant factor throughout:", math: t`f_{y} = 3x^{2}y^{2},\qquad f_{yy} = 6x^{2}y` },
        ],
        answer: t`f_{yy} = 6x^{2}y`,
        check: { operation: "partial-derivative", expression: "x^2 y^3", variable: "y", variable2: "y", expected: "6x^2 y" },
      },
      {
        title: "Three variables: f_xz",
        problem: t`f_{xz}\ \text{for}\ f = xyz + x^{2}z^{3}`,
        steps: [
          { text: "Differentiate with respect to x (y and z constant):", math: t`f_{x} = yz + 2xz^{3}` },
          { text: "Then with respect to z (x and y constant):", math: t`f_{xz} = y + 6xz^{2}` },
        ],
        answer: t`f_{xz} = y + 6xz^{2}`,
        check: { operation: "partial-derivative", expression: "x y z + x^2 z^3", variable: "x", variable2: "z", expected: "y + 6x z^2" },
      },
    ],
    mistakes: [
      { title: "Reading the fraction notation in the wrong order", text: "∂²f/∂y∂x means x first, then y; it equals f_xy. The variable closest to f in the denominator is applied first." },
      { title: "Differentiating the constant variable", text: "In the first stage of f_xy, y is a constant. Writing a derivative of a y-term at that stage means y was differentiated too early." },
      { title: "Forgetting the product rule in the second stage", text: "After the first partial, terms often become products of x and y factors, like y·cos(xy). The second partial then needs the product rule." },
      { title: "Assuming f_xy = f_yx without checking the hypotheses", text: "Clairaut's theorem needs the mixed partials to be continuous. For piecewise-defined functions, the two can differ at a point." },
    ],
    limitations: [
      "Second-order partials only. For third-order partials such as f_xyz, run the result through the calculator again.",
      "Variables can be x, y, z, t, u or θ. Other letters are treated as constants.",
      "Piecewise-defined functions are not supported, so the classic counterexamples to Clairaut's theorem cannot be entered.",
    ],
    faqs: [
      { q: "What is the difference between f_xy and f_yx?", a: "f_xy differentiates in x first, then y; f_yx does y first, then x. For functions with continuous second partials, which includes almost every function in a calculus course, they are equal." },
      { q: "How do I enter f_xy in the calculator?", a: "Choose x under “With respect to” and y under “Then with respect to”. The calculator starts with y already selected as the second variable on this page." },
      { q: "What does a mixed partial derivative mean?", a: "f_xy is the rate at which the x-slope of the surface changes as you move in the y-direction. A nonzero f_xy means the surface twists." },
      { q: "Why are mixed partials used in the second derivative test?", a: "In two variables, f_xx and f_yy alone cannot tell a saddle from an extremum. The test uses D = f_xx·f_yy − f_xy², which includes the mixed partial." },
    ],
    related: ["partial-derivative-calculator", "clairauts-theorem-calculator", "second-derivative-calculator"],
    guide: { href: "/guides/derivative-rules", label: "The derivative rules used in each stage" },
    articles: ["what-partial-derivatives-mean-geometrically"],
  },

  {
    slug: "clairauts-theorem-calculator",
    image: { src: "/images/clairauts-theorem.webp", alt: "Two curved paths leaving the same starting point, one passing over the top and one underneath, that arrive at the same end point", width: 1600, height: 800, caption: "Two routes, one destination: differentiating in x then y, or in y then x, gives the same mixed partial when the second partials are continuous." },
    metaTitle: "Clairaut's Theorem Calculator – Check if fxy = fyx with Steps",
    metaDescription:
      "Compute both mixed partial derivatives fxy and fyx step by step and check whether they are equal, as Clairaut's theorem predicts. Free, runs in your browser.",
    h1: "Clairaut's Theorem Calculator",
    intro:
      "Enter a function of two variables to compute both mixed partial derivatives, f_xy and f_yx, with full steps, and see whether they agree. The comparison is made symbolically and checked numerically at sample points.",
    operations: ["clairaut"],
    solverExamples: [
      { label: "x^2 y^3", operation: "clairaut", expression: "x^2 y^3", variable: "x", variable2: "y" },
      { label: "x e^y + y sin(x)", operation: "clairaut", expression: "x e^y + y sin(x)", variable: "x", variable2: "y" },
      { label: "ln(x^2 + y^2)", operation: "clairaut", expression: "ln(x^2 + y^2)", variable: "x", variable2: "y" },
      { label: "x/y", operation: "clairaut", expression: "x/y", variable: "x", variable2: "y" },
      { label: "e^(x y) cos(y)", operation: "clairaut", expression: "e^(x y) cos(y)", variable: "x", variable2: "y" },
    ],
    definition: {
      heading: "What does Clairaut's theorem say?",
      paragraphs: [
        "Clairaut's theorem, also called Schwarz's theorem or the symmetry of second derivatives, says that if f_xy and f_yx are both continuous on an open region around a point, then they are equal at that point. In other words, for well-behaved functions, the order in which you take partial derivatives does not matter.",
        "This saves work: you can differentiate in whichever order is easier. It also explains why the Hessian matrix of second partials is symmetric. The theorem extends to any number of variables and to higher-order mixed partials.",
      ],
      formula: t`f_{xy}, f_{yx} \text{ continuous near } (a, b) \;\Longrightarrow\; f_{xy}(a, b) = f_{yx}(a, b)`,
    },
    rules: {
      heading: "Key facts about Clairaut's theorem",
      intro: "When the theorem applies, and what happens when it does not.",
      items: [
        { name: "The statement", latex: t`\frac{\partial^{2} f}{\partial y\,\partial x} = \frac{\partial^{2} f}{\partial x\,\partial y}`, text: "Holds wherever both mixed partials are continuous." },
        { name: "Where it always applies", latex: t`\text{polynomials, } e^{x},\ \sin,\ \cos,\ \ln,\ \sqrt{\ }`, text: "Sums, products, quotients and compositions of these are smooth wherever they are defined." },
        { name: "Higher orders", latex: t`f_{xyy} = f_{yxy} = f_{yyx}`, text: "With continuous partials of that order, only how many times each variable appears matters." },
        { name: "Classic counterexample", latex: t`f = \frac{xy\left(x^{2} - y^{2}\right)}{x^{2} + y^{2}},\ f(0, 0) = 0`, text: "Here f_xy(0, 0) = −1 but f_yx(0, 0) = 1: the mixed partials exist but are not continuous at the origin." },
        { name: "Symmetric Hessian", latex: t`H^{T} = H`, text: "Because f_xy = f_yx, the matrix of second partials is symmetric." },
      ],
    },
    howItWorks: [
      "The calculator differentiates your function with respect to the first variable and then the second to get f_xy, and separately in the opposite order to get f_yx. All four partial derivatives are shown step by step.",
      "The two results are subtracted and simplified. If the difference simplifies to 0, they are equal identically. Otherwise they are compared numerically at several sample points, so equal results written in different forms are still recognised.",
      "Each of the four partial derivatives is checked against a finite-difference estimate. A table at the end lists f_x, f_y, f_xy and f_yx together.",
    ],
    examples: [
      {
        title: "A polynomial",
        problem: t`f = x^{2}y^{3}`,
        steps: [
          { text: "x first, then y:", math: t`f_{x} = 2xy^{3},\qquad f_{xy} = 6xy^{2}` },
          { text: "y first, then x:", math: t`f_{y} = 3x^{2}y^{2},\qquad f_{yx} = 6xy^{2}` },
        ],
        answer: t`f_{xy} = f_{yx} = 6xy^{2}`,
        check: { operation: "clairaut", expression: "x^2 y^3", variable: "x", variable2: "y", expected: "6x y^2" },
      },
      {
        title: "Exponential and trig terms",
        problem: t`f = x\,e^{y} + y\sin x`,
        steps: [
          { text: "x first, then y:", math: t`f_{x} = e^{y} + y\cos x,\qquad f_{xy} = e^{y} + \cos x` },
          { text: "y first, then x:", math: t`f_{y} = x\,e^{y} + \sin x,\qquad f_{yx} = e^{y} + \cos x` },
        ],
        answer: t`f_{xy} = f_{yx} = e^{y} + \cos x`,
        check: { operation: "clairaut", expression: "x e^y + y sin(x)", variable: "x", variable2: "y", expected: "e^y + cos(x)" },
      },
      {
        title: "A logarithm (equal away from the origin)",
        problem: t`f = \ln\left(x^{2} + y^{2}\right)`,
        steps: [
          { text: "First partials:", math: t`f_{x} = \frac{2x}{x^{2} + y^{2}},\qquad f_{y} = \frac{2y}{x^{2} + y^{2}}` },
          { text: "Differentiating f_x in y and f_y in x both give the same quotient. f is undefined at (0, 0), so the theorem applies everywhere else." },
        ],
        answer: t`f_{xy} = f_{yx} = -\frac{4xy}{\left(x^{2} + y^{2}\right)^{2}}`,
        check: { operation: "clairaut", expression: "ln(x^2 + y^2)", variable: "x", variable2: "y", expected: "-4x y/(x^2 + y^2)^2" },
      },
      {
        title: "A quotient",
        problem: t`f = \frac{x}{y}`,
        steps: [
          { text: "x first: f_x = 1/y, then in y:", math: t`f_{xy} = -\frac{1}{y^{2}}` },
          { text: "y first: f_y = −x/y², then in x:", math: t`f_{yx} = -\frac{1}{y^{2}}` },
        ],
        answer: t`f_{xy} = f_{yx} = -\frac{1}{y^{2}}`,
        check: { operation: "clairaut", expression: "x/y", variable: "x", variable2: "y", expected: "-1/y^2" },
      },
    ],
    mistakes: [
      { title: "Thinking the theorem always holds", text: "It needs continuous mixed partials. Piecewise functions defined separately at a point, like the classic counterexample, can have f_xy ≠ f_yx there." },
      { title: "Using it as a shortcut before checking smoothness", text: "For the functions in a typical course, the hypotheses hold wherever f is defined. Points where f or its derivatives are undefined need separate care." },
      { title: "Confusing f_xy with f_xx", text: "Clairaut's theorem is about mixed partials in two different variables. f_xx and f_yy are not related by it." },
      { title: "Comparing unsimplified forms", text: "Two correct mixed partials can look different before simplifying. Compare them after simplification, or numerically at a few points." },
    ],
    limitations: [
      "Compares second-order mixed partials of two chosen variables. Other variables in the function are treated as constants.",
      "Piecewise-defined functions cannot be entered, so the textbook counterexamples cannot be tested directly.",
      "The numerical comparison uses sample points where both results are defined; points where the function is undefined are skipped.",
    ],
    faqs: [
      { q: "Is fxy always equal to fyx?", a: "Not always, but whenever both are continuous near the point. For polynomials, exponentials, trig functions, logarithms and their combinations, that holds wherever the function is defined." },
      { q: "Who was Clairaut?", a: "Alexis Clairaut was an 18th-century French mathematician. The result is also credited to Hermann Schwarz, who gave a rigorous proof, so it is often called Schwarz's theorem." },
      { q: "What is an example where fxy ≠ fyx?", a: "f(x, y) = xy(x² − y²)/(x² + y²) with f(0, 0) = 0. At the origin, f_xy = −1 and f_yx = 1, because the mixed partials are not continuous there." },
      { q: "Why is Clairaut's theorem useful?", a: "It lets you choose the easier order of differentiation, halves the work of computing a Hessian, and is used in tests for exact differential equations and conservative vector fields." },
    ],
    related: ["mixed-partial-derivative-calculator", "partial-derivative-calculator", "implicit-differentiation-calculator"],
    guide: { href: "/guides/derivative-rules", label: "The derivative rules behind each partial" },
    articles: ["what-partial-derivatives-mean-geometrically"],
  },

  {
    slug: "leibniz-vs-lagrange-notation-calculator",
    image: { src: "/images/derivative-notation.webp", alt: "An S-shaped curve with a tangent line at one point and a small right triangle showing rise over run along the tangent", width: 1600, height: 800, caption: "The slope of the tangent line is the derivative. Lagrange writes it f′(x); Leibniz writes it dy/dx, a ratio of a small rise to a small run." },
    metaTitle: "Leibniz vs Lagrange Notation – Derivative Notation Calculator",
    metaDescription:
      "Compare Leibniz (dy/dx) and Lagrange (f′(x)) notation, plus Euler and Newton. Enter any function to see its derivative written in every notation, with steps.",
    h1: "Leibniz vs Lagrange Notation Calculator",
    intro:
      "Leibniz's dy/dx and Lagrange's f′(x) are two ways of writing the same derivative. Enter a function to find its derivative step by step and see the result written in Lagrange, Leibniz, Euler and Newton notation side by side.",
    operations: ["derivative-notation"],
    solverExamples: [
      { label: "x^3 - 5x", operation: "derivative-notation", expression: "x^3 - 5x", variable: "x" },
      { label: "(x^2 + 1)^3", operation: "derivative-notation", expression: "(x^2 + 1)^3", variable: "x" },
      { label: "sin(2x), 2nd", operation: "derivative-notation", expression: "sin(2x)", variable: "x", order: 2 },
      { label: "5t^2 (time t)", operation: "derivative-notation", expression: "5t^2", variable: "t" },
      { label: "e^x ln(x)", operation: "derivative-notation", expression: "e^x ln(x)", variable: "x" },
    ],
    definition: {
      heading: "Leibniz vs Lagrange notation: what's the difference?",
      paragraphs: [
        "Lagrange notation writes the derivative of f as f′(x), read “f prime of x”, with more primes for higher derivatives: f″(x), f‴(x), then f⁽ⁿ⁾(x). It is short, names the function, and makes evaluating at a point easy: f′(2).",
        "Leibniz notation writes the derivative of y = f(x) as dy/dx, with d²y/dx² for the second derivative. It shows which variable you differentiate with respect to, and behaves like a fraction in useful ways: the chain rule becomes dy/dx = dy/du · du/dx. Both notations mean exactly the same derivative.",
      ],
      formula: t`f'(x) = \frac{dy}{dx} = \frac{d}{dx}\,f(x) = D_{x}f`,
    },
    rules: {
      heading: "The four derivative notations compared",
      intro: "Each notation is the same derivative, written for a different job.",
      items: [
        { name: "Lagrange (prime)", latex: t`f'(x),\quad f''(x),\quad f^{(n)}(x)`, text: "Short; best for naming derivatives of functions and evaluating at a point, like f′(3)." },
        { name: "Leibniz (d/dx)", latex: t`\frac{dy}{dx},\quad \frac{d^{2}y}{dx^{2}},\quad \frac{d^{n}y}{dx^{n}}`, text: "Shows the variable; best for the chain rule, related rates, implicit differentiation and integrals." },
        { name: "Evaluating at a point", latex: t`f'(a) \quad\text{vs}\quad \left.\frac{dy}{dx}\right|_{x = a}`, text: "Lagrange is much shorter here; Leibniz needs a vertical evaluation bar." },
        { name: "Chain rule", latex: t`\left(f \circ g\right)'(x) = f'\big(g(x)\big)\,g'(x) \quad\text{vs}\quad \frac{dy}{dx} = \frac{dy}{du}\cdot\frac{du}{dx}`, text: "Leibniz makes the chain rule look like cancelling du, which is easy to remember." },
        { name: "Euler (operator D)", latex: t`D_{x}f,\quad D^{2}f`, text: "Treats differentiation as an operator; common in differential equations." },
        { name: "Newton (dot)", latex: t`\dot{y},\quad \ddot{y}`, text: "A dot over the variable means a derivative with respect to time; used in physics and mechanics." },
      ],
    },
    howItWorks: [
      "The calculator differentiates your function with the same rule-based engine as the derivative calculator, naming each rule it applies, and checks the result numerically.",
      "The answer is then written in each standard notation: Lagrange's f′(x), Leibniz's dy/dx, Euler's D_x f and, for first and second derivatives, Newton's dot notation. Choose the order to see f″, d²y/dx² and so on.",
      "Newton's dot notation is meant for derivatives with respect to time, so it is labelled as such unless your variable is t.",
    ],
    examples: [
      {
        title: "A polynomial in both notations",
        problem: t`y = x^{3} - 5x`,
        steps: [
          { text: "Power rule term by term:", math: t`3x^{2} - 5` },
          { text: "Lagrange: f′(x) = 3x² − 5. Leibniz: dy/dx = 3x² − 5. Same derivative, two spellings." },
        ],
        answer: t`f'(x) = \frac{dy}{dx} = 3x^{2} - 5`,
        check: { operation: "derivative-notation", expression: "x^3 - 5x", variable: "x", expected: "3x^2 - 5" },
      },
      {
        title: "The chain rule in Leibniz notation",
        problem: t`y = \left(x^{2} + 1\right)^{3}`,
        steps: [
          { text: "Let u = x² + 1, so y = u³. Leibniz notation turns the chain rule into a product of rates:", math: t`\frac{dy}{dx} = \frac{dy}{du}\cdot\frac{du}{dx} = 3u^{2}\cdot 2x` },
          { text: "Substitute u back. In Lagrange notation this is f′(g(x))·g′(x) with f(u) = u³ and g(x) = x² + 1." },
        ],
        answer: t`\frac{dy}{dx} = 6x\left(x^{2} + 1\right)^{2}`,
        check: { operation: "derivative-notation", expression: "(x^2 + 1)^3", variable: "x", expected: "6x (x^2 + 1)^2" },
      },
      {
        title: "A second derivative",
        problem: t`y = \sin(2x)`,
        steps: [
          { text: "First derivative:", math: t`f'(x) = \frac{dy}{dx} = 2\cos(2x)` },
          { text: "Second derivative. The 2 in d²y/dx² is not a square of d: it counts how many times you differentiate.", math: t`f''(x) = \frac{d^{2}y}{dx^{2}} = -4\sin(2x)` },
        ],
        answer: t`f''(x) = \frac{d^{2}y}{dx^{2}} = -4\sin(2x)`,
        check: { operation: "derivative-notation", expression: "sin(2x)", variable: "x", order: 2, expected: "-4 sin(2x)" },
      },
      {
        title: "Newton's dot notation for velocity",
        problem: t`s(t) = 5t^{2}`,
        steps: [
          { text: "Differentiate with respect to time t:", math: t`10t` },
          { text: "All of s′(t), ds/dt and ṡ name the velocity. Physicists usually write ṡ = 10t." },
        ],
        answer: t`s'(t) = \frac{ds}{dt} = \dot{s} = 10t`,
        check: { operation: "derivative-notation", expression: "5t^2", variable: "t", expected: "10t" },
      },
    ],
    mistakes: [
      { title: "Treating dy/dx as an ordinary fraction everywhere", text: "dy/dx behaves like a fraction in the chain rule and in separating variables, but d²y/dx² is not (dy/dx)²." },
      { title: "Reading f′(x) as f times x", text: "The prime belongs to f: f′(x) is the derivative evaluated at x, not a product." },
      { title: "Mixing notations in one line", text: "Writing f′(x) = dy/dx is fine, but dy′/dx or d/dx f′ for a first derivative mixes them up. Pick one notation per step." },
      { title: "Forgetting the variable in Lagrange notation", text: "f′ hides which variable is used. When a function has several variables or parameters, Leibniz's d/dx (or ∂/∂x) avoids ambiguity." },
    ],
    limitations: [
      "Ordinary derivatives of one variable, up to the 10th order. Partial derivatives use ∂ notation on the partial derivative calculator.",
      "Newton's dot notation is shown for first and second derivatives only, which is how it is used in practice.",
      "The notation table shows the general derivative; to evaluate at a point, substitute into the result.",
    ],
    faqs: [
      { q: "Is dy/dx the same as f′(x)?", a: "Yes. If y = f(x), then dy/dx and f′(x) are two notations for the same derivative. Leibniz's dy/dx names the variables; Lagrange's f′(x) names the function." },
      { q: "Which notation should I use?", a: "Use f′(x) when naming derivatives of functions or evaluating at a point. Use dy/dx for the chain rule, related rates, implicit differentiation and anything involving integrals. Many solutions use both." },
      { q: "Who invented Leibniz and Lagrange notation?", a: "Gottfried Wilhelm Leibniz introduced dy/dx in the 1670s, while developing calculus independently of Newton. Joseph-Louis Lagrange popularised the prime notation f′(x) about a century later." },
      { q: "What does Newton's dot notation mean?", a: "A dot over a variable means its derivative with respect to time: ẋ is velocity and ẍ is acceleration. Newton used it in his fluxions; it remains common in physics." },
    ],
    related: ["derivative-calculator", "second-derivative-calculator", "chain-rule-calculator"],
    guide: { href: "/guides/derivative-rules", label: "Derivative rules explained with examples" },
    articles: ["how-to-find-the-derivative-of-a-function"],
  },

  {
    slug: "average-value-of-a-function-calculator",
    image: { src: "/images/average-value.webp", alt: "The area under a hump-shaped curve between a and b, with a dashed rectangle over the same interval whose top crosses the curve at one marked point", width: 1600, height: 800, caption: "The dashed rectangle has the same area as the region under the curve. Its height is the average value, and the marked point is where f(c) equals it." },
    metaTitle: "Average Value of a Function Calculator with Steps",
    metaDescription:
      "Find the average value of a function on [a, b] step by step: the definite integral divided by b − a, with the point c where f(c) equals the average.",
    h1: "Average Value of a Function Calculator",
    intro:
      "Find the average value of f(x) on an interval [a, b]. The calculator evaluates the definite integral with full steps, divides by the length of the interval, and finds where the function actually takes its average value.",
    operations: ["average-value"],
    solverExamples: [
      { label: "x^2 on [0, 3]", operation: "average-value", expression: "x^2", lower: "0", upper: "3" },
      { label: "sin(x) on [0, π]", operation: "average-value", expression: "sin(x)", lower: "0", upper: "pi" },
      { label: "1/x on [1, e]", operation: "average-value", expression: "1/x", lower: "1", upper: "e" },
      { label: "sqrt(x) on [0, 4]", operation: "average-value", expression: "sqrt(x)", lower: "0", upper: "4" },
      { label: "e^(-x^2) on [0, 1]", operation: "average-value", expression: "e^(-x^2)", lower: "0", upper: "1" },
    ],
    definition: {
      heading: "What is the average value of a function?",
      paragraphs: [
        "The average value of a continuous function f on [a, b] is the integral of f over the interval divided by the interval's length. It is the continuous version of adding up values and dividing by how many there are.",
        "Geometrically, f_avg is the height of the rectangle on [a, b] whose area equals the area under the curve. The mean value theorem for integrals guarantees that a continuous f actually reaches its average value: there is at least one c in [a, b] with f(c) = f_avg.",
      ],
      formula: t`f_{\text{avg}} = \frac{1}{b - a}\int_{a}^{b} f(x)\,dx`,
    },
    rules: {
      heading: "Formulas for the average value",
      intro: "Three facts cover almost every average value problem.",
      items: [
        { name: "Average value", latex: t`f_{\text{avg}} = \frac{1}{b - a}\int_{a}^{b} f(x)\,dx`, text: "Integrate over the interval, then divide by its length." },
        { name: "Mean value theorem for integrals", latex: t`f(c) = f_{\text{avg}} \ \text{for some } c \in [a, b]`, text: "Holds whenever f is continuous on [a, b]. Solve f(c) = f_avg to find c." },
        { name: "Rectangle picture", latex: t`f_{\text{avg}}\,(b - a) = \int_{a}^{b} f(x)\,dx`, text: "A rectangle of height f_avg over [a, b] has the same area as the region under f." },
        { name: "Average rate of change", latex: t`\frac{1}{b - a}\int_{a}^{b} F'(x)\,dx = \frac{F(b) - F(a)}{b - a}`, text: "The average of a derivative is the average rate of change of the original function." },
      ],
    },
    howItWorks: [
      "The calculator evaluates the definite integral of f from a to b, using an antiderivative and the Fundamental Theorem of Calculus where possible and accurate numerical integration otherwise, with every step shown.",
      "It then divides by b − a. When the integral is exact, so is the average, such as 2/π; otherwise the average is a decimal approximation.",
      "Finally it searches [a, b] for points c where f(c) equals the average, as the mean value theorem for integrals promises for continuous functions, and lists them in the notes.",
    ],
    examples: [
      {
        title: "A polynomial",
        problem: t`f(x) = x^{2} \ \text{on}\ [0, 3]`,
        steps: [
          { text: "Integrate:", math: t`\int_{0}^{3} x^{2}\,dx = \left[\frac{x^{3}}{3}\right]_{0}^{3} = 9` },
          { text: "Divide by the length b − a = 3:", math: t`f_{\text{avg}} = \frac{9}{3} = 3` },
          { text: "f(c) = c² = 3 at c = √3 ≈ 1.732, inside [0, 3]." },
        ],
        answer: t`f_{\text{avg}} = 3`,
        check: { operation: "average-value", expression: "x^2", lower: "0", upper: "3", expected: "3" },
      },
      {
        title: "One arch of the sine curve",
        problem: t`f(x) = \sin x \ \text{on}\ [0, \pi]`,
        steps: [
          { text: "Integrate:", math: t`\int_{0}^{\pi} \sin x\,dx = \left[-\cos x\right]_{0}^{\pi} = 2` },
          { text: "Divide by π:", math: t`f_{\text{avg}} = \frac{2}{\pi} \approx 0.637` },
          { text: "The average height of the arch is about 64% of its peak height of 1." },
        ],
        answer: t`f_{\text{avg}} = \frac{2}{\pi}`,
        check: { operation: "average-value", expression: "sin(x)", lower: "0", upper: "pi", expected: "2/pi" },
      },
      {
        title: "A reciprocal",
        problem: t`f(x) = \frac{1}{x} \ \text{on}\ [1, e]`,
        steps: [
          { text: "Integrate:", math: t`\int_{1}^{e} \frac{1}{x}\,dx = \left[\ln x\right]_{1}^{e} = 1` },
          { text: "Divide by e − 1:", math: t`f_{\text{avg}} = \frac{1}{e - 1} \approx 0.582` },
          { text: "1/c = 1/(e − 1) at c = e − 1 ≈ 1.718." },
        ],
        answer: t`f_{\text{avg}} = \frac{1}{e - 1}`,
        check: { operation: "average-value", expression: "1/x", lower: "1", upper: "e", expected: "1/(e - 1)" },
      },
      {
        title: "A quadratic on a shifted interval",
        problem: t`f(x) = 3x^{2} - 2x \ \text{on}\ [1, 4]`,
        steps: [
          { text: "Integrate:", math: t`\int_{1}^{4} \left(3x^{2} - 2x\right)dx = \left[x^{3} - x^{2}\right]_{1}^{4} = 48 - 0 = 48` },
          { text: "Divide by the length 4 − 1 = 3:", math: t`f_{\text{avg}} = \frac{48}{3} = 16` },
        ],
        answer: t`f_{\text{avg}} = 16`,
        check: { operation: "average-value", expression: "3x^2 - 2x", lower: "1", upper: "4", expected: "16" },
      },
      {
        title: "A square root",
        problem: t`f(x) = \sqrt{x} \ \text{on}\ [0, 4]`,
        steps: [
          { text: "Integrate:", math: t`\int_{0}^{4} x^{1/2}\,dx = \left[\tfrac{2}{3}x^{3/2}\right]_{0}^{4} = \frac{16}{3}` },
          { text: "Divide by 4:", math: t`f_{\text{avg}} = \frac{16}{3}\cdot\frac{1}{4} = \frac{4}{3}` },
          { text: "√c = 4/3 at c = 16/9 ≈ 1.78." },
        ],
        answer: t`f_{\text{avg}} = \frac{4}{3}`,
        check: { operation: "average-value", expression: "sqrt(x)", lower: "0", upper: "4", expected: "4/3" },
      },
    ],
    mistakes: [
      { title: "Forgetting to divide by b − a", text: "The definite integral alone is the area (total accumulation), not the average. Always divide by the interval's length." },
      { title: "Averaging the endpoint values", text: "(f(a) + f(b))/2 is not the average value unless f is linear. For x² on [0, 3] it gives 4.5, but the true average is 3." },
      { title: "Dividing by b + a or by the wrong length", text: "The length of [a, b] is b − a. For [−2, 3] it is 5, not 1." },
      { title: "Treating the average of a velocity as its average speed", text: "The average value of velocity is net displacement over time. If the object turns around, average speed (using |v|) is larger." },
    ],
    limitations: [
      "The interval must be finite, with b larger than a. An infinite interval has no average value in this sense.",
      "If the integral diverges on the interval, for example 1/x² on [−1, 1], there is no finite average value.",
      "The points c are found numerically and listed only when the function crosses its average value inside the interval.",
    ],
    faqs: [
      { q: "How do you find the average value of a function?", a: "Integrate f from a to b and divide by b − a. For x² on [0, 3]: the integral is 9, the length is 3, so the average value is 3." },
      { q: "Is the average value the same as the mean value theorem?", a: "They are related. The average value is a number; the mean value theorem for integrals says a continuous function equals that number at some point c in [a, b]." },
      { q: "Can the average value be negative?", a: "Yes. If more of the area lies below the x-axis than above it, the definite integral is negative, so the average value is too." },
      { q: "What is the average value of sin(x)?", a: "Over one arch [0, π] it is 2/π ≈ 0.637. Over a full period [0, 2π] it is 0, because the positive and negative halves cancel." },
    ],
    related: ["integral-calculator", "derivative-calculator", "limit-calculator"],
    guide: { href: "/guides/integration-techniques", label: "Integration techniques for the integral step" },
    articles: ["how-to-find-the-derivative-of-a-function"],
  },
];
