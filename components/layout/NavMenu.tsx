"use client";

import { ArrowLeftRight, ChartColumn, ChevronDown, Crosshair, Link2, Menu, PenLine, X, type LucideIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { calculatorNav, mainNav, type CalculatorSlug } from "@/lib/site-config";
import { headerIconButton } from "./header-styles";

const calculatorPaths = new Set(calculatorNav.map((c) => `/${c.slug}`));

/** True for the link's own page and, for section indexes like /guides, the pages under it. */
function isActive(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

/** Closes menus after navigation and on Escape. Returns the current path. */
function useMenuReset(close: () => void): string {
  const pathname = usePathname();
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    close();
  }
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [close]);
  return pathname;
}

/** Menu icons: a lucide icon, a stacked fraction such as d/dx, or a short math glyph. Decorative only. */
type MenuIcon = LucideIcon | { top: string; bottom: string } | string;

const MENU_ICONS: Record<CalculatorSlug, MenuIcon> = {
  "derivative-calculator": { top: "d", bottom: "dx" },
  "second-derivative-calculator": { top: "d²", bottom: "dx²" },
  "partial-derivative-calculator": "∂",
  "mixed-partial-derivative-calculator": "∂²",
  "clairauts-theorem-calculator": ArrowLeftRight,
  "chain-rule-calculator": Link2,
  "implicit-differentiation-calculator": PenLine,
  "leibniz-vs-lagrange-notation-calculator": "ℒ",
  "integral-calculator": "∫",
  "average-value-of-a-function-calculator": ChartColumn,
  "limit-calculator": "lim",
  "taylor-series-calculator": "π",
  "critical-points-calculator": Crosshair,
};

function MenuIconTile({ icon }: { icon: MenuIcon }) {
  let content: React.ReactNode;
  if (typeof icon === "string") {
    content = <span className={`font-display font-bold italic leading-none ${icon.length > 2 ? "text-[15px]" : "text-xl"}`}>{icon}</span>;
  } else if ("top" in icon) {
    content = (
      <span className="flex flex-col items-center font-display text-[11px] font-bold italic leading-none">
        <span>{icon.top}</span>
        <span className="my-[3px] h-px w-5 bg-current" />
        <span>{icon.bottom}</span>
      </span>
    );
  } else {
    const Icon = icon;
    content = <Icon className="h-5 w-5" />;
  }
  return (
    <span
      aria-hidden
      className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-accent-soft text-accent-strong ring-1 ring-transparent transition-colors duration-200 group-hover:ring-accent/25 group-focus-visible:ring-accent/25"
    >
      {content}
    </span>
  );
}

/** The first seven calculators (the derivative tools) fill the left column; the rest go on the right. */
const MENU_SPLIT = 7;

const pill = (active: boolean) =>
  `rounded-xl px-3 py-2 text-sm font-medium transition-all duration-200 ${
    active ? "bg-accent-soft text-accent-strong" : "text-ink-soft hover:bg-sunken hover:text-ink"
  }`;

export function DesktopNav() {
  const [calcOpen, setCalcOpen] = useState(false);
  const calcRef = useRef<HTMLLIElement>(null);
  const [close] = useState(() => () => setCalcOpen(false));
  const pathname = useMenuReset(close);
  const hoverTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const onPointerEnter = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse") return;
    if (hoverTimer.current) clearTimeout(hoverTimer.current);
    setCalcOpen(true);
  };
  const onPointerLeave = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse") return;
    hoverTimer.current = setTimeout(() => setCalcOpen(false), 180);
  };
  useEffect(
    () => () => {
      if (hoverTimer.current) clearTimeout(hoverTimer.current);
    },
    [],
  );

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (calcRef.current && !calcRef.current.contains(e.target as Node)) setCalcOpen(false);
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  return (
    <nav aria-label="Main" className="hidden lg:block">
      <ul className="flex items-center gap-1">
        <li>
          <Link href="/" className={pill(isActive(pathname, "/"))} aria-current={pathname === "/" ? "page" : undefined}>
            Home
          </Link>
        </li>
        <li ref={calcRef} className="relative" onPointerEnter={onPointerEnter} onPointerLeave={onPointerLeave}>
          <button
            type="button"
            aria-expanded={calcOpen}
            aria-controls="calculator-menu"
            onClick={() => setCalcOpen((o) => !o)}
            className={`flex items-center gap-1 ${pill(calculatorPaths.has(pathname))} ${calcOpen ? "text-accent-strong ring-1 ring-accent/50" : ""}`}
          >
            Calculators <ChevronDown aria-hidden className={`h-4 w-4 transition-transform duration-200 ${calcOpen ? "rotate-180" : ""}`} />
          </button>
          {/* Mega menu: two columns with a divider, each item an icon tile, title and short description. */}
          <div
            id="calculator-menu"
            className={`absolute left-1/2 top-full z-40 mt-3 w-[46rem] -translate-x-1/2 xl:left-0 xl:translate-x-0 rounded-[20px] border border-line bg-surface p-3 shadow-[0_16px_40px_-16px_rgb(22_26_51/0.18)] transition-all duration-200 ${
              calcOpen ? "visible translate-y-0 opacity-100" : "invisible -translate-y-1 opacity-0"
            }`}
          >
            <div className="grid grid-cols-2 divide-x divide-line">
              {[calculatorNav.slice(0, MENU_SPLIT), calculatorNav.slice(MENU_SPLIT)].map((column, ci) => (
                <ul key={ci} className={`space-y-0.5 ${ci === 0 ? "pr-3" : "pl-3"}`}>
                  {column.map((c) => {
                    const current = pathname === `/${c.slug}`;
                    return (
                      <li key={c.slug}>
                        <Link
                          href={`/${c.slug}`}
                          aria-current={current ? "page" : undefined}
                          className={`group flex items-center gap-3.5 rounded-xl px-3 py-2.5 transition-colors duration-200 hover:bg-accent-soft/70 focus-visible:bg-accent-soft/70 ${
                            current ? "bg-accent-soft/70" : ""
                          }`}
                        >
                          <MenuIconTile icon={MENU_ICONS[c.slug]} />
                          <span className="min-w-0">
                            <span
                              className={`block text-[15px] font-semibold leading-snug transition-colors group-hover:text-accent-strong group-focus-visible:text-accent-strong ${
                                current ? "text-accent-strong" : "text-ink"
                              }`}
                            >
                              {c.label}
                            </span>
                            <span className="mt-0.5 block text-[13px] leading-snug text-muted">{c.blurb}</span>
                          </span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              ))}
            </div>
          </div>
        </li>
        {mainNav.map((item) => {
          const active = isActive(pathname, item.href);
          return (
            <li key={item.href}>
              <Link href={item.href} className={pill(active)} aria-current={pathname === item.href ? "page" : undefined}>
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const [close] = useState(() => () => setOpen(false));
  const pathname = useMenuReset(close);

  const item = (href: string) =>
    `block rounded-xl px-3 py-2.5 font-medium transition-colors ${
      isActive(pathname, href) ? "bg-accent-soft text-accent-strong" : "text-ink-soft hover:bg-sunken hover:text-ink"
    }`;

  return (
    <nav aria-label="Main" className="lg:hidden">
      <button
        type="button"
        className={headerIconButton}
        aria-expanded={open}
        aria-controls="mobile-menu"
        aria-label={open ? "Close menu" : "Open menu"}
        onClick={() => setOpen((o) => !o)}
      >
        {open ? <X aria-hidden className="h-5 w-5" /> : <Menu aria-hidden className="h-5 w-5" />}
      </button>
      <div
        id="mobile-menu"
        hidden={!open}
        className="absolute inset-x-0 top-full max-h-[calc(100dvh-72px)] overflow-y-auto border-b border-line bg-surface px-4 pb-6 pt-3 shadow-card"
      >
        <ul className="space-y-1">
          <li>
            <Link href="/" className={item("/")} aria-current={pathname === "/" ? "page" : undefined}>
              Home
            </Link>
          </li>
        </ul>
        <p className="mt-4 px-3 text-xs font-semibold uppercase tracking-wider text-white/55">Calculators</p>
        <ul className="mt-1 grid grid-cols-1 gap-1 sm:grid-cols-2">
          {calculatorNav.map((c) => (
            <li key={c.slug}>
              <Link href={`/${c.slug}`} className={item(`/${c.slug}`)} aria-current={pathname === `/${c.slug}` ? "page" : undefined}>
                {c.label}
              </Link>
            </li>
          ))}
        </ul>
        <p className="mt-4 px-3 text-xs font-semibold uppercase tracking-wider text-white/55">Learn and more</p>
        <ul className="mt-1 grid grid-cols-1 gap-1 sm:grid-cols-2">
          {mainNav.map((m) => (
            <li key={m.href}>
              <Link href={m.href} className={item(m.href)} aria-current={pathname === m.href ? "page" : undefined}>
                {m.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
