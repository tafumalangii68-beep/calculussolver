import { BookOpen, Calculator, ChevronRight, GraduationCap, Laptop, Layers, ShieldCheck, Zap, type LucideIcon } from "lucide-react";
import Link from "next/link";
import { CookieSettingsButton } from "@/components/cookies/CookieConsent";
import { calculatorNav, guideNav, legalNav, siteConfig, type CalculatorSlug } from "@/lib/site-config";
import { Logo } from "./Logo";

const HIGHLIGHTS: { icon: LucideIcon; label: string }[] = [
  { icon: Zap, label: "Step-by-step solutions" },
  { icon: ShieldCheck, label: "Verified calculations" },
  { icon: Laptop, label: "Browser-based privacy" },
];

const LEARN = [
  { href: "/guides", label: "All guides" },
  ...guideNav.map((g) => ({ href: g.href, label: g.label })),
  { href: "/blog", label: "Blog" },
  { href: "/how-it-works", label: "How the solver works" },
  { href: "/faq", label: "FAQ" },
];

/** "Calculators" holds the main tools; "More Calculators" lists every other calculator page. */
const MAIN: CalculatorSlug[] = [
  "derivative-calculator",
  "second-derivative-calculator",
  "integral-calculator",
  "limit-calculator",
  "taylor-series-calculator",
  "critical-points-calculator",
];
const mainLinks = [{ href: "/", label: "Calculus Solver" }, ...calculatorNav.filter((c) => MAIN.includes(c.slug)).map((c) => ({ href: `/${c.slug}`, label: c.label }))];
const moreLinks = calculatorNav.filter((c) => !MAIN.includes(c.slug)).map((c) => ({ href: `/${c.slug}`, label: c.label }));

const linkClass = "inline-flex min-h-8 items-center text-left text-[15px] leading-snug text-ink-soft transition-colors hover:text-accent-strong";
/** Columns 2–4 are separated by a thin vertical rule on desktop. */
const columnClass = "min-w-0 lg:border-l lg:border-line lg:pl-8";

function ColumnHeading({ icon: Icon, children }: { icon: LucideIcon; children: React.ReactNode }) {
  return (
    <h2 className="flex items-center gap-3 font-display text-lg font-bold text-ink">
      <span aria-hidden className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-accent-soft text-accent-strong">
        <Icon className="h-5 w-5" />
      </span>
      {children}
    </h2>
  );
}

function PlainList({ links }: { links: { href: string; label: string }[] }) {
  return (
    <ul className="mt-5 space-y-1.5">
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

/** A link with a small accent chevron in front, used in the Learn & Site column. */
function ChevronItem({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-2">
      <ChevronRight aria-hidden className="mt-2 h-4 w-4 shrink-0 text-accent-strong" />
      {children}
    </li>
  );
}

export function Footer() {
  return (
    <footer className="on-light mt-24 border-t border-line bg-surface">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-2 lg:grid-cols-[1.1fr_1fr_1.15fr_1.5fr] lg:gap-8 lg:py-14">
        <div className="min-w-0">
          <Logo />
          <p className="mt-5 max-w-xs text-[15px] leading-relaxed text-muted">
            A free, browser-based calculus solver for students and self-learners. Problems are solved on your device and never
            uploaded.
          </p>
          <ul className="mt-6 space-y-3">
            {HIGHLIGHTS.map(({ icon: Icon, label }) => (
              <li key={label} className="flex items-center gap-3 text-[15px] font-medium text-ink">
                <span aria-hidden className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-accent-soft text-accent-strong">
                  <Icon className="h-[18px] w-[18px]" />
                </span>
                {label}
              </li>
            ))}
          </ul>
        </div>

        <nav aria-label="Calculators" className={columnClass}>
          <ColumnHeading icon={Calculator}>Calculators</ColumnHeading>
          <PlainList links={mainLinks} />
        </nav>

        <nav aria-label="More calculators" className={columnClass}>
          <ColumnHeading icon={Layers}>More Calculators</ColumnHeading>
          <PlainList links={moreLinks} />
        </nav>

        <div className={columnClass}>
          <ColumnHeading icon={BookOpen}>Learn &amp; Site</ColumnHeading>
          <div className="mt-5 grid grid-cols-2 gap-x-6">
            <nav aria-label="Learn">
              <ul className="space-y-1.5">
                {LEARN.map((l) => (
                  <ChevronItem key={l.href}>
                    <Link href={l.href} className={linkClass}>
                      {l.label}
                    </Link>
                  </ChevronItem>
                ))}
              </ul>
            </nav>
            <nav aria-label="Legal and site information">
              <ul className="space-y-1.5">
                {legalNav.map((l) => (
                  <ChevronItem key={l.href}>
                    <Link href={l.href} className={linkClass}>
                      {l.label}
                    </Link>
                  </ChevronItem>
                ))}
                <ChevronItem>
                  <CookieSettingsButton className={`${linkClass} cursor-pointer`} />
                </ChevronItem>
              </ul>
            </nav>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex flex-col gap-3 border-t border-accent/25 py-6 text-sm md:flex-row md:items-center md:gap-8">
          <p className="shrink-0 font-medium text-ink md:border-r md:border-line md:pr-8">© {new Date().getFullYear()} CalculusSolver.pro</p>
          <p className="flex items-start gap-2.5 text-ink-soft md:ml-auto">
            <GraduationCap aria-hidden className="mt-0.5 h-5 w-5 shrink-0 text-accent-strong" />
            <span>
              {siteConfig.name} is an educational tool. Always check important results and follow your school&apos;s rules on using
              calculators.
            </span>
          </p>
        </div>
      </div>
    </footer>
  );
}
