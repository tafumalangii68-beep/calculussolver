// Review storage (server only). Public reads are cached and refreshed every few minutes.

import { unstable_cache } from "next/cache";
import { ensureSchema, getSql, sha256 } from "@/lib/db";
import type { PublicReview, ReviewInput, ReviewSummary } from "./validate";

export const REVIEWS_REVALIDATE_SECONDS = 300;

/** Limits per visitor (by daily-rotating IP hash). */
const MAX_PER_HOUR = 2;
const MAX_PER_DAY = 5;

export function reviewsEnabled(): boolean {
  return getSql() !== null;
}

async function fetchApproved(limit: number): Promise<PublicReview[]> {
  const sql = getSql();
  if (!sql) return [];
  await ensureSchema();
  const rows = (await sql.query(
    `SELECT id, name, rating, message, created_at FROM reviews WHERE status = 'approved' ORDER BY created_at DESC LIMIT $1`,
    [limit],
  )) as { id: string | number; name: string; rating: number; message: string; created_at: string | Date }[];
  return rows.map((r) => ({
    id: Number(r.id),
    name: r.name,
    rating: Number(r.rating),
    message: r.message,
    createdAt: new Date(r.created_at).toISOString(),
  }));
}

async function fetchSummary(): Promise<ReviewSummary> {
  const sql = getSql();
  if (!sql) return { count: 0, average: 0 };
  await ensureSchema();
  const rows = (await sql.query(`SELECT COUNT(*)::int AS count, COALESCE(AVG(rating), 0)::float AS average FROM reviews WHERE status = 'approved'`)) as {
    count: number;
    average: number;
  }[];
  return { count: Number(rows[0]?.count ?? 0), average: Number(rows[0]?.average ?? 0) };
}

/** Never throws: if the database is unreachable, the page renders the empty state instead of an error. */
function safe<T>(fn: () => Promise<T>, fallback: T): () => Promise<T> {
  return async () => {
    try {
      return await fn();
    } catch (err) {
      console.error("reviews: database read failed", err);
      return fallback;
    }
  };
}

export const getApprovedReviews = unstable_cache(
  (limit: number) => safe(() => fetchApproved(limit), [])(),
  ["approved-reviews"],
  { revalidate: REVIEWS_REVALIDATE_SECONDS, tags: ["reviews"] },
);

export const getReviewSummary = unstable_cache(safe(fetchSummary, { count: 0, average: 0 }), ["review-summary"], {
  revalidate: REVIEWS_REVALIDATE_SECONDS,
  tags: ["reviews"],
});

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
    `INSERT INTO reviews (name, email, rating, message, ip_hash, content_hash)
     VALUES ($1, $2, $3, $4, $5, $6)
     ON CONFLICT (content_hash) DO NOTHING
     RETURNING id`,
    [input.name, input.email || null, input.rating, input.message, visitor, contentHash],
  )) as unknown[];
  return inserted.length ? "saved" : "duplicate";
}
