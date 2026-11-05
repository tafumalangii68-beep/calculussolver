// On-demand refresh of public review data, for use right after moderating reviews in the Neon
// SQL editor (approving, rejecting or deleting). Moderation happens outside the app, so the app
// cannot know about it; this route tells it.
//
//   Open in a browser:  https://www.calculussolver.pro/api/reviews/revalidate?secret=YOUR_SECRET
//   Or:                 curl -X POST -H "Authorization: Bearer YOUR_SECRET" https://www.calculussolver.pro/api/reviews/revalidate
//
// YOUR_SECRET is the REVALIDATE_SECRET environment variable set in Vercel. Without it the route is off.

import { createHash, timingSafeEqual } from "node:crypto";
import { revalidatePath, revalidateTag } from "next/cache";
import { REVIEWS_CACHE_TAG } from "@/lib/reviews/store";

function json(body: unknown, status: number) {
  return Response.json(body, { status, headers: { "Cache-Control": "no-store" } });
}

/** Constant-time comparison (hashing first makes the lengths equal). */
function matches(given: string, expected: string): boolean {
  const a = createHash("sha256").update(given).digest();
  const b = createHash("sha256").update(expected).digest();
  return timingSafeEqual(a, b);
}

function handle(request: Request) {
  const expected = process.env.REVALIDATE_SECRET;
  if (!expected || expected.length < 16) {
    return json({ ok: false, error: "On-demand refresh is not configured. Set REVALIDATE_SECRET (16+ characters) in Vercel, then redeploy." }, 503);
  }
  const url = new URL(request.url);
  const bearer = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "") ?? "";
  const given = bearer || url.searchParams.get("secret") || "";
  if (!given || !matches(given, expected)) return json({ ok: false, error: "Not authorised." }, 401);

  // Drop the cached review snapshot immediately ({ expire: 0 }: the next request reads the
  // database instead of being served the old data), then the pages and sitemap built from it.
  revalidateTag(REVIEWS_CACHE_TAG, { expire: 0 });
  revalidatePath("/");
  revalidatePath("/reviews");
  revalidatePath("/sitemap.xml");
  return json({ ok: true, refreshed: ["/", "/reviews", "/sitemap.xml"] }, 200);
}

export const GET = handle;
export const POST = handle;
