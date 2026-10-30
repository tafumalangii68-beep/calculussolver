"use client";

import { ChevronDown, Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { calculatorNav, mainNav } from "@/lib/site-config";

export function NavMenu() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [calcOpen, setCalcOpen] = useState(false);
  const calcRef = useRef<HTMLLIElement>(null);
  const [lastPath, setLastPath] = useState(pathname);

  // Close menus after navigation.
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setMenuOpen(false);
    setCalcOpen(false);
  }

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMenuOpen(false);
        setCalcOpen(false);
      }
    };
    const onClick = (e: MouseEvent) => {
      if (calcRef.current && !calcRef.current.contains(e.target as Node)) setCalcOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("click", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("click", onClick);
    };
  }, []);

  const linkClass = (href: string) =>
    `rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-sunken hover:text-ink ${
      pathname === href ? "text-ink" : "text-muted"
    }`;

  return (
    <nav aria-label="Main">
      {/* Desktop */}
      <ul className="hidden items-center gap-1 md:flex">
        <li>
          <Link href="/" className={linkClass("/")}>
            Home
          </Link>
        </li>
        <li ref={calcRef} className="relative">
          <button
            type="button"
            aria-expanded={calcOpen}
            aria-controls="calculator-menu"
            onClick={() => setCalcOpen((o) => !o)}
            className={`flex items-center gap-1 ${linkClass("")}`}
          >
            Calculators <ChevronDown aria-hidden className={`h-4 w-4 transition-transform ${calcOpen ? "rotate-180" : ""}`} />
          </button>
          <ul
            id="calculator-menu"
            hidden={!calcOpen}
            className="absolute right-0 top-full mt-2 w-80 rounded-card border border-line bg-surface p-2 shadow-card"
          >
            {calculatorNav.map((c) => (
              <li key={c.slug}>
                <Link href={`/${c.slug}`} className="block rounded-lg px-3 py-2.5 hover:bg-sunken" aria-current={pathname === `/${c.slug}` ? "page" : undefined}>
                  <span className="block text-sm font-medium text-ink">{c.label}</span>
                  <span className="block text-xs text-muted">{c.blurb}</span>
                </Link>
              </li>
            ))}
          </ul>
        </li>
        {mainNav.map((item) => (
          <li key={item.href}>
            <Link href={item.href} className={linkClass(item.href)} aria-current={pathname === item.href ? "page" : undefined}>
              {item.label}
            </Link>
          </li>
        ))}
      </ul>

      {/* Mobile */}
      <button
        type="button"
        className="grid h-10 w-10 place-items-center rounded-lg border border-line text-ink md:hidden"
        aria-expanded={menuOpen}
        aria-controls="mobile-menu"
        aria-label={menuOpen ? "Close menu" : "Open menu"}
        onClick={() => setMenuOpen((o) => !o)}
      >
        {menuOpen ? <X aria-hidden className="h-5 w-5" /> : <Menu aria-hidden className="h-5 w-5" />}
      </button>
      <div
        id="mobile-menu"
        hidden={!menuOpen}
        className="absolute inset-x-0 top-16 max-h-[calc(100vh-4rem)] overflow-y-auto border-b border-line bg-paper px-4 pb-6 pt-2 shadow-card md:hidden"
      >
        <ul className="space-y-1">
          <li>
            <Link href="/" className="block rounded-md px-3 py-2.5 font-medium text-ink hover:bg-sunken">
              Home
            </Link>
          </li>
        </ul>
        <p className="mt-3 px-3 text-xs font-semibold uppercase tracking-wider text-muted">Calculators</p>
        <ul className="mt-1 space-y-1">
          {calculatorNav.map((c) => (
            <li key={c.slug}>
              <Link href={`/${c.slug}`} className="block rounded-md px-3 py-2.5 text-ink hover:bg-sunken">
                {c.label}
              </Link>
            </li>
          ))}
        </ul>
        <p className="mt-3 px-3 text-xs font-semibold uppercase tracking-wider text-muted">Learn</p>
        <ul className="mt-1 space-y-1">
          {mainNav.map((item) => (
            <li key={item.href}>
              <Link href={item.href} className="block rounded-md px-3 py-2.5 text-ink hover:bg-sunken">
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
