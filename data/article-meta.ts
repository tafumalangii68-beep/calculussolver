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
  "how-to-find-critical-points-and-classify-them": {
    category: "Derivatives",
    related: ["critical-points-calculator", "derivative-calculator", "second-derivative-calculator"],
    callouts: [
      { after: "how-to-find", kind: "tip", text: "Factor f′ completely before solving. The factored form gives you the critical points and the signs for the first derivative test at the same time." },
      { after: "second-derivative-test", kind: "note", text: "f″(c) = 0 does not mean “neither”. It only means this test cannot decide, so switch to the first derivative test." },
      { after: "absolute-extrema", kind: "tip", text: "On a closed interval, always check the endpoints. The absolute maximum or minimum is often there, not at a critical point." },
    ],
  },
  "squeeze-theorem-explained-with-examples": {
    category: "Limits",
    related: ["limit-calculator", "derivative-calculator"],
    callouts: [
      { after: "statement", kind: "note", text: "The two outer limits must be equal. If they differ, the squeeze theorem gives no information about the middle function." },
      { after: "method", kind: "tip", text: "Most squeeze problems start from −1 ≤ sin(…) ≤ 1 or −1 ≤ cos(…) ≤ 1. Find the bounded factor first, then build the rest of the function around it." },
      { after: "sin-x-over-x", kind: "note", text: "This limit only equals 1 when x is measured in radians, which is why calculus always uses radians." },
    ],
  },
  "lhopitals-rule-explained-with-examples": {
    category: "Limits",
    related: ["limit-calculator", "derivative-calculator", "chain-rule-calculator"],
    callouts: [
      { after: "when-to-use", kind: "note", text: "Substitute first, every time. If you get a number, that is the answer; L'Hôpital's rule only applies to 0/0 and ∞/∞." },
      { after: "method", kind: "tip", text: "Differentiate the numerator and the denominator separately. If you find yourself writing the quotient rule, stop: that is a different rule." },
      { after: "other-forms", kind: "tip", text: "For any power form, take logarithms: find the limit L of g(x)·ln f(x), and the answer is e^L." },
    ],
  },
  "what-partial-derivatives-mean-geometrically": {
    category: "Derivatives",
    related: ["partial-derivative-calculator", "derivative-calculator", "implicit-differentiation-calculator"],
    callouts: [
      { after: "slices", kind: "tip", text: "Picture a knife cutting the surface. ∂f/∂x cuts parallel to the x-axis (y fixed); ∂f/∂y cuts parallel to the y-axis (x fixed). Each cut leaves an ordinary curve with an ordinary slope." },
      { after: "tangent-plane", kind: "note", text: "The tangent plane uses only f, f_x and f_y at one point, exactly like the tangent line uses only f and f′." },
      { after: "second-partials", kind: "note", text: "f_x = f_y = 0 only says the tangent plane is flat. The second partials decide whether the point is a peak, a pit or a saddle." },
    ],
  },
};
