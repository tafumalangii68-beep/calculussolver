import {
  ArrowLeftRight,
  BookOpen,
  Calculator,
  CheckCircle2,
  ChevronRight,
  CircleHelp,
  Cookie,
  Crosshair,
  FileText,
  GraduationCap,
  Layers,
  Link2,
  Mail,
  Newspaper,
  Settings,
  ShieldCheck,
  Sigma,
  TriangleAlert,
  Users,
  type LucideIcon,
} from "lucide-react";
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

/** A footer icon: a lucide icon, or a short math glyph. Decorative only; the link text carries the meaning. */
type Glyph = LucideIcon | string;

const CALCULATOR_GLYPHS: Record<CalculatorSlug, Glyph> = {
  "derivative-calculator": "d/dx",
  "second-derivative-calculator": "f″",
  "partial-derivative-calculator": "∂",
  "mixed-partial-derivative-calculator": "∂²",
  "clairauts-theorem-calculator": ArrowLeftRight,
  "chain-rule-calculator": Link2,
  "implicit-differentiation-calculator": "dy/dx",
  "leibniz-vs-lagrange-notation-calculator": "f′",
  "integral-calculator": "∫",
  "average-value-of-a-function-calculator": "f̄",
  "limit-calculator": "lim",
  "taylor-series-calculator": "Σ",
  "critical-points-calculator": Crosshair,
};

const LEARN_GLYPHS: Record<string, Glyph> = {
  "/guides": BookOpen,
  "/guides/derivative-rules": Sigma,
  "/guides/integration-techniques": "∫",
  "/blog": Newspaper,
  "/how-it-works": Settings,
  "/faq": CircleHelp,
};

const SITE_GLYPHS: Record<string, Glyph> = {
  "/about": Users,
  "/contact": Mail,
  "/privacy-policy": ShieldCheck,
  "/terms-and-conditions": FileText,
  "/cookie-policy": Cookie,
  "/disclaimer": TriangleAlert,
};

/** Rows share one look; the padding leaves room for the icon tile on the left (0.375 + 2.25 + 0.75rem) and the chevron. */
const rowClass =
  "flex min-h-12 w-full items-center rounded-xl py-1.5 pl-[3.375rem] pr-8 text-left text-sm text-white/80 transition-colors duration-200 hover:bg-white/[0.06] hover:text-white focus-visible:bg-white/[0.06] focus-visible:text-white focus-visible:outline-none";

function GlyphTile({ glyph, className = "" }: { glyph: Glyph; className?: string }) {
  return (
    <span
      aria-hidden
      className={`grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-[#8f7bff]/25 bg-[#7438f5]/15 text-[#d9c8ff] transition-colors duration-200 group-hover:border-[#b48cff]/60 group-hover:bg-[#7438f5]/35 group-hover:text-white ${className}`}
    >
      {typeof glyph === "string" ? (
        <span className={`font-display font-bold italic leading-none ${glyph.length > 3 ? "text-[9px] tracking-tighter" : glyph.length > 1 ? "text-xs" : "text-base"}`}>{glyph}</span>
      ) : (
        (() => {
          const Icon = glyph;
          return <Icon className="h-4 w-4" />;
        })()
      )}
    </span>
  );
}

const Chevron = () => (
  <ChevronRight
    aria-hidden
    className="pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-white/35 transition-all duration-200 group-hover:translate-x-0.5 group-hover:text-white"
  />
);

/**
 * One row: the icon tile and chevron sit over the link rather than inside it, so the link's text stays exactly
 * its label (math glyphs such as "d/dx" would otherwise become part of the anchor text).
 */
function FooterRow({ glyph, children }: { glyph: Glyph; children: React.ReactNode }) {
  return (
    <li className="group relative">
      <GlyphTile glyph={glyph} className="pointer-events-none absolute left-1.5 top-1/2 -translate-y-1/2" />
      {children}
      <Chevron />
    </li>
  );
}

function FooterLink({ href, label, glyph }: { href: string; label: string; glyph: Glyph }) {
  return (
    <FooterRow glyph={glyph}>
      <Link href={href} className={rowClass}>
        {label}
      </Link>
    </FooterRow>
  );
}

/** A column card: gradient header bar with an icon, then the list of rows. */
function FooterColumn({ label, title, icon: Icon, children }: { label: string; title: string; icon: LucideIcon; children: React.ReactNode }) {
  return (
    <nav
      aria-label={label}
      className="overflow-hidden rounded-2xl border border-[#8f7bff]/25 bg-white/[0.03] shadow-[0_0_40px_-12px_rgb(146_62_255/0.45)] backdrop-blur-sm"
    >
      <h2 className="flex items-center gap-3 bg-brand-gradient px-5 py-3.5 font-display text-sm font-bold uppercase tracking-[0.12em] text-white">
        <Icon aria-hidden className="h-5 w-5" />
        {title}
      </h2>
      <ul className="divide-y divide-white/[0.06] p-2">{children}</ul>
    </nav>
  );
}

export function Footer() {
  return (
    <footer className="relative mt-24 overflow-hidden bg-navy-gradient text-white">
      {/* Decorative glows, as in the header and hero. */}
      <div aria-hidden className="pointer-events-none absolute -left-32 top-0 h-80 w-80 rounded-full bg-[#923eff]/20 blur-3xl" />
      <div aria-hidden className="pointer-events-none absolute -bottom-40 right-0 h-96 w-[36rem] rounded-full bg-[#7438f5]/25 blur-3xl" />

      <div className="relative mx-auto grid max-w-7xl items-start gap-6 px-4 py-14 sm:px-6 md:grid-cols-2 lg:grid-cols-[1.1fr_1.35fr_1fr_1fr] lg:gap-5">
        <div className="md:col-span-2 lg:col-span-1 lg:pr-4">
          <Logo />
          <p className="mt-5 max-w-sm text-sm leading-relaxed text-white/70">
            A free, browser-based calculus solver for students and self-learners. Problems are solved on your device and never
            uploaded.
          </p>
          <ul className="mt-6 space-y-3">
            {HIGHLIGHTS.map((h) => (
              <li key={h} className="flex items-center gap-3 text-sm text-white/85">
                <span aria-hidden className="grid h-7 w-7 shrink-0 place-items-center rounded-full border border-[#b48cff]/40 bg-[#7438f5]/20">
                  <CheckCircle2 className="h-4 w-4 text-[#c4a8ff]" />
                </span>
                {h}
              </li>
            ))}
          </ul>
          {/* Decorative brand tile. */}
          <div aria-hidden className="relative mt-10 hidden h-32 lg:block">
            <div className="absolute left-4 top-6 h-20 w-32 rounded-2xl border border-[#8f7bff]/30 bg-white/[0.04] shadow-[0_0_40px_-10px_rgb(146_62_255/0.6)]">
              <svg viewBox="0 0 128 80" className="h-full w-full">
                <path d="M16 62 V14 M16 62 H116" stroke="#c4a8ff" strokeOpacity="0.5" strokeWidth="1.5" fill="none" />
                <path d="M22 54 C 36 54, 40 24, 56 24 S 76 52, 90 44 S 104 26, 112 22" stroke="#c4a8ff" strokeWidth="2.5" fill="none" strokeLinecap="round" />
              </svg>
            </div>
            <div className="absolute left-28 top-0 grid h-16 w-16 rotate-6 place-items-center rounded-2xl bg-brand-gradient font-display text-4xl font-bold italic shadow-glow">
              ∫
            </div>
          </div>
        </div>

        <FooterColumn label="Calculators" title="Calculators" icon={Calculator}>
          <FooterLink href="/" label="Calculus Solver" glyph={Calculator} />
          {calculatorNav.map((c) => (
            <FooterLink key={c.slug} href={`/${c.slug}`} label={c.label} glyph={CALCULATOR_GLYPHS[c.slug]} />
          ))}
        </FooterColumn>

        {/* On tablets Learn and Site stack beside the long Calculators column; on desktop they are columns of their own. */}
        <div className="flex flex-col gap-6 lg:contents">
        <FooterColumn label="Learn" title="Learn" icon={GraduationCap}>
          {LEARN.map((l) => (
            <FooterLink key={l.href} href={l.href} label={l.label} glyph={LEARN_GLYPHS[l.href] ?? BookOpen} />
          ))}
        </FooterColumn>

        <FooterColumn label="Legal and site information" title="Site" icon={Layers}>
          {legalNav.map((l) => (
            <FooterLink key={l.href} href={l.href} label={l.label} glyph={SITE_GLYPHS[l.href] ?? FileText} />
          ))}
          <FooterRow glyph={Settings}>
            <CookieSettingsButton className={`${rowClass} cursor-pointer`} />
          </FooterRow>
        </FooterColumn>
        </div>
      </div>

      <div className="relative border-t border-white/10">
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
