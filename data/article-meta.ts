// Presentation details for guides and blog posts: category label, related calculators and
// short tip/note callouts placed after specific sections. Article text lives in
// data/guides.ts and data/blog.ts.

import type { CalculatorSlug } from "@/lib/site-config";

export interface Callout {
  /** Shown after the section with this id. */
  after: string;
  kind: "tip" | "note";
  text: string;
}

export interface ArticleMeta {
  category: string;
  related: CalculatorSlug[];
  callouts: Callout[];
}

export const articleMeta: Record<string, ArticleMeta> = {
  "derivative-rules": {
    category: "Derivatives",
    related: ["derivative-calculator", "chain-rule-calculator", "second-derivative-calculator", "implicit-differentiation-calculator", "partial-derivative-calculator", "critical-points-calculator"],
    callouts: [
      { after: "power-rule", kind: "tip", text: "Rewrite roots and reciprocals as powers first: √x = x^(1/2) and 1/x³ = x^(−3). Then the power rule applies directly." },
      { after: "product-quotient", kind: "note", text: "In the quotient rule the order matters: the numerator is f′g − fg′, derivative of the top first. Swapping the two terms flips the sign of the answer." },
      { after: "chain-rule", kind: "tip", text: "Work from the outside in: differentiate the outer function, leave its inside unchanged, then multiply by the derivative of the inside." },
    ],
  },
  "integration-techniques": {
    category: "Integrals",
    related: ["integral-calculator", "derivative-calculator", "taylor-series-calculator"],
    callouts: [
      { after: "decision-order", kind: "tip", text: "Check any antiderivative by differentiating it. If you get the integrand back, the answer is right (up to the constant C)." },
      { after: "parts", kind: "tip", text: "LIATE (logarithmic, inverse trig, algebraic, trigonometric, exponential) is a common rule of thumb for choosing u: pick the type that comes first in the list." },
      { after: "no-antiderivative", kind: "note", text: "A definite integral can still have an exact value, or an accurate numerical value, even when the integrand has no elementary antiderivative." },
    ],
  },
  "how-to-find-the-derivative-of-a-function": {
    category: "Derivatives",
    related: ["derivative-calculator", "second-derivative-calculator", "chain-rule-calculator", "implicit-differentiation-calculator"],
    callouts: [
      { after: "first-principles", kind: "note", text: "The limit definition always works, but for most functions the differentiation rules give the same answer much faster." },
      { after: "rewrite-first", kind: "tip", text: "Simplify before you differentiate. Expanding a product or splitting a fraction can turn a quotient-rule problem into a power-rule one." },
      { after: "at-a-point", kind: "note", text: "f′(a) is the slope of the tangent line at x = a, so the tangent line is y = f(a) + f′(a)(x − a)." },
    ],
  },
};
