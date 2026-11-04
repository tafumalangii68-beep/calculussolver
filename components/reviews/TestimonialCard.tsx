import type { PublicReview } from "@/lib/reviews/validate";
import { Stars } from "./Stars";

export function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]!.toUpperCase())
    .join("");
}

/** Large testimonial card used in the homepage carousel. */
export function TestimonialCard({ review }: { review: PublicReview }) {
  return (
    <figure className="flex h-full min-h-[350px] flex-col rounded-[25px] border border-line bg-surface p-6 shadow-[0_5px_18px_rgb(21_25_54/0.07)] transition-shadow duration-300 hover:shadow-[0_10px_25px_rgb(76_34_201/0.14)] sm:min-h-[390px] sm:px-[30px] sm:py-7">
      <span aria-hidden className="block h-[65px] select-none font-display text-[92px] font-bold leading-none text-accent">
        &ldquo;
      </span>
      <blockquote className="mb-7 mt-3 flex-1">
        <p className="line-clamp-[9] whitespace-pre-line break-words text-[17px] leading-[1.65] text-ink-soft sm:text-[20px]">{review.message}</p>
      </blockquote>
      <figcaption className="flex flex-wrap items-center gap-x-3.5 gap-y-3 border-t border-line pt-6">
        <span aria-hidden className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-accent text-[17px] font-bold text-white sm:h-[58px] sm:w-[58px]">
          {initials(review.name)}
        </span>
        <div className="min-w-0 flex-1">
          <p className="break-words text-[17px] font-bold text-ink">{review.name}</p>
          <p className="mt-1 text-sm text-accent-strong">{review.category ?? "Calculus Solver user"}</p>
        </div>
        <Stars rating={review.rating} size="h-[18px] w-[18px] sm:h-5 sm:w-5" />
      </figcaption>
    </figure>
  );
}
