import { MessageSquarePlus } from "lucide-react";
import Link from "next/link";
import { getApprovedReviews, getReviewSummary, reviewsEnabled } from "@/lib/reviews/store";
import { ReviewCard } from "./ReviewCard";
import { ReviewForm } from "./ReviewForm";
import { Stars } from "./Stars";

/**
 * "What Students Say": approved reviews only, with a rating summary computed from them.
 * Nothing is shown that doesn't come from real, approved submissions.
 */
export async function ReviewsSection({
  limit = 6,
  withForm = false,
  subtitle = "Your feedback helps us make learning calculus easier.",
}: {
  limit?: number;
  withForm?: boolean;
  subtitle?: string;
}) {
  const [summary, reviews] = await Promise.all([getReviewSummary(), getApprovedReviews(limit)]);
  const enabled = reviewsEnabled();

  return (
    <div className="space-y-10">
      <section aria-labelledby="reviews-heading" className="rounded-card border border-line bg-gradient-to-b from-surface to-accent-soft/50 px-4 py-12 sm:px-8">
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-accent-strong">Student reviews</p>
          <h2 id="reviews-heading" className="mt-3 font-serif text-3xl font-semibold text-ink sm:text-4xl">
            What Students Say
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-ink-soft">{subtitle}</p>
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

        {reviews.length > 0 ? (
          <ul className="mt-10 flex flex-wrap justify-center gap-6">
            {reviews.map((r) => (
              <li key={r.id} className="w-full md:w-[calc(50%-0.75rem)] lg:w-[calc((100%-3rem)/3)]">
                <ReviewCard review={r} />
              </li>
            ))}
          </ul>
        ) : (
          <div className="mx-auto mt-10 max-w-md rounded-card border border-dashed border-line-strong bg-surface p-8 text-center">
            <MessageSquarePlus aria-hidden className="mx-auto h-8 w-8 text-accent" />
            <p className="mt-3 font-semibold text-ink">No reviews yet</p>
            <p className="mt-1 text-sm text-muted">{enabled ? "Used the solver? Be the first to share how it helped." : "Reviews will open soon."}</p>
          </div>
        )}

        {!withForm && (
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            {summary.count > reviews.length && (
              <Link href="/reviews" className="rounded-lg border border-line-strong bg-surface px-5 py-2.5 font-medium text-ink hover:bg-sunken">
                Read all reviews
              </Link>
            )}
            <Link href="/reviews#write" className="rounded-lg bg-accent px-5 py-2.5 font-semibold text-white transition-colors hover:bg-accent-hover">
              Share Your Feedback
            </Link>
          </div>
        )}
      </section>

      {withForm && (
        <section id="write" aria-labelledby="write-heading" className="scroll-mt-24 rounded-card border border-line bg-surface p-6 shadow-card sm:p-8">
          <h2 id="write-heading" className="font-serif text-2xl font-semibold text-ink sm:text-3xl">
            Share Your Experience
          </h2>
          <p className="mt-2 max-w-2xl text-ink-soft">
            Tell other students how the solver worked for you. Honest reviews, including critical ones, are welcome; every review is
            read before it is published.
          </p>
          <div className="mt-6">
            {enabled ? (
              <ReviewForm />
            ) : (
              <p className="rounded-lg border border-warn/30 bg-warn-soft px-4 py-3 text-warn">Review submissions are not open yet. Please check back soon.</p>
            )}
          </div>
        </section>
      )}
    </div>
  );
}
