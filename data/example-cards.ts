// SAMPLE testimonial cards for the homepage carousel, shown ONLY while there are no approved
// real reviews. The names are invented placeholders and the cards are visibly labelled
// "Sample review" in the UI, with a section notice saying they are not from real users.
// They are never counted in ratings, never used in structured data, and describe only
// features the site actually has.

export interface ExampleCard {
  name: string;
  topic: string;
  text: string;
}

export const exampleCards: ExampleCard[] = [
  { name: "Sophia Williams", topic: "Derivatives", text: "Every derivative is broken into named steps, so I can compare each line of the sum, product and chain rule with my own working." },
  { name: "James Carter", topic: "Integrals", text: "Seeing u-substitution and integration by parts laid out step by step, with the answer checked by differentiating, makes integrals click." },
  { name: "Emily Johnson", topic: "Limits", text: "The limit calculator shows whether it used substitution, factoring or L'Hôpital's rule, and confirms the result numerically." },
  { name: "Daniel Anderson", topic: "Taylor series", text: "The table of exact derivatives and coefficients for each Taylor term is perfect for checking series homework." },
  { name: "Olivia Bennett", topic: "Critical points", text: "Critical points come classified as a maximum, minimum or neither, along with the test that decided it." },
  { name: "Ethan Wilson", topic: "Second derivatives", text: "Second derivatives show both passes, f′ and then f″, which is exactly what concavity questions need." },
  { name: "Mia Thompson", topic: "Partial derivatives", text: "Partial derivatives use proper ∂ notation and handle second partials like f_xy without any fuss." },
  { name: "Noah Mitchell", topic: "Implicit differentiation", text: "Type x² + y² = 25, get dy/dx, then add a point to see the slope and tangent line there. Really clear." },
  { name: "Isabella Davis", topic: "Privacy", text: "Everything is solved in the browser, with no account and nothing uploaded. I like that a lot." },
  { name: "Liam Parker", topic: "Learning", text: "The worked examples and study guides explain each rule, so the solver helps me understand instead of just giving answers." },
];
