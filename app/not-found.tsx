import { ArrowRight, BookOpen, Search } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";
import { CalculatorCards } from "@/components/content/CalculatorCards";

// Next.js adds a noindex robots tag to not-found responses automatically.
export const metadata: Metadata = {
  title: "Page not found",
};

function BrokenCurve() {
  return (
    <svg viewBox="0 0 480 300" role="img" aria-label="A curve that breaks off in mid-air, with a dashed line looping back to where it started" className="h-auto w-full">
      <g stroke="#ffffff" strokeOpacity="0.07">
        {Array.from({ length: 10 }, (_, i) => (
          <path key={`v${i}`} d={`M${24 + i * 48} 10 V290`} />
        ))}
        {Array.from({ length: 6 }, (_, i) => (
          <path key={`h${i}`} d={`M10 ${30 + i * 48} H470`} />
        ))}
      </g>
      <path d="M40 240 C 110 240, 150 120, 230 110 S 300 70, 318 62" fill="none" stroke="#c4a8ff" strokeWidth="6" strokeLinecap="round" />
      <circle cx="322" cy="60" r="9" fill="#10143b" stroke="#c4a8ff" strokeWidth="4" />
      <path d="M330 62 C 430 50, 450 190, 330 230 S 60 290, 44 246" fill="none" stroke="#3fd1c1" strokeWidth="3" strokeDasharray="8 9" strokeLinecap="round" />
      <path d="M52 236 L42 248 L58 252" fill="none" stroke="#3fd1c1" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function NotFound() {
  return (
    <>
      <div className="relative isolate overflow-hidden bg-navy-gradient pb-24 pt-12 text-white sm:pt-16">
        <div aria-hidden className="absolute -right-24 -top-24 -z-10 h-[26rem] w-[26rem] rounded-full bg-[#923eff]/30 blur-3xl" />
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-[1.1fr_1fr]">
          <div>
            <p className="font-display text-7xl font-extrabold leading-none tracking-tight text-brand-gradient sm:text-8xl">404</p>
            <h1 className="mt-4 font-display text-[clamp(2rem,4.5vw,3rem)] font-extrabold tracking-tight">This page doesn&apos;t exist</h1>
            <p className="mt-4 max-w-xl text-lg text-white/80">
              The link may be broken, or the page may have moved. The solver and the calculators below are a good place to continue.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/"
                className="group inline-flex items-center justify-center gap-2 rounded-xl bg-brand-gradient px-6 py-3.5 font-semibold text-white shadow-glow transition-all hover:-translate-y-0.5 hover:bg-brand-gradient-hover"
              >
                Go to the Calculus Solver
                <ArrowRight aria-hidden className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link href="/guides" className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/25 px-6 py-3.5 font-semibold text-white transition-colors hover:bg-white/10">
                <BookOpen aria-hidden className="h-4 w-4" /> Browse study guides
              </Link>
            </div>
            <p className="mt-6 flex items-center gap-2 text-sm text-white/70">
              <Search aria-hidden className="h-4 w-4" /> Tip: press <kbd className="rounded-md border border-white/25 bg-white/10 px-1.5 py-0.5 font-mono text-xs">Ctrl</kbd>
              <kbd className="rounded-md border border-white/25 bg-white/10 px-1.5 py-0.5 font-mono text-xs">K</kbd> to search the site.
            </p>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-4 sm:p-6">
            <BrokenCurve />
          </div>
        </div>
      </div>
      <div className="relative z-10 mx-auto -mt-10 max-w-7xl px-4 sm:px-6">
        <h2 className="sr-only">Calculators</h2>
        <CalculatorCards />
      </div>
    </>
  );
}
