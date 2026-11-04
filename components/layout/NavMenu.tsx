"use client";

import { ChevronDown, Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { calculatorNav, mainNav } from "@/lib/site-config";
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

const pill = (active: boolean) =>
  `rounded-xl px-3 py-2 text-sm font-medium transition-all duration-200 ${
    active ? "bg-brand-gradient text-white shadow-glow" : "text-white/75 hover:bg-white/10 hover:text-white"
  }`;

export function DesktopNav() {
  const [calcOpen, setCalcOpen] = useState(false);
  const calcRef = useRef<HTMLLIElement>(null);
  const [close] = useState(() => () => setCalcOpen(false));
  const pathname = useMenuReset(close);

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
        <li ref={calcRef} className="relative">
          <button
            type="button"
            aria-expanded={calcOpen}
            aria-controls="calculator-menu"
            onClick={() => setCalcOpen((o) => !o)}
            className={`flex items-center gap-1 ${pill(calculatorPaths.has(pathname))}`}
          >
            Calculators <ChevronDown aria-hidden className={`h-4 w-4 transition-transform duration-200 ${calcOpen ? "rotate-180" : ""}`} />
          </button>
          {/* Two columns, filled top to bottom: the five derivative calculators, then the rest. */}
          <ul
            id="calculator-menu"
            className={`absolute left-0 top-full mt-3 grid w-[40rem] grid-flow-col grid-rows-5 gap-0.5 rounded-2xl border border-line bg-surface p-2 shadow-2xl shadow-navy-950/20 transition-all duration-200 ${
              calcOpen ? "visible translate-y-0 opacity-100" : "invisible -translate-y-1 opacity-0"
            }`}
          >
            {calculatorNav.map((c) => {
              const current = pathname === `/${c.slug}`;
              return (
                <li key={c.slug}>
                  <Link
                    href={`/${c.slug}`}
                    aria-current={current ? "page" : undefined}
                    className={`block rounded-xl px-3 py-2.5 transition-colors hover:bg-accent-soft ${current ? "bg-accent-soft" : ""}`}
                  >
                    <span className={`block text-sm font-semibold ${c.titleClass}`}>{c.label}</span>
                    <span className="block text-xs text-muted">{c.blurb}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
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
      isActive(pathname, href) ? "bg-brand-gradient text-white" : "text-white/85 hover:bg-white/10 hover:text-white"
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
        className="absolute inset-x-0 top-full max-h-[calc(100dvh-72px)] overflow-y-auto border-b border-white/10 bg-navy-900 px-4 pb-6 pt-3 shadow-2xl"
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
