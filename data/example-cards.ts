// Placeholder cards for the homepage testimonials carousel, shown ONLY while there are
// fewer than three approved real reviews. They are clearly labelled as examples, have no
// names or ratings, and describe what the site actually does; they are not reviews.

export interface ExampleCard {
  topic: string;
  text: string;
}

export const exampleCards: ExampleCard[] = [
  { topic: "Derivatives", text: "Every derivative is broken into named steps (sum, product, quotient and chain rule) so you can compare each line with your own working." },
  { topic: "Integrals", text: "Indefinite integrals show the technique used, from u-substitution to integration by parts, and every answer is checked by differentiating it." },
  { topic: "Limits", text: "Limits are evaluated by substitution, factoring or L'Hôpital's rule, and confirmed numerically from the side you choose." },
  { topic: "Taylor series", text: "Taylor and Maclaurin polynomials come with a table of exact derivatives and coefficients for every term." },
  { topic: "Critical points", text: "Critical points are found exactly where possible and classified as a local maximum, minimum or neither, with the test that decided it." },
  { topic: "Second derivatives", text: "Second derivatives show both passes, first f′ and then f″, ready for concavity and inflection-point questions." },
  { topic: "Partial derivatives", text: "Partial derivatives hold the other variables constant and support second partials such as f_xy, with ∂ notation in every step." },
  { topic: "Implicit differentiation", text: "Enter an equation like x² + y² = 25 to get dy/dx, then add a point to see the slope and the tangent line there." },
  { topic: "Privacy", text: "Everything is solved in your browser. Nothing you type is uploaded or stored, and no account is needed." },
  { topic: "Learning", text: "Worked examples and study guides explain each rule, so the solver helps you check your understanding instead of replacing it." },
];
