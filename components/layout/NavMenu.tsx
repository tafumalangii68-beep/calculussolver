"use client";

import { ArrowLeftRight, BookOpen, ChartColumn, ChevronDown, Crosshair, Link2, Menu, PenLine, Sigma, X, type LucideIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { calculatorNav, guideNav, mainNav, type CalculatorSlug } from "@/lib/site-config";
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

/**
 * A desktop dropdown: opens on hover (mouse) and on click (keyboard, touch), closes on Escape, on
 * navigation, on a click outside, or shortly after the pointer leaves.
 */
function useDropdown(ref: React.RefObject<HTMLLIElement | null>) {
  const [open, setOpen] = useState(false);
  const [close] = useState(() => () => setOpen(false));
  const pathname = useMenuReset(close);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("click", onClick);
    return () => {
      document.removeEventListener("click", onClick);
      if (timer.current) clearTimeout(timer.current);
    };
  }, [ref]);

  const hover = {
    onPointerEnter: (e: React.PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      if (timer.current) clearTimeout(timer.current);
      setOpen(true);
    },
    onPointerLeave: (e: React.PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      timer.current = setTimeout(() => setOpen(false), 180);
    },
  };
  return { open, toggle: () => setOpen((o) => !o), hover, pathname };
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

/** The Guides dropdown: the guides index and each guide. */
const GUIDE_ITEMS: { href: string; label: string; blurb: string; icon: MenuIcon }[] = [
  { href: "/guides", label: "All guides", blurb: "Every guide and tutorial in one place", icon: BookOpen },
  ...guideNav.map((g) => ({
    href: g.href,
    label: g.label,
    blurb: g.href.endsWith("derivative-rules") ? "Every rule, with worked examples" : "How to choose the right method",
    icon: (g.href.endsWith("derivative-rules") ? Sigma : "∫") as MenuIcon,
  })),
];

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

/** One dropdown row: icon tile, bold title, short grey description. */
function MenuItem({ href, label, blurb, icon, current }: { href: string; label: string; blurb: string; icon: MenuIcon; current: boolean }) {
  return (
    <li>
      <Link
        href={href}
        aria-current={current ? "page" : undefined}
        className={`group flex items-center gap-3.5 rounded-xl px-3 py-2.5 transition-colors duration-200 hover:bg-accent-soft/70 focus-visible:bg-accent-soft/70 ${
          current ? "bg-accent-soft/70" : ""
        }`}
      >
        <MenuIconTile icon={icon} />
        <span className="min-w-0">
          <span
            className={`block text-[15px] font-semibold leading-snug transition-colors group-hover:text-accent-strong group-focus-visible:text-accent-strong ${
              current ? "text-accent-strong" : "text-ink"
            }`}
          >
            {label}
          </span>
          <span className="mt-0.5 block text-[13px] leading-snug text-muted">{blurb}</span>
        </span>
      </Link>
    </li>
  );
}

/** The first seven calculators (the derivative tools) fill the left column; the rest go on the right. */
const MENU_SPLIT = 7;

const panelClass = (open: boolean) =>
  `absolute top-full z-40 mt-4 rounded-[20px] border border-line bg-surface p-3 shadow-[0_16px_40px_-16px_rgb(30_27_75/0.2)] transition-all duration-200 ${
    open ? "visible translate-y-0 opacity-100" : "invisible -translate-y-1 opacity-0"
  }`;

/** Solid purple with white text for the current page's item (literal colours: text-white is remapped in the header). */
const ACTIVE = "bg-[#6d28d9] text-[#ffffff]";

/** Nav items: solid purple when active, gentle hover otherwise; slightly tighter padding below xl so everything fits. */
const pill = (active: boolean) =>
  `inline-flex items-center gap-1 rounded-2xl px-2 py-2 text-[15px] font-medium transition-colors duration-200 xl:px-3.5 ${
    active ? ACTIVE : "text-ink-soft hover:bg-accent-soft/60 hover:text-accent-strong"
  }`;

/** Calculators / Guides: solid purple on their own pages; while open elsewhere, a soft tint and thin ring. */
function DropdownButton({ open, active, controls, onClick, children }: { open: boolean; active: boolean; controls: string; onClick: () => void; children: React.ReactNode }) {
  const openStyle = open && !active ? "bg-accent-soft text-accent-strong ring-1 ring-accent/40" : "";
  return (
    <button type="button" aria-expanded={open} aria-controls={controls} onClick={onClick} className={`${pill(active)} ${openStyle}`}>
      {children}
      <ChevronDown aria-hidden className={`h-4 w-4 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
    </button>
  );
}

export function DesktopNav() {
  const calcRef = useRef<HTMLLIElement>(null);
  const guidesRef = useRef<HTMLLIElement>(null);
  const calc = useDropdown(calcRef);
  const guides = useDropdown(guidesRef);
  const pathname = calc.pathname;

  return (
    <nav aria-label="Main" className="hidden lg:block">
      <ul className="flex items-center gap-0.5 xl:gap-1">
        <li>
          <Link href="/" className={pill(isActive(pathname, "/"))} aria-current={pathname === "/" ? "page" : undefined}>
            Home
          </Link>
        </li>
        <li ref={calcRef} className="relative" {...calc.hover}>
          <DropdownButton open={calc.open} active={calculatorPaths.has(pathname)} controls="calculator-menu" onClick={calc.toggle}>
            Calculators
          </DropdownButton>
          {/* Mega menu: two columns with a divider, each item an icon tile, title and short description. */}
          <div id="calculator-menu" className={`left-1/2 w-[46rem] -translate-x-1/2 xl:left-0 xl:translate-x-0 ${panelClass(calc.open)}`}>
            <div className="grid grid-cols-2 divide-x divide-line">
              {[calculatorNav.slice(0, MENU_SPLIT), calculatorNav.slice(MENU_SPLIT)].map((column, ci) => (
                <ul key={ci} className={`space-y-0.5 ${ci === 0 ? "pr-3" : "pl-3"}`}>
                  {column.map((c) => (
                    <MenuItem key={c.slug} href={`/${c.slug}`} label={c.label} blurb={c.blurb} icon={MENU_ICONS[c.slug]} current={pathname === `/${c.slug}`} />
                  ))}
                </ul>
              ))}
            </div>
          </div>
        </li>
        {mainNav.map((item) =>
          item.href === "/guides" ? (
            <li key={item.href} ref={guidesRef} className="relative" {...guides.hover}>
              <DropdownButton open={guides.open} active={isActive(pathname, "/guides")} controls="guides-menu" onClick={guides.toggle}>
                {item.label}
              </DropdownButton>
              <div id="guides-menu" className={`left-0 w-[22rem] ${panelClass(guides.open)}`}>
                <ul className="space-y-0.5">
                  {GUIDE_ITEMS.map((g) => (
                    <MenuItem key={g.href} {...g} current={pathname === g.href} />
                  ))}
                </ul>
              </div>
            </li>
          ) : (
            <li key={item.href}>
              <Link href={item.href} className={pill(isActive(pathname, item.href))} aria-current={pathname === item.href ? "page" : undefined}>
                {item.label}
              </Link>
            </li>
          ),
        )}
      </ul>
    </nav>
  );
}

/** Phones and tablets: a hamburger button that slides a navigation panel in from the right. */
export function MobileNav() {
  const [open, setOpen] = useState(false);
  const [close] = useState(() => () => setOpen(false));
  const pathname = useMenuReset(close);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  // While open: keep the page from scrolling behind the panel, and move focus into it.
  useEffect(() => {
    if (!open) return;
    const html = document.documentElement;
    const previous = html.style.overflow;
    html.style.overflow = "hidden";
    closeRef.current?.focus();
    return () => {
      html.style.overflow = previous;
    };
  }, [open]);

  const shut = () => {
    setOpen(false);
    toggleRef.current?.focus();
  };

  const item = (href: string) =>
    `block rounded-xl px-3 py-2.5 font-medium transition-colors ${
      isActive(pathname, href) ? ACTIVE : "text-ink-soft hover:bg-accent-soft/60 hover:text-accent-strong"
    }`;
  const sectionTitle = "mt-5 px-3 text-xs font-semibold uppercase tracking-wider text-muted";

  return (
    <nav aria-label="Main" className="lg:hidden">
      <button
        ref={toggleRef}
        type="button"
        className={headerIconButton}
        aria-expanded={open}
        aria-controls="mobile-menu"
        aria-label="Open menu"
        onClick={() => setOpen(true)}
      >
        <Menu aria-hidden className="h-5 w-5" />
      </button>

      {/* Backdrop */}
      <div
        aria-hidden
        onClick={shut}
        className={`fixed inset-0 z-40 bg-[#1e1b4b]/30 transition-opacity duration-300 ${open ? "opacity-100" : "pointer-events-none opacity-0"}`}
      />

      <div
        id="mobile-menu"
        role="dialog"
        aria-modal={open}
        aria-label="Site navigation"
        inert={!open}
        className={`fixed inset-y-0 right-0 z-50 flex w-[min(22rem,88vw)] flex-col border-l border-line bg-surface shadow-[-16px_0_40px_-20px_rgb(30_27_75/0.35)] transition-transform duration-300 ease-out ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex h-16 shrink-0 items-center justify-between border-b border-line px-4">
          <span className="font-display text-base font-bold text-ink">Menu</span>
          <button ref={closeRef} type="button" onClick={shut} aria-label="Close menu" className={headerIconButton}>
            <X aria-hidden className="h-5 w-5" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto overscroll-contain px-3 pb-8 pt-3">
          <ul className="space-y-1">
            <li>
              <Link href="/" className={item("/")} aria-current={pathname === "/" ? "page" : undefined}>
                Home
              </Link>
            </li>
          </ul>
          <p className={sectionTitle}>Calculators</p>
          <ul className="mt-1 space-y-1">
            {calculatorNav.map((c) => (
              <li key={c.slug}>
                <Link href={`/${c.slug}`} className={item(`/${c.slug}`)} aria-current={pathname === `/${c.slug}` ? "page" : undefined}>
                  {c.label}
                </Link>
              </li>
            ))}
          </ul>
          <p className={sectionTitle}>Learn and more</p>
          <ul className="mt-1 space-y-1">
            {mainNav.map((m) => (
              <li key={m.href}>
                <Link href={m.href} className={item(m.href)} aria-current={pathname === m.href ? "page" : undefined}>
                  {m.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  );
}
