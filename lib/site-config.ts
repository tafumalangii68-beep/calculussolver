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
  legalUpdated: "2026-10-30",
  /** Date content pages were last reviewed (YYYY-MM-DD). */
  contentUpdated: "2026-10-30",
  /**
   * Optional services. Nothing is loaded unless you configure it here AND the visitor consents.
   * The site currently ships with no analytics or marketing scripts.
   */
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
  | "critical-points-calculator";

export const calculatorNav: { slug: CalculatorSlug; label: string; blurb: string }[] = [
  { slug: "derivative-calculator", label: "Derivative Calculator", blurb: "Any order, with every rule shown" },
  { slug: "integral-calculator", label: "Integral Calculator", blurb: "Indefinite and definite integrals" },
  { slug: "limit-calculator", label: "Limit Calculator", blurb: "One-sided, two-sided and at infinity" },
  { slug: "taylor-series-calculator", label: "Taylor Series Calculator", blurb: "Taylor and Maclaurin polynomials" },
  { slug: "critical-points-calculator", label: "Critical Points Calculator", blurb: "Find and classify extrema" },
];

export const guideNav = [
  { href: "/guides/derivative-rules", label: "Derivative Rules" },
  { href: "/guides/integration-techniques", label: "Integration Techniques" },
] as const;

export const mainNav = [
  { href: "/guides", label: "Guides" },
  { href: "/how-it-works", label: "How It Works" },
  { href: "/faq", label: "FAQ" },
  { href: "/about", label: "About" },
] as const;

export const legalNav = [
  { href: "/about", label: "About Us" },
  { href: "/contact", label: "Contact Us" },
  { href: "/privacy-policy", label: "Privacy Policy" },
  { href: "/terms-and-conditions", label: "Terms and Conditions" },
  { href: "/cookie-policy", label: "Cookie Policy" },
  { href: "/disclaimer", label: "Disclaimer" },
] as const;

export function absoluteUrl(path = "/"): string {
  return path === "/" ? siteConfig.url : `${siteConfig.url}${path}`;
}
