import { ArrowRight, Crosshair, Link2 } from "lucide-react";
import Link from "next/link";
import { calculatorNav, type CalculatorSlug } from "@/lib/site-config";

/** Per-calculator look: soft card background, accent text colour and a small math icon. */
export const calculatorStyle: Record<CalculatorSlug, { card: string; text: string; icon: React.ReactNode }> = {
  "derivative-calculator": {
    card: "bg-calc-derivative-soft",
    text: "text-calc-derivative",
    icon: (
      <span className="flex flex-col items-center font-display text-[15px] font-bold italic leading-none">
        <span>d</span>
        <span className="my-0.5 h-px w-6 bg-current" />
        <span>dx</span>
      </span>
    ),
  },
  "second-derivative-calculator": { card: "bg-calc-second-soft", text: "text-calc-second", icon: <span className="font-display text-2xl font-bold italic">f″</span> },
  "partial-derivative-calculator": { card: "bg-calc-partial-soft", text: "text-calc-partial", icon: <span className="font-display text-3xl font-bold italic">∂</span> },
  "mixed-partial-derivative-calculator": { card: "bg-calc-mixed-soft", text: "text-calc-mixed", icon: <span className="font-display text-xl font-bold italic">∂²</span> },
  "clairauts-theorem-calculator": { card: "bg-calc-clairaut-soft", text: "text-calc-clairaut", icon: <span className="font-display text-lg font-bold italic">=</span> },
  "leibniz-vs-lagrange-notation-calculator": { card: "bg-calc-notation-soft", text: "text-calc-notation", icon: <span className="font-display text-lg font-bold italic">f′</span> },
  "average-value-of-a-function-calculator": { card: "bg-calc-average-soft", text: "text-calc-average", icon: <span className="font-display text-2xl font-bold italic">f̄</span> },
  "chain-rule-calculator": { card: "bg-calc-chain-soft", text: "text-calc-chain", icon: <Link2 className="h-7 w-7" strokeWidth={2.25} /> },
  "implicit-differentiation-calculator": {
    card: "bg-calc-implicit-soft",
    text: "text-calc-implicit",
    icon: <span className="font-display text-2xl font-bold">{"{ }"}</span>,
  },
  "integral-calculator": { card: "bg-calc-integral-soft", text: "text-calc-integral", icon: <span className="font-display text-3xl font-bold italic">∫</span> },
  "limit-calculator": { card: "bg-calc-limit-soft", text: "text-calc-limit", icon: <span className="font-display text-xl font-extrabold underline decoration-2 underline-offset-4">lim</span> },
  "taylor-series-calculator": { card: "bg-calc-taylor-soft", text: "text-calc-taylor", icon: <span className="font-display text-3xl font-bold">Σ</span> },
  "critical-points-calculator": { card: "bg-calc-critical-soft", text: "text-calc-critical", icon: <Crosshair className="h-7 w-7" strokeWidth={2.25} /> },
};

/** Order used on the homepage: the four main operations first, then the specialised derivative tools. */
export const CARD_ORDER: CalculatorSlug[] = [
  "derivative-calculator",
  "integral-calculator",
  "limit-calculator",
  "taylor-series-calculator",
  "partial-derivative-calculator",
  "chain-rule-calculator",
  "critical-points-calculator",
  "implicit-differentiation-calculator",
  "second-derivative-calculator",
  "mixed-partial-derivative-calculator",
  "clairauts-theorem-calculator",
  "leibniz-vs-lagrange-notation-calculator",
  "average-value-of-a-function-calculator",
];

/** Calculator cards: a plain bordered card with icon, title, short description and arrow. */
export function CalculatorCards({ slugs = CARD_ORDER, className = "" }: { slugs?: CalculatorSlug[]; className?: string }) {
  return (
    <ul className={`grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 ${className}`}>
      {slugs.map((slug) => {
        const nav = calculatorNav.find((c) => c.slug === slug)!;
        const s = calculatorStyle[slug];
        return (
          <li key={slug} className="flex">
            <Link
              href={`/${slug}`}
              className={`group flex w-full items-center gap-4 rounded-xl border border-line p-4 transition-colors duration-200 hover:border-accent/40 hover:bg-sunken/60 ${s.card}`}
            >
              <span aria-hidden className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-accent-soft text-accent-strong">
                {s.icon}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block font-display text-base font-semibold leading-snug text-ink">{nav.label}</span>
                <span className="mt-0.5 block text-sm leading-snug text-muted">{nav.blurb}</span>
              </span>
              <span aria-hidden className="grid h-8 w-8 shrink-0 place-items-center text-muted transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-accent-strong">
                <ArrowRight className="h-4 w-4" />
              </span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
