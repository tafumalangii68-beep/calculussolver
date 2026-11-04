import { CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { CookieSettingsButton } from "@/components/cookies/CookieConsent";
import { calculatorNav, guideNav, legalNav, siteConfig } from "@/lib/site-config";
import { Logo } from "./Logo";

const linkClass = "text-sm text-white/70 transition-colors hover:text-white";
const headingClass = "font-display text-sm font-bold uppercase tracking-[0.12em] text-white";

const HIGHLIGHTS = ["Step-by-step solutions", "Every answer verified", "Private: runs in your browser"];

const LEARN = [
  { href: "/guides", label: "All guides" },
  ...guideNav.map((g) => ({ href: g.href, label: g.label })),
  { href: "/blog", label: "Blog" },
  { href: "/how-it-works", label: "How the solver works" },
  { href: "/faq", label: "FAQ" },
];

export function Footer() {
  return (
    <footer className="mt-24 bg-navy-gradient text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <Logo />
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/70">
            A free, browser-based calculus solver for students and self-learners. Problems are solved on your device and never
            uploaded.
          </p>
          <ul className="mt-5 space-y-2">
            {HIGHLIGHTS.map((h) => (
              <li key={h} className="flex items-center gap-2 text-sm text-white/85">
                <CheckCircle2 aria-hidden className="h-4 w-4 shrink-0 text-[#b48cff]" />
                {h}
              </li>
            ))}
          </ul>
        </div>
        <nav aria-label="Calculators">
          <h2 className={headingClass}>Calculators</h2>
          <ul className="mt-4 space-y-2.5">
            <li>
              <Link href="/" className={linkClass}>
                Calculus Solver
              </Link>
            </li>
            {calculatorNav.map((c) => (
              <li key={c.slug}>
                <Link href={`/${c.slug}`} className={linkClass}>
                  {c.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <nav aria-label="Learn">
          <h2 className={headingClass}>Learn</h2>
          <ul className="mt-4 space-y-2.5">
            {LEARN.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className={linkClass}>
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <nav aria-label="Legal and site information">
          <h2 className={headingClass}>Site</h2>
          <ul className="mt-4 space-y-2.5">
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
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-5 text-xs text-white/60 sm:px-6 md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} CalculusSolver.pro</p>
          <p>
            {siteConfig.name} is an educational tool. Always check important results and follow your school&apos;s rules on using
            calculators.
          </p>
        </div>
      </div>
    </footer>
  );
}
