import type { Metadata } from "next";
import { JsonLd } from "@/components/content/JsonLd";
import { MessageSquareQuote } from "lucide-react";
import { PageHero } from "@/components/content/PageHero";
import { ReviewsSection } from "@/components/reviews/ReviewsSection";
import { getLiveReviewSnapshot } from "@/lib/reviews/store";
import { buildMetadata, reviewsLd } from "@/lib/seo";

// Rendered per request from the database (getLiveReviewSnapshot), so approvals, rejections and
// deletions show on the next page load. There is no page cache to go stale.

const description = "Read reviews of Calculus Solver from students who use it, and share your own experience with the step-by-step solver.";

export async function generateMetadata(): Promise<Metadata> {
  const { count } = (await getLiveReviewSnapshot()).summary;
  // An empty reviews page has nothing for search engines, so it is not indexed until reviews exist.
  return buildMetadata({ title: "Reviews", description, path: "/reviews", noIndex: count === 0 });
}

export default async function ReviewsPage() {
  const { summary, reviews } = await getLiveReviewSnapshot();
  return (
    <>
      {summary.count > 0 && <JsonLd data={reviewsLd(summary, reviews.slice(0, 10))} />}
      <PageHero crumbs={[{ name: "Reviews", path: "/reviews" }]} eyebrow="Reviews" icon={<MessageSquareQuote />} title="Calculus Solver Reviews">
        <p>
          Every review here was written by a visitor and approved by a person before publishing. Ratings and counts are calculated
          from those reviews only.
        </p>
      </PageHero>
      <div className="relative z-10 mx-auto -mt-12 max-w-6xl px-4 sm:px-6">
        <ReviewsSection limit={60} withForm />
      </div>
    </>
  );
}
