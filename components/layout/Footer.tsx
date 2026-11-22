import Link from "next/link";
import { CookieSettingsButton } from "@/components/cookies/CookieConsent";
import { calculatorNav, guideNav, legalNav, siteConfig, type CalculatorSlug } from "@/lib/site-config";
import { Logo } from "./Logo";

const HIGHLIGHTS = ["Step-by-step solutions", "Every answer verified", "Private: runs in your browser"];

const LEARN = [
  { href: "/guides", label: "All guides" },
  ...guideNav.map((g) => ({ href: g.href, label: g.label })),
  { href: "/blog", label: "Blog" },
  { href: "/how-it-works", label: "How the solver works" },
  { href: "/faq", label: "FAQ" },
];

/** The calculator links are shown in two short lists; every calculator appears in exactly one. */
const CORE: CalculatorSlug[] = [
  "derivative-calculator",
  "second-derivative-calculator",
  "integral-calculator",
  "limit-calculator",
  "taylor-series-calculator",
  "critical-points-calculator",
];
const coreLinks = [{ href: "/", label: "Calculus Solver" }, ...calculatorNav.filter((c) => CORE.includes(c.slug)).map((c) => ({ href: `/${c.slug}`, label: c.label }))];
const advancedLinks = calculatorNav.filter((c) => !CORE.includes(c.slug)).map((c) => ({ href: `/${c.slug}`, label: c.label }));

const linkClass = "inline-flex min-h-7 items-center text-left text-sm text-muted transition-colors hover:text-accent-strong";
const headingClass = "font-display text-sm font-semibold text-ink";

function LinkList({ links }: { links: { href: string; label: string }[] }) {
  return (
    <ul className="mt-3 space-y-1">
      {links.map((l) => (
        <li key={l.href}>
          <Link href={l.href} className={linkClass}>
            {l.label}
          </Link>
        </li>
      ))}
    </ul>
  );
}

export function Footer() {
  return (
    <footer className="on-light mt-24 border-t border-line bg-surface">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-2 lg:grid-cols-[1.2fr_2fr_1fr_1fr] lg:gap-8">
        <div>
          <Logo />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted">
            A free, browser-based calculus solver for students and self-learners. Problems are solved on your device and never
            uploaded.
          </p>
          <ul className="mt-4 space-y-1.5 text-sm text-ink-soft">
            {HIGHLIGHTS.map((h) => (
              <li key={h} className="flex items-center gap-2">
                <span aria-hidden className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                {h}
              </li>
            ))}
          </ul>
        </div>

        <nav aria-label="Calculators">
          <h2 className={headingClass}>Calculators</h2>
          <div className="grid gap-x-8 sm:grid-cols-2">
            <LinkList links={coreLinks} />
            <LinkList links={advancedLinks} />
          </div>
        </nav>

        <nav aria-label="Learn">
          <h2 className={headingClass}>Learn</h2>
          <LinkList links={LEARN} />
        </nav>

        <nav aria-label="Legal and site information">
          <h2 className={headingClass}>Site</h2>
          <ul className="mt-3 space-y-1">
            {legalNav.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className={linkClass}>
                  {l.label}
                </Link>
              </li>
            ))}
            <li>
              <CookieSettingsButton className={`${linkClass} cursor-pointer`} />
            </li>
          </ul>
        </nav>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex flex-col gap-2 border-t border-line py-5 text-xs text-muted md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} CalculusSolver.pro</p>
          <p className="md:max-w-xl md:text-right">
            {siteConfig.name} is an educational tool. Always check important results and follow your school&apos;s rules on using
            calculators.
          </p>
        </div>
      </div>
    </footer>
  );
}
