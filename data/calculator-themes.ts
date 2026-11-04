// Presentation settings for each calculator page: hero highlights, a three-step quick start,
// the order of the content sections and how the rules are displayed. The page text itself
// lives in data/calculators.ts and data/calculators-derivatives.ts.

import type { CalculatorSlug } from "@/lib/site-config";

export type SectionKey = "definition" | "rules" | "how" | "examples" | "mistakes" | "limitations";

/** table: reference table · cards: grid of cards · steps: numbered procedure · sheet: formula sheet. */
export type RulesLayout = "table" | "cards" | "steps" | "sheet";

export interface CalculatorTheme {
  /** Three short, factual highlights shown as chips in the hero. */
  highlights: [string, string, string];
  /** Three-step quick start shown beside the calculator. */
  quickStart: [string, string, string];
  order: SectionKey[];
  rulesLayout: RulesLayout;
  /** Hero glow colour (decorative). */
  glow: string;
}

export const calculatorThemes: Record<CalculatorSlug, CalculatorTheme> = {
  "derivative-calculator": {
    highlights: ["Orders 1 to 10", "Every rule named", "Exact, simplified answers"],
    quickStart: ["Type f(x), for example x^2 sin(x).", "Pick the variable and the order, from 1st to 10th.", "Press Solve to see each rule applied in turn."],
    order: ["definition", "rules", "how", "examples", "mistakes", "limitations"],
    rulesLayout: "table",
    glow: "#7438f5",
  },
  "second-derivative-calculator": {
    highlights: ["f′ and f″ shown", "Concavity and inflection", "Higher orders too"],
    quickStart: ["Type f(x). The order starts at the 2nd derivative.", "Press Solve to get f′(x) first, then f″(x).", "Use the sign of f″ to judge concavity and inflection points."],
    order: ["definition", "rules", "examples", "how", "mistakes", "limitations"],
    rulesLayout: "cards",
    glow: "#8b5cf6",
  },
  "partial-derivative-calculator": {
    highlights: ["∂/∂x, ∂/∂y and more", "Second partials like fxy", "∂ notation in every step"],
    quickStart: ["Type a function of several variables, like x^2 y^3.", "Choose the variable to differentiate with respect to.", "Optionally pick a second variable for fxy and similar."],
    order: ["definition", "rules", "examples", "mistakes", "how", "limitations"],
    rulesLayout: "table",
    glow: "#db2777",
  },
  "chain-rule-calculator": {
    highlights: ["Any depth of nesting", "Outer and inner layers shown", "Combines with product and quotient rules"],
    quickStart: ["Type a composite function, like sin(x^2 + 1).", "Press Solve.", "Read the steps: the outer derivative, times the inner derivative."],
    order: ["definition", "examples", "rules", "mistakes", "how", "limitations"],
    rulesLayout: "cards",
    glow: "#2563eb",
  },
  "implicit-differentiation-calculator": {
    highlights: ["dy/dx = −Fx / Fy", "Slope at a point", "Tangent line equation"],
    quickStart: ["Type an equation in x and y, like x^2 + y^2 = 25.", "Optionally add a point on the curve, like 3, 4.", "Press Solve for dy/dx, plus the slope and tangent line."],
    order: ["definition", "rules", "examples", "mistakes", "how", "limitations"],
    rulesLayout: "steps",
    glow: "#9333ea",
  },
  "integral-calculator": {
    highlights: ["Indefinite and definite", "Substitution and by parts", "Improper integrals with ±∞"],
    quickStart: ["Choose Indefinite integral or Definite integral.", "Type the integrand, plus the bounds for a definite integral.", "Press Solve. Each antiderivative is checked by differentiating it."],
    order: ["definition", "rules", "examples", "how", "mistakes", "limitations"],
    rulesLayout: "cards",
    glow: "#10b981",
  },
  "limit-calculator": {
    highlights: ["One- and two-sided", "Limits at infinity", "L'Hôpital's rule steps"],
    quickStart: ["Type f(x) and the value x approaches (inf works too).", "Choose both sides, from the left or from the right.", "Press Solve to see which technique evaluates it."],
    order: ["definition", "rules", "examples", "mistakes", "how", "limitations"],
    rulesLayout: "steps",
    glow: "#f59e0b",
  },
  "taylor-series-calculator": {
    highlights: ["Any center a", "Up to order 10", "Coefficient table"],
    quickStart: ["Type f(x), like e^x or sin(x).", "Set the center a (0 gives a Maclaurin polynomial) and the highest power.", "Press Solve for the polynomial and its table of coefficients."],
    order: ["definition", "rules", "examples", "how", "mistakes", "limitations"],
    rulesLayout: "sheet",
    glow: "#3b82f6",
  },
  "critical-points-calculator": {
    highlights: ["Max, min or neither", "Custom search interval", "Test that decided it"],
    quickStart: ["Type f(x), like x^3 - 3x.", "Set the interval to search.", "Press Solve to find and classify each critical point."],
    order: ["definition", "rules", "examples", "how", "mistakes", "limitations"],
    rulesLayout: "steps",
    glow: "#22c55e",
  },
};
