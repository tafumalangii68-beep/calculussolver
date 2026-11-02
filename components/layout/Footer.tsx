import Link from "next/link";
import { CookieSettingsButton } from "@/components/cookies/CookieConsent";
import { calculatorNav, guideNav, legalNav, siteConfig } from "@/lib/site-config";

const linkClass = "text-sm text-muted hover:text-ink hover:underline underline-offset-2";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-line bg-surface">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-4">
        <div className="md:col-span-1">
          <p className="font-serif text-lg font-semibold text-ink">{siteConfig.name}</p>
          <p className="mt-2 text-sm text-muted">
            A free, browser-based calculus solver for students and self-learners. Problems are solved on your device and
            never uploaded.
          </p>
        </div>
        <nav aria-label="Calculators">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-ink">Calculators</h2>
          <ul className="mt-3 space-y-2">
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
          <h2 className="text-xs font-semibold uppercase tracking-wider text-ink">Learn</h2>
          <ul className="mt-3 space-y-2">
            <li>
              <Link href="/guides" className={linkClass}>
                All guides
              </Link>
            </li>
            {guideNav.map((g) => (
              <li key={g.href}>
                <Link href={g.href} className={linkClass}>
                  {g.label}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/blog" className={linkClass}>
                Blog
              </Link>
            </li>
            <li>
              <Link href="/how-it-works" className={linkClass}>
                How the solver works
              </Link>
            </li>
            <li>
              <Link href="/faq" className={linkClass}>
                FAQ
              </Link>
            </li>
          </ul>
        </nav>
        <nav aria-label="Legal and site information">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-ink">Site</h2>
          <ul className="mt-3 space-y-2">
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
      <div className="border-t border-line">
        <p className="mx-auto max-w-6xl px-4 py-5 text-xs text-muted sm:px-6">
          {siteConfig.name} is an educational tool. Always check important results and follow your school&apos;s rules on
          using calculators.
        </p>
      </div>
    </footer>
  );
}
