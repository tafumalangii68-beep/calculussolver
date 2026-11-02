import Link from "next/link";
import type { Metadata } from "next";
import { LinkCards } from "@/components/content/LinkCards";
import { calculatorNav } from "@/lib/site-config";

// Next.js adds a noindex robots tag to not-found responses automatically.
export const metadata: Metadata = {
  title: "Page not found",
};

export default function NotFound() {
  return (
    <div className="mx-auto max-w-6xl px-4 pt-12 sm:px-6">
      <p className="font-mono text-sm text-muted">404</p>
      <h1 className="mt-2 font-serif text-4xl font-semibold text-ink">This page doesn&apos;t exist</h1>
      <p className="mt-3 max-w-2xl text-lg text-ink-soft">
        The link may be broken, or the page may have moved. The solver and the calculators below are a good place to continue.
      </p>
      <Link href="/" className="mt-6 inline-block rounded-lg bg-accent px-5 py-2.5 font-semibold text-white hover:bg-accent-hover">
        Go to the Calculus Solver
      </Link>
      <div className="mt-10">
        <LinkCards cards={calculatorNav.map((c) => ({ href: `/${c.slug}`, title: c.label, description: c.blurb, titleClass: c.titleClass }))} />
      </div>
    </div>
  );
}
