import type { Metadata } from "next";
import { JsonLd } from "@/components/content/JsonLd";
import { PageIntro } from "@/components/content/PageIntro";
import { ReviewsSection } from "@/components/reviews/ReviewsSection";
import { getApprovedReviews, getReviewSummary } from "@/lib/reviews/store";
import { buildMetadata, reviewsLd } from "@/lib/seo";

// Approved reviews appear within this many seconds.
export const revalidate = 300;

const description = "Read reviews of Calculus Solver from students who use it, and share your own experience with the step-by-step solver.";

export async function generateMetadata(): Promise<Metadata> {
  const { count } = await getReviewSummary();
  // An empty reviews page has nothing for search engines, so it is not indexed until reviews exist.
  return buildMetadata({ title: "Reviews", description, path: "/reviews", noIndex: count === 0 });
}

export default async function ReviewsPage() {
  const [summary, reviews] = await Promise.all([getReviewSummary(), getApprovedReviews(60)]);
  return (
    <div className="mx-auto max-w-6xl px-4 pt-8 sm:px-6 sm:pt-10">
      {summary.count > 0 && <JsonLd data={reviewsLd(summary, reviews.slice(0, 10))} />}
      <PageIntro crumbs={[{ name: "Reviews", path: "/reviews" }]} title="Calculus Solver Reviews">
        <p>
          Every review here was written by a visitor and approved by a person before publishing. Ratings and counts are calculated
          from those reviews only.
        </p>
      </PageIntro>
      <div className="mt-10">
        <ReviewsSection limit={60} withForm />
      </div>
    </div>
  );
}
