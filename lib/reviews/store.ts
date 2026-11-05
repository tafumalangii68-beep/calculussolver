// Review storage (server only).
//
// Public reads come from ONE cached snapshot: the newest approved reviews plus the count and
// average of all approved reviews, read in a single query. Every page (homepage, Reviews page,
// sitemap) uses that same snapshot, so the list, the count and the average always agree.
// The snapshot is tagged REVIEWS_CACHE_TAG and refreshed at least every REVIEWS_REVALIDATE_SECONDS;
// GET /api/reviews/revalidate refreshes it at once after moderating in the Neon SQL editor.

import { unstable_cache } from "next/cache";
import { devReviews } from "@/data/dev-reviews";
import { ensureSchema, getSql, sha256 } from "@/lib/db";
import type { PublicReview, ReviewInput, ReviewSummary } from "./validate";

/** Upper bound on how stale public review data can be without an on-demand refresh. */
export const REVIEWS_REVALIDATE_SECONDS = 60;
export const REVIEWS_CACHE_TAG = "reviews";
/** The most reviews any page shows (the Reviews page lists up to 60). */
const SNAPSHOT_LIMIT = 60;

/** Limits per visitor (by daily-rotating IP hash). */
const MAX_PER_HOUR = 2;
const MAX_PER_DAY = 5;

export function reviewsEnabled(): boolean {
  return getSql() !== null;
}

/**
 * Local testing aid: `npm run dev` without a database shows dummy reviews (data/dev-reviews.ts)
 * so the carousel can be seen with names and stars. Never true in a production build.
 */
export function usingDevReviews(): boolean {
  return process.env.NODE_ENV === "development" && getSql() === null;
}

export interface ReviewSnapshot {
  /** Newest approved reviews first, at most SNAPSHOT_LIMIT. */
  reviews: PublicReview[];
  /** Count and average of ALL approved reviews, from the same query as `reviews`. */
  summary: ReviewSummary;
}

const EMPTY: ReviewSnapshot = { reviews: [], summary: { count: 0, average: 0 } };

/**
 * One query, one snapshot: the window functions count and average every approved review before
 * LIMIT applies, so the summary always matches the list it was read with.
 */
export async function fetchSnapshot(): Promise<ReviewSnapshot> {
  const sql = getSql();
  if (!sql) return EMPTY;
  await ensureSchema();
  const rows = (await sql.query(
    `SELECT id, name, rating, message, category, created_at,
            COUNT(*) OVER ()::int AS total,
            AVG(rating) OVER ()::float AS average
       FROM reviews
      WHERE status = 'approved'
      ORDER BY created_at DESC, id DESC
      LIMIT $1`,
    [SNAPSHOT_LIMIT],
  )) as { id: string | number; name: string; rating: number; message: string; category: string | null; created_at: string | Date; total: number; average: number }[];
  return {
    reviews: rows.map((r) => ({
      id: Number(r.id),
      name: r.name,
      rating: Number(r.rating),
      message: r.message,
      category: r.category,
      createdAt: new Date(r.created_at).toISOString(),
    })),
    summary: rows.length ? { count: Number(rows[0].total), average: Number(rows[0].average) } : EMPTY.summary,
  };
}

function devSnapshot(): ReviewSnapshot {
  const total = devReviews.reduce((s, r) => s + r.rating, 0);
  return { reviews: devReviews.slice(0, SNAPSHOT_LIMIT), summary: { count: devReviews.length, average: total / devReviews.length } };
}

/**
 * The cached snapshot every public page reads. Never throws: if the database is unreachable the
 * page shows the empty state (not older data), and the failure is logged.
 */
export const getReviewSnapshot = unstable_cache(
  async (): Promise<ReviewSnapshot> => {
    if (usingDevReviews()) return devSnapshot();
    try {
      return await fetchSnapshot();
    } catch (err) {
      console.error("reviews: database read failed", err);
      return EMPTY;
    }
  },
  ["review-snapshot"],
  { revalidate: REVIEWS_REVALIDATE_SECONDS, tags: [REVIEWS_CACHE_TAG] },
);

/** Newest approved reviews, from the shared snapshot. */
export async function getApprovedReviews(limit: number): Promise<PublicReview[]> {
  return (await getReviewSnapshot()).reviews.slice(0, limit);
}

/** Count and average of approved reviews, from the same snapshot as getApprovedReviews. */
export async function getReviewSummary(): Promise<ReviewSummary> {
  return (await getReviewSnapshot()).summary;
}

export type SubmitOutcome = "saved" | "duplicate" | "rate-limited" | "unavailable";

/** Saves a validated review with status "pending". Rejects duplicates and floods. */
export async function submitReview(input: ReviewInput, visitor: string): Promise<SubmitOutcome> {
  const sql = getSql();
  if (!sql) return "unavailable";
  await ensureSchema();

  const recent = (await sql.query(
    `SELECT
       COUNT(*) FILTER (WHERE created_at > now() - interval '1 hour')::int AS hour,
       COUNT(*) FILTER (WHERE created_at > now() - interval '1 day')::int AS day
     FROM reviews WHERE ip_hash = $1`,
    [visitor],
  )) as { hour: number; day: number }[];
  if ((recent[0]?.hour ?? 0) >= MAX_PER_HOUR || (recent[0]?.day ?? 0) >= MAX_PER_DAY) return "rate-limited";

  if (input.email) {
    const sameEmail = (await sql.query(
      `SELECT 1 FROM reviews WHERE email = $1 AND created_at > now() - interval '30 days' LIMIT 1`,
      [input.email],
    )) as unknown[];
    if (sameEmail.length) return "duplicate";
  }

  // The same text can only be submitted once, whoever sends it.
  const contentHash = sha256(input.message.toLowerCase());
  const inserted = (await sql.query(
    `INSERT INTO reviews (name, email, rating, message, category, ip_hash, content_hash)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     ON CONFLICT (content_hash) DO NOTHING
     RETURNING id`,
    [input.name, input.email || null, input.rating, input.message, input.category || null, visitor, contentHash],
  )) as unknown[];
  return inserted.length ? "saved" : "duplicate";
}
