import {
  BookOpen,
  Calculator,
  Check,
  ChevronRight,
  CircleHelp,
  Cookie,
  FileText,
  GraduationCap,
  Layers,
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

/** The calculators are split into two groups in the footer; every calculator appears in exactly one. */
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

/** A footer icon: a lucide icon, or a short math glyph. Decorative only; the link text carries the meaning. */
type Glyph = LucideIcon | string;

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

const rowBase =
  "flex w-full items-center rounded-lg py-1 pr-7 text-left text-[13.5px] leading-snug text-white/85 transition-colors duration-200 hover:bg-white/[0.06] hover:text-white focus-visible:bg-white/[0.06] focus-visible:text-white focus-visible:outline-none";
/** Rows with an icon tile leave room for it on the left (0.375 + 1.75 + 0.625rem). */
const iconRowClass = `${rowBase} min-h-10 pl-[2.75rem]`;
const plainRowClass = `${rowBase} min-h-9 pl-2.5 text-[13px]`;

function GlyphTile({ glyph, className = "" }: { glyph: Glyph; className?: string }) {
  const Icon = typeof glyph === "string" ? null : glyph;
  return (
    <span
      aria-hidden
      className={`grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-[#7438f5]/25 text-[#e4d8ff] ring-1 ring-[#8f7bff]/30 transition-colors duration-200 group-hover:bg-[#7438f5]/50 group-hover:text-white ${className}`}
    >
      {Icon ? <Icon className="h-[15px] w-[15px]" /> : <span className="font-display text-[15px] font-bold italic leading-none">{glyph as string}</span>}
    </span>
  );
}

const Chevron = () => (
  <ChevronRight
    aria-hidden
    className="pointer-events-none absolute right-1.5 top-1/2 h-4 w-4 -translate-y-1/2 text-white/45 transition-all duration-200 group-hover:translate-x-0.5 group-hover:text-white"
  />
);

/**
 * One row. Any icon tile and the chevron sit over the link rather than inside it, so the link's text stays
 * exactly its label.
 */
function Row({ glyph, children }: { glyph?: Glyph; children: React.ReactNode }) {
  return (
    <li className="group relative">
      {glyph && <GlyphTile glyph={glyph} className="pointer-events-none absolute left-1.5 top-1/2 -translate-y-1/2" />}
      {children}
      <Chevron />
    </li>
  );
}

const cardClass =
  "flex h-full flex-col overflow-hidden rounded-[1.25rem] border border-[#8f7bff]/35 bg-[#120f3d]/70 shadow-[0_0_44px_-14px_rgb(146_62_255/0.55)]";

/** A section card with the purple gradient header bar. */
function Section({ label, title, icon: Icon, children }: { label: string; title: string; icon: LucideIcon; children: React.ReactNode }) {
  return (
    <nav aria-label={label} className={cardClass}>
      <h2 className="flex items-center gap-3 bg-brand-gradient px-5 py-2.5 font-display text-sm font-bold uppercase tracking-[0.1em] text-white">
        <Icon aria-hidden className="h-[18px] w-[18px]" />
        {title}
      </h2>
      {children}
    </nav>
  );
}

/** One of the two calculator groups: a small card with its own heading. */
function CalculatorGroup({ title, glyph, links }: { title: string; glyph: string; links: { href: string; label: string }[] }) {
  return (
    <div className="overflow-hidden rounded-xl border border-white/[0.08] bg-white/[0.03]">
      <h3 className="flex items-center gap-2.5 bg-[#7438f5]/30 px-3 py-1.5 font-display text-sm font-bold text-white">
        <span aria-hidden className="grid h-6 w-6 place-items-center rounded-md bg-brand-gradient font-display text-sm italic leading-none">
          {glyph}
        </span>
        {title}
      </h3>
      <ul className="divide-y divide-white/[0.07] px-1 py-0.5">
        {links.map((l) => (
          <Row key={l.href}>
            <Link href={l.href} className={plainRowClass}>
              {l.label}
            </Link>
          </Row>
        ))}
      </ul>
    </div>
  );
}

export function Footer() {
  return (
    <footer className="relative mt-24 overflow-hidden bg-navy-gradient text-white">
      {/* Decorative glows and a soft wave, as in the reference design. */}
      <div aria-hidden className="pointer-events-none absolute -right-24 -top-24 h-80 w-[32rem] rounded-full bg-[#923eff]/20 blur-3xl" />
      <div aria-hidden className="pointer-events-none absolute -bottom-32 left-1/3 h-72 w-[40rem] rounded-full bg-[#7438f5]/25 blur-3xl" />
      <svg aria-hidden viewBox="0 0 1440 160" preserveAspectRatio="none" className="pointer-events-none absolute bottom-12 left-0 h-24 w-full opacity-60">
        <path d="M0 140 C 180 40, 360 30, 560 120 S 980 150, 1160 70 S 1380 40, 1440 60" fill="none" stroke="#923eff" strokeOpacity="0.45" strokeWidth="2" />
        <path d="M0 160 C 200 70, 380 60, 580 140 S 1000 170, 1180 95 S 1390 70, 1440 85" fill="none" stroke="#7438f5" strokeOpacity="0.3" strokeWidth="1.5" />
      </svg>

      <div className="relative mx-auto grid max-w-7xl gap-5 px-4 pb-8 pt-10 sm:px-6 md:grid-cols-2 lg:grid-cols-[0.85fr_2.05fr_1fr_1fr] lg:gap-4">
        <div className="md:col-span-2 lg:col-span-1 lg:pr-3">
          <Logo />
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/75">
            A free, browser-based calculus solver for students and self-learners. Problems are solved on your device and never
            uploaded.
          </p>
          <ul className="mt-5 space-y-2.5">
            {HIGHLIGHTS.map((h) => (
              <li key={h} className="flex items-center gap-3 text-sm text-white/90">
                <span aria-hidden className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-brand-gradient shadow-glow">
                  <Check className="h-3.5 w-3.5" strokeWidth={3} />
                </span>
                {h}
              </li>
            ))}
          </ul>
        </div>

        <div className="md:col-span-2 lg:col-span-1">
          <Section label="Calculators" title="Calculators" icon={Calculator}>
            <div className="grid flex-1 gap-2 p-2 sm:grid-cols-2">
              <CalculatorGroup title="Core Calculators" glyph="∫" links={coreLinks} />
              <CalculatorGroup title="Advanced Calculators" glyph="∂" links={advancedLinks} />
            </div>
          </Section>
        </div>

        <Section label="Learn" title="Learn" icon={GraduationCap}>
          <ul className="divide-y divide-white/[0.07] px-2 py-1">
            {LEARN.map((l) => (
              <Row key={l.href} glyph={LEARN_GLYPHS[l.href] ?? BookOpen}>
                <Link href={l.href} className={iconRowClass}>
                  {l.label}
                </Link>
              </Row>
            ))}
          </ul>
        </Section>

        <Section label="Legal and site information" title="Site" icon={Layers}>
          <ul className="divide-y divide-white/[0.07] px-2 py-1">
            {legalNav.map((l) => (
              <Row key={l.href} glyph={SITE_GLYPHS[l.href] ?? FileText}>
                <Link href={l.href} className={iconRowClass}>
                  {l.label}
                </Link>
              </Row>
            ))}
            <Row glyph={Settings}>
              <CookieSettingsButton className={`${iconRowClass} cursor-pointer`} />
            </Row>
          </ul>
        </Section>
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex flex-col gap-2 border-t border-[#8f7bff]/30 py-4 text-sm text-white/70 md:flex-row md:items-center md:justify-between">
          <p className="text-white/85">© {new Date().getFullYear()} CalculusSolver.pro</p>
          <p className="text-xs md:max-w-xl md:text-right">
            {siteConfig.name} is an educational tool. Always check important results and follow your school&apos;s rules on using
            calculators.
          </p>
        </div>
      </div>
    </footer>
  );
}
