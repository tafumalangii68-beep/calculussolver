import { Sparkles } from "lucide-react";
import type { ExampleCard as ExampleCardData } from "@/data/example-cards";

/**
 * Placeholder card in the testimonial style, used only until real reviews exist.
 * Visibly marked "Example", with no name and no rating, so it can't be mistaken for a review.
 */
export function ExampleCard({ card }: { card: ExampleCardData }) {
  return (
    <figure className="relative flex h-full min-h-[350px] flex-col rounded-[25px] border border-line bg-surface p-6 shadow-[0_5px_18px_rgb(38_55_70/0.09)] transition-shadow duration-300 hover:shadow-[0_10px_25px_rgb(38_55_70/0.13)] sm:min-h-[390px] sm:px-[30px] sm:py-7">
      <span className="absolute right-6 top-6 rounded-full border border-line-strong bg-sunken px-3 py-1 text-xs font-semibold uppercase tracking-wider text-muted">
        Example
      </span>
      <span aria-hidden className="block h-[65px] select-none font-serif text-[92px] font-bold leading-none text-accent">
        &ldquo;
      </span>
      <blockquote className="mb-7 mt-3 flex-1">
        <p className="text-[17px] leading-[1.65] text-ink-soft sm:text-[20px]">{card.text}</p>
      </blockquote>
      <figcaption className="flex items-center gap-3.5 border-t border-line pt-6">
        <span aria-hidden className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-accent text-white sm:h-[58px] sm:w-[58px]">
          <Sparkles className="h-5 w-5 sm:h-6 sm:w-6" />
        </span>
        <div className="min-w-0">
          <p className="text-[17px] font-bold text-ink">Example card</p>
          <p className="mt-1 text-sm text-accent-strong">{card.topic}</p>
        </div>
      </figcaption>
    </figure>
  );
}
