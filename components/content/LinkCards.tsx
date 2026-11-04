import { ArrowRight } from "lucide-react";
import Link from "next/link";

export interface LinkCard {
  href: string;
  title: string;
  description: string;
  /** Colour class for the title; calculator cards use their own colour. */
  titleClass?: string;
}

export function LinkCards({ cards }: { cards: LinkCard[] }) {
  return (
    <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {cards.map((card) => (
        <li key={card.href} className="flex">
          <Link
            href={card.href}
            className="group flex w-full flex-col rounded-2xl border border-line bg-surface p-5 shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-accent/40"
          >
            <span className={`flex items-center justify-between gap-2 font-display font-bold ${card.titleClass ?? "text-ink"}`}>
              {card.title}
              <span aria-hidden className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-accent-soft text-accent-strong transition-transform duration-300 group-hover:translate-x-1">
                <ArrowRight className="h-4 w-4" />
              </span>
            </span>
            <span className="mt-1.5 text-sm leading-relaxed text-muted">{card.description}</span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
