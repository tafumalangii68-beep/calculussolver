import type { ExampleCard as ExampleCardData } from "@/data/example-cards";
import { Stars } from "./Stars";
import { initials } from "./TestimonialCard";

/**
 * Sample card in the testimonial style, used only until real reviews exist.
 * Visibly tagged "Sample review" (and announced as such to screen readers); the stars are a
 * visual example only and are never counted in any rating.
 */
export function ExampleCard({ card }: { card: ExampleCardData }) {
  return (
    <figure className="relative flex h-full min-h-[350px] flex-col rounded-[25px] border border-line bg-surface p-6 shadow-[0_5px_18px_rgb(21_25_54/0.07)] transition-shadow duration-300 hover:shadow-[0_10px_25px_rgb(76_34_201/0.14)] sm:min-h-[390px] sm:px-[30px] sm:py-7">
      <span className="absolute right-6 top-6 rounded-full border border-line-strong bg-sunken px-3 py-1 text-xs font-semibold uppercase tracking-wider text-muted">
        Sample review
      </span>
      <span aria-hidden className="block h-[65px] select-none font-display text-[92px] font-bold leading-none text-accent">
        &ldquo;
      </span>
      <blockquote className="mb-7 mt-3 flex-1">
        <p className="text-[17px] leading-[1.65] text-ink-soft sm:text-[20px]">{card.text}</p>
      </blockquote>
      <figcaption className="flex flex-wrap items-center gap-x-3.5 gap-y-3 border-t border-line pt-6">
        <span aria-hidden className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-accent text-[17px] font-bold text-white sm:h-[58px] sm:w-[58px]">
          {initials(card.name)}
        </span>
        <div className="min-w-0 flex-1">
          <p className="break-words text-[17px] font-bold text-ink">
            {card.name}
            <span className="sr-only"> (sample name)</span>
          </p>
          <p className="mt-1 text-sm text-accent-strong">Sample · {card.topic}</p>
        </div>
        <span aria-hidden>
          <Stars rating={5} size="h-[18px] w-[18px] sm:h-5 sm:w-5" />
        </span>
      </figcaption>
    </figure>
  );
}
