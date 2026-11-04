// Public site configuration. Edit these values for your deployment.
// There are no environment variables or secrets anywhere in this project.

export const siteConfig = {
  name: "Calculus Solver",
  /** Canonical origin, without a trailing slash. Used for canonical URLs, the sitemap and structured data. */
  url: "https://calculussolver.pro",
  tagline: "Step-by-step derivatives, integrals and limits",
  description:
    "Free calculus solver with step-by-step solutions for derivatives, integrals, limits, Taylor series and critical points. Runs entirely in your browser.",
  locale: "en_US",
  language: "en",
  /**
   * REQUIRED BEFORE LAUNCH: the owner's real contact address.
   * While this is null, the Contact page and legal pages say that no address has been published yet.
   */
  contactEmail: null as string | null,
  /** Date the legal pages were last reviewed (YYYY-MM-DD). */
  legalUpdated: "2026-11-04",
  /** Date content pages were last reviewed (YYYY-MM-DD). */
  contentUpdated: "2026-10-30",
  /**
   * Optional services. Nothing is loaded unless you configure it here AND the visitor consents.
   * The site currently ships with no analytics or marketing scripts.
   */
  stats: {
    /** The "Problems solved" card stays hidden until the real count reaches this number. */
    showSolveCountFrom: 1000,
  },
  services: {
    analytics: null as null | { name: string; privacyUrl: string },
    marketing: null as null | { name: string; privacyUrl: string },
  },
} as const;

export type CalculatorSlug =
  | "derivative-calculator"
  | "integral-calculator"
  | "limit-calculator"
  | "taylor-series-calculator"
  | "critical-points-calculator"
  | "second-derivative-calculator"
  | "partial-derivative-calculator"
  | "chain-rule-calculator"
  | "implicit-differentiation-calculator";

// `titleClass` gives each calculator its own title colour in the menus (tokens in app/globals.css).
export const calculatorNav: { slug: CalculatorSlug; label: string; blurb: string; titleClass: string }[] = [
  { slug: "derivative-calculator", label: "Derivative Calculator", blurb: "Any order, with every rule shown", titleClass: "text-calc-derivative" },
  { slug: "second-derivative-calculator", label: "Second Derivative Calculator", blurb: "f″(x), concavity and inflection", titleClass: "text-calc-second" },
  { slug: "partial-derivative-calculator", label: "Partial Derivative Calculator", blurb: "∂f/∂x, ∂f/∂y and fxy", titleClass: "text-calc-partial" },
  { slug: "chain-rule-calculator", label: "Chain Rule Calculator", blurb: "Compositions, layer by layer", titleClass: "text-calc-chain" },
  { slug: "implicit-differentiation-calculator", label: "Implicit Differentiation Calculator", blurb: "dy/dx for equations in x and y", titleClass: "text-calc-implicit" },
  { slug: "integral-calculator", label: "Integral Calculator", blurb: "Indefinite and definite integrals", titleClass: "text-calc-integral" },
  { slug: "limit-calculator", label: "Limit Calculator", blurb: "One-sided, two-sided and at infinity", titleClass: "text-calc-limit" },
  { slug: "taylor-series-calculator", label: "Taylor Series Calculator", blurb: "Taylor and Maclaurin polynomials", titleClass: "text-calc-taylor" },
  { slug: "critical-points-calculator", label: "Critical Points Calculator", blurb: "Find and classify extrema", titleClass: "text-calc-critical" },
];

export const guideNav = [
  { href: "/guides/derivative-rules", label: "Derivative Rules", titleClass: "text-guide-derivative" },
  { href: "/guides/integration-techniques", label: "Integration Techniques", titleClass: "text-guide-integration" },
] as const;

export const mainNav = [
  { href: "/guides", label: "Guides" },
  { href: "/blog", label: "Blog" },
  { href: "/how-it-works", label: "How It Works" },
  { href: "/faq", label: "FAQ" },
  { href: "/about", label: "About" },
] as const;

export const legalNav = [
  { href: "/about", label: "About Us" },
  { href: "/contact", label: "Contact Us" },
  { href: "/reviews", label: "Reviews" },
  { href: "/privacy-policy", label: "Privacy Policy" },
  { href: "/terms-and-conditions", label: "Terms and Conditions" },
  { href: "/cookie-policy", label: "Cookie Policy" },
  { href: "/disclaimer", label: "Disclaimer" },
] as const;

export function absoluteUrl(path = "/"): string {
  return path === "/" ? siteConfig.url : `${siteConfig.url}${path}`;
}
