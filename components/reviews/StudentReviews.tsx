import Link from "next/link";
import { exampleCards } from "@/data/example-cards";
import { getApprovedReviews, getReviewSummary, usingDevReviews } from "@/lib/reviews/store";
import { ExampleCard } from "./ExampleCard";
import { ReviewMarquee } from "./ReviewMarquee";
import { Stars } from "./Stars";
import { TestimonialCard } from "./TestimonialCard";

/** Below this many approved reviews the cards stay still: a loop of one or two cards would look repetitive. */
const MIN_FOR_CAROUSEL = 3;

/**
 * Homepage testimonials. With 3+ approved reviews, those real reviews scroll continuously.
 * With 1-2 they are shown still. With none yet, clearly labelled example cards (no names,
 * no ratings) keep the carousel moving until real reviews arrive.
 */
export async function StudentReviews({ limit = 12 }: { limit?: number }) {
  const [summary, reviews] = await Promise.all([getReviewSummary(), getApprovedReviews(limit)]);

  return (
    <section aria-labelledby="testimonials-heading" className="overflow-hidden border-y border-line bg-testimonial-bg py-16 sm:py-[85px]">
      {usingDevReviews() && (
        <p className="mx-auto mb-8 max-w-xl rounded-lg border border-warn/30 bg-warn-soft px-4 py-2 text-center text-sm font-medium text-warn">
          Test data: dummy reviews shown in local development only. They never appear on the live site.
        </p>
      )}
      <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
        <p className="inline-flex items-center gap-2 rounded-full bg-accent-soft px-5 py-2.5 text-[13px] font-bold uppercase tracking-[2px] text-accent-strong">
          <span aria-hidden className="text-lg leading-none">
            ✦
          </span>
          Trusted by users worldwide
        </p>
        <h2 id="testimonials-heading" className="mb-3.5 mt-6 font-serif text-[clamp(30px,4vw,49px)] font-semibold leading-[1.2] text-ink">
          What people are saying
        </h2>
        <p className="mx-auto max-w-[780px] text-[15px] leading-[1.7] text-muted sm:text-[17px]">
          Discover how learners use our step-by-step calculus tools to understand and solve problems with confidence.
        </p>
        {summary.count > 0 && (
          <p className="mt-6 inline-flex flex-wrap items-center justify-center gap-x-3 gap-y-1 rounded-full border border-line bg-surface px-5 py-2.5 shadow-card">
            <Stars rating={summary.average} size="h-5 w-5" />
            <span className="text-lg font-semibold text-ink">{summary.average.toFixed(1)}</span>
            <span aria-hidden className="text-muted">
              ·
            </span>
            <span className="text-ink-soft">
              {summary.count} {summary.count === 1 ? "review" : "reviews"}
            </span>
          </p>
        )}
      </div>

      <div className="mt-10">
        {reviews.length >= MIN_FOR_CAROUSEL ? (
          <ReviewMarquee label="Student testimonials" items={reviews.map((r) => ({ key: String(r.id), content: <TestimonialCard review={r} /> }))} />
        ) : reviews.length > 0 ? (
          <ul className="mx-auto flex max-w-6xl flex-wrap justify-center gap-6 px-4 py-6 sm:px-6">
            {reviews.map((r) => (
              <li key={r.id} className="flex w-full max-w-[25rem]">
                <TestimonialCard review={r} />
              </li>
            ))}
          </ul>
        ) : (
          <ReviewMarquee label="Example cards, not reviews" items={exampleCards.map((c) => ({ key: c.topic, content: <ExampleCard card={c} /> }))} />
        )}
      </div>

      <div className="mt-10 flex flex-wrap justify-center gap-3 px-4">
        {summary.count > reviews.length && (
          <Link href="/reviews" className="rounded-lg border border-line-strong bg-surface px-5 py-2.5 font-medium text-ink hover:bg-sunken">
            Read all reviews
          </Link>
        )}
        <Link href="/reviews#write" className="rounded-lg bg-accent px-6 py-2.5 font-semibold text-white transition-colors hover:bg-accent-hover">
          Share Your Feedback
        </Link>
      </div>
    </section>
  );
}
