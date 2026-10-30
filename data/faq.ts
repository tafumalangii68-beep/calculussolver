import type { Faq } from "@/types/content";

export const faqGroups: { title: string; faqs: Faq[] }[] = [
  {
    title: "Using the solver",
    faqs: [
      { q: "What is a calculus solver?", a: "A calculus solver is a program that performs calculus operations, such as differentiation, integration and limits, symbolically, like a person would on paper, rather than only producing decimal approximations. This one also explains each step." },
      { q: "Do I need to type multiplication signs?", a: "No. 2x, x sin(x) and (x+1)(x-1) are all understood. Add * whenever you want to be explicit, and check the “Reads as” preview." },
      { q: "How do I type fractions, roots and exponents?", a: "Use / for fractions with parentheses around multi-term parts, such as (x+1)/(x-1). Use sqrt(x) or x^(1/2) for roots, and ^ for powers. For exponents longer than one term, use parentheses: e^(2x)." },
      { q: "Which variable can I use?", a: "x is the default; t, y, z, u and θ are also available from the Variable menu. In derivatives and indefinite integrals, other letters are treated as constants." },
      { q: "Does it work on a phone?", a: "Yes. The layout adapts to small screens, and the on-screen keypad (tap “Show keypad”) inserts symbols that are hard to type on a phone keyboard. Long expressions scroll inside their own box." },
      { q: "Can I copy the answer into my notes?", a: "Yes. “Copy answer” copies plain text that the solver can read back in, and “Copy LaTeX” copies typeset math for documents and LaTeX editors." },
    ],
  },
  {
    title: "Accuracy and methods",
    faqs: [
      { q: "How do I know an answer is right?", a: "Each answer is checked independently before it is shown: antiderivatives by differentiating them, definite integrals against numerical integration, limits by evaluating near the point, and derivatives against finite differences. The result panel tells you which check was done." },
      { q: "Why does the solver say it can't solve something?", a: "Either the problem has no answer in elementary functions (some integrals are like this) or it needs a method the solver doesn't support. Refusing is better than showing a wrong answer." },
      { q: "Does the solver use AI?", a: "No. It uses deterministic computer algebra rules and established numerical methods, so the same input always gives the same output." },
      { q: "Why do some answers have ≈?", a: "≈ marks a numerical approximation. It is typically accurate to about 10 significant digits, and is used when no exact form was found." },
    ],
  },
  {
    title: "Privacy and access",
    faqs: [
      { q: "Do I need an account?", a: "No. There is nothing to sign up for. Every calculator is available immediately." },
      { q: "Is anything I type saved?", a: "No. Expressions are processed in your browser and are not stored, even locally. Reloading the page clears them." },
      { q: "Does it work offline?", a: "Once a calculator page has fully loaded, solving does not need an internet connection, because the math engine runs on your device. You need a connection only to open new pages." },
    ],
  },
  {
    title: "Studying with the solver",
    faqs: [
      { q: "Is it okay to use this for homework?", a: "Using it to check your work and understand steps is a great way to learn. Whether you may use it on graded work depends on your teacher's rules, so always follow them." },
      { q: "What's the best way to learn from the steps?", a: "Try the problem first. Then compare your work with the solver line by line and find the first place they differ. That is usually the rule you need to practise." },
      { q: "Where can I learn the rules themselves?", a: "Start with the guides on derivative rules and integration techniques, then the explanations on each calculator page." },
    ],
  },
];
