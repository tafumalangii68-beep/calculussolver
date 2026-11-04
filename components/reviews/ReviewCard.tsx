import { Quote } from "lucide-react";
import { formatDate } from "@/components/content/ProsePage";
import type { PublicReview } from "@/lib/reviews/validate";
import { Stars } from "./Stars";

function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]!.toUpperCase())
    .join("");
}

export function ReviewCard({ review }: { review: PublicReview }) {
  const date = review.createdAt.slice(0, 10);
  return (
    <article className="flex h-full flex-col rounded-card border border-line bg-surface p-6 shadow-card transition duration-200 hover:-translate-y-0.5 hover:border-accent/40 hover:shadow-lg">
      <Quote aria-hidden className="h-8 w-8 fill-accent-soft text-accent" strokeWidth={1.5} />
      <p className="mt-4 flex-1 whitespace-pre-line break-words text-ink-soft">{review.message}</p>
      <footer className="mt-6 flex flex-wrap items-center justify-between gap-x-3 gap-y-2 border-t border-line pt-5">
        <div className="flex min-w-0 items-center gap-3">
          <span aria-hidden className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-accent text-sm font-semibold text-white">
            {initials(review.name)}
          </span>
          <div className="min-w-0">
            <p className="break-words font-semibold text-ink">{review.name}</p>
            <p className="text-sm text-muted">
              <time dateTime={date}>{formatDate(date)}</time>
            </p>
          </div>
        </div>
        <Stars rating={review.rating} className="shrink-0" />
      </footer>
    </article>
  );
}
