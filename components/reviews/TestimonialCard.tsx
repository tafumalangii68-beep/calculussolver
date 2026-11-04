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
    <figure className="flex h-full flex-col rounded-[28px] border border-line bg-surface p-7 shadow-[0_1px_2px_rgb(31_30_28/0.04),0_12px_32px_rgb(31_30_28/0.06)] sm:p-9">
      <span aria-hidden className="block h-10 select-none font-serif text-[5.5rem] leading-[0.9] text-accent sm:h-12 sm:text-[6.5rem]">
        &ldquo;
      </span>
      <blockquote className="mt-5 flex-1">
        <p className="line-clamp-[9] whitespace-pre-line break-words text-[1.05rem] leading-relaxed text-ink-soft sm:text-lg">{review.message}</p>
      </blockquote>
      <figcaption className="mt-7 flex flex-wrap items-center justify-between gap-x-4 gap-y-3 border-t border-line pt-6">
        <div className="flex min-w-0 items-center gap-3 sm:gap-4">
          <span aria-hidden className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-accent font-semibold text-white sm:h-14 sm:w-14 sm:text-lg">
            {initials(review.name)}
          </span>
          <div className="min-w-0">
            <p className="break-words text-base font-bold text-ink sm:text-lg">{review.name}</p>
            <p className="text-sm text-accent-strong">{review.category ?? "Calculus Solver user"}</p>
          </div>
        </div>
        <Stars rating={review.rating} size="h-5 w-5" />
      </figcaption>
    </figure>
  );
}
