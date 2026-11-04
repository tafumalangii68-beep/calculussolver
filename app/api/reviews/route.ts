import { visitorHash } from "@/lib/db";
import { submitReview } from "@/lib/reviews/store";
import { validateReview } from "@/lib/reviews/validate";

/** Reviews must take at least this long to write; faster submissions are almost always bots. */
const MIN_FILL_MS = 3000;
const MAX_BODY_BYTES = 10_000;

function json(body: unknown, status = 200) {
  return Response.json(body, { status, headers: { "Cache-Control": "no-store" } });
}

/** Rejects posts from other websites (the browser always sends Origin on cross-site POSTs). */
function sameOrigin(request: Request): boolean {
  const origin = request.headers.get("origin");
  if (!origin) return true;
  try {
    return new URL(origin).host === new URL(request.url).host || new URL(origin).host === request.headers.get("host");
  } catch {
    return false;
  }
}

export async function POST(request: Request) {
  if (!sameOrigin(request)) return json({ ok: false, error: "Submissions from other websites are not accepted." }, 403);
  if (Number(request.headers.get("content-length") ?? 0) > MAX_BODY_BYTES) return json({ ok: false, error: "That review is too long." }, 413);

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return json({ ok: false, error: "The form could not be read. Please try again." }, 400);
  }

  // Spam traps: a hidden field people never fill in, and a minimum time to write the review.
  // Bots get a normal-looking success so they don't learn to adapt; nothing is saved.
  const elapsed = Date.now() - Number(body.startedAt);
  if (String(body.website ?? "").trim() !== "" || !Number.isFinite(elapsed) || elapsed < MIN_FILL_MS) {
    return json({ ok: true });
  }

  const result = validateReview(body);
  if (!result.ok) return json({ ok: false, error: "Please fix the highlighted fields.", fields: result.errors }, 422);

  try {
    const outcome = await submitReview(result.value, visitorHash(request));
    switch (outcome) {
      case "saved":
        return json({ ok: true });
      case "duplicate":
        return json({ ok: false, error: "It looks like this review has already been submitted. Thank you!" }, 409);
      case "rate-limited":
        return json({ ok: false, error: "You've sent several reviews recently. Please try again later." }, 429);
      case "unavailable":
        return json({ ok: false, error: "Reviews are not open yet. Please check back soon." }, 503);
    }
  } catch (err) {
    console.error("reviews: submit failed", err);
    return json({ ok: false, error: "Something went wrong while saving your review. Please try again in a few minutes." }, 500);
  }
}
