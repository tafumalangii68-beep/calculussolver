import Link from "next/link";
import { getApprovedReviews, getReviewSummary, reviewsEnabled } from "@/lib/reviews/store";
import { ReviewMarquee } from "./ReviewMarquee";
import { Stars } from "./Stars";
import { TestimonialCard } from "./TestimonialCard";

/** Below this many approved reviews the cards stay still: a loop of one or two cards would look repetitive. */
const MIN_FOR_CAROUSEL = 3;

/**
 * Homepage testimonials: real, approved reviews only. Scrolls continuously once there are
 * enough reviews; shows an honest invitation to review when there are none yet.
 */
export async function StudentReviews({ limit = 12 }: { limit?: number }) {
  const [summary, reviews] = await Promise.all([getReviewSummary(), getApprovedReviews(limit)]);
  const enabled = reviewsEnabled();

  return (
    <section aria-labelledby="testimonials-heading" className="overflow-hidden rounded-[32px] border border-line bg-testimonial-bg px-4 py-14 sm:px-8 sm:py-16">
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-accent-strong">Student testimonials</p>
        <h2 id="testimonials-heading" className="mt-3 font-serif text-3xl font-semibold leading-tight text-ink sm:text-4xl">
          What People Say About Calculus Solver
        </h2>
        <p className="mt-4 text-ink-soft">Discover how students use our step-by-step calculus tools to make learning mathematics easier.</p>
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
          <ReviewMarquee reviews={reviews} />
        ) : reviews.length > 0 ? (
          <ul className="flex flex-wrap justify-center gap-6 py-6">
            {reviews.map((r) => (
              <li key={r.id} className="flex w-full max-w-[25rem]">
                <TestimonialCard review={r} />
              </li>
            ))}
          </ul>
        ) : (
          <div className="mx-auto max-w-xl rounded-[28px] border border-dashed border-line-strong bg-surface p-8 text-center sm:p-10">
            <span aria-hidden className="block h-10 select-none font-serif text-[5rem] leading-[0.9] text-accent">
              &ldquo;
            </span>
            <p className="mt-4 font-serif text-xl font-semibold text-ink">Be the first to share your experience</p>
            <p className="mt-2 text-ink-soft">
              {enabled
                ? "Used Calculus Solver for homework, exam prep or self-study? Your review could be the first one here."
                : "Student reviews are opening soon. Real reviews from students will appear here."}
            </p>
          </div>
        )}
      </div>

      <div className="mt-10 flex flex-wrap justify-center gap-3">
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
