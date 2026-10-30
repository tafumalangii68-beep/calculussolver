import { ArrowRight } from "lucide-react";
import Link from "next/link";

export interface LinkCard {
  href: string;
  title: string;
  description: string;
}

export function LinkCards({ cards }: { cards: LinkCard[] }) {
  return (
    <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {cards.map((card) => (
        <li key={card.href}>
          <Link
            href={card.href}
            className="group flex h-full flex-col rounded-card border border-line bg-surface p-5 transition-colors hover:border-accent"
          >
            <span className="flex items-center justify-between gap-2 font-semibold text-ink">
              {card.title}
              <ArrowRight aria-hidden className="h-4 w-4 text-muted transition-transform group-hover:translate-x-0.5 group-hover:text-accent" />
            </span>
            <span className="mt-1 text-sm text-muted">{card.description}</span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
