// Reviews and the solve counter: validation, the API routes, and the real SQL
// (run against PGlite, an in-process Postgres, in place of Neon).

import { PGlite } from "@electric-sql/pglite";
import { beforeEach, describe, expect, it, vi } from "vitest";

// Starting the in-process Postgres takes a few seconds.
vi.setConfig({ testTimeout: 30_000, hookTimeout: 30_000 });
import { validateReview } from "@/lib/reviews/validate";

// next/cache needs the Next.js runtime; in tests the cached readers just call through.
vi.mock("next/cache", () => ({ unstable_cache: (fn: unknown) => fn }));

// Route the app's database client to a fresh PGlite instance for each test.
let pg: PGlite;
vi.mock("@/lib/db", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/lib/db")>();
  let ready: Promise<void> | null = null;
  return {
    ...actual,
    getSql: () => ({ query: async (text: string, params?: unknown[]) => (await pg.query(text, params)).rows }),
    ensureSchema: () => {
      ready ??= (async () => {
        const schema = (await import("node:fs")).readFileSync("db/schema.sql", "utf8").replace(/--.*$/gm, "");
        for (const stmt of schema.split(";").map((s) => s.trim()).filter(Boolean)) await pg.query(stmt);
      })();
      return ready;
    },
    resetSchema: () => {
      ready = null;
    },
  };
});

const dbModule = (await import("@/lib/db")) as unknown as { resetSchema: () => void; ensureSchema: () => Promise<void> };
const store = await import("@/lib/reviews/store");
const stats = await import("@/lib/stats");
const { POST: postReview } = await import("@/app/api/reviews/route");

beforeEach(async () => {
  pg = new PGlite();
  dbModule.resetSchema();
});

const good = { name: "Maya K.", email: "", rating: 5, message: "The chain rule steps finally made sense to me." };

function request(body: unknown, headers: Record<string, string> = {}, ip = "203.0.113.7") {
  return new Request("https://calculussolver.pro/api/reviews", {
    method: "POST",
    headers: { "content-type": "application/json", origin: "https://calculussolver.pro", "x-forwarded-for": ip, ...headers },
    body: JSON.stringify(body),
  });
}
const human = (extra: object = {}) => ({ ...good, website: "", startedAt: Date.now() - 20_000, ...extra });

describe("review validation", () => {
  it("accepts a valid review and normalises whitespace", () => {
    const r = validateReview({ ...good, name: "  Maya   K. ", email: " MAYA@Example.com " });
    expect(r).toEqual({ ok: true, value: { ...good, email: "maya@example.com" } });
  });

  it.each([
    [{ name: "" }, "name"],
    [{ name: "Visit www.spam.com" }, "name"],
    [{ email: "not-an-email" }, "email"],
    [{ rating: 0 }, "rating"],
    [{ rating: 6 }, "rating"],
    [{ rating: 3.5 }, "rating"],
    [{ message: "Too short" }, "message"],
    [{ message: "x".repeat(1001) }, "message"],
    [{ message: "Great tool, see https://example.com for more" }, "message"],
  ])("rejects %j", (patch, field) => {
    const r = validateReview({ ...good, ...patch });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(Object.keys(r.errors)).toContain(field);
  });
});

describe("POST /api/reviews", () => {
  it("saves a valid review as pending, so it is not public", async () => {
    const res = await postReview(request(human()));
    expect(res.status).toBe(200);
    const rows = (await pg.query<{ status: string; name: string; email: string | null }>("SELECT status, name, email FROM reviews")).rows;
    expect(rows).toEqual([{ status: "pending", name: "Maya K.", email: null }]);
    expect(await store.getApprovedReviews(10)).toEqual([]);
    expect(await store.getReviewSummary()).toEqual({ count: 0, average: 0 });
  });

  it("shows only approved reviews, with a summary computed from them", async () => {
    await postReview(request(human()));
    await postReview(request(human({ name: "Leo", rating: 3, message: "Useful, but I wanted graphs as well." }), {}, "198.51.100.4"));
    await postReview(request(human({ name: "Spam", rating: 1, message: "This one should stay pending forever." }), {}, "198.51.100.9"));
    await pg.query("UPDATE reviews SET status = 'approved' WHERE name IN ('Maya K.', 'Leo')");

    const reviews = await store.getApprovedReviews(10);
    expect(reviews.map((r) => r.name).sort()).toEqual(["Leo", "Maya K."]);
    expect(reviews.every((r) => !("email" in r))).toBe(true);
    expect(await store.getReviewSummary()).toEqual({ count: 2, average: 4 });
  });

  it("never stores the raw IP address", async () => {
    await postReview(request(human()));
    const { ip_hash } = (await pg.query<{ ip_hash: string }>("SELECT ip_hash FROM reviews")).rows[0];
    expect(ip_hash).toMatch(/^[0-9a-f]{64}$/);
    expect(ip_hash).not.toContain("203.0.113.7");
  });

  it("rejects duplicate text and repeat emails", async () => {
    expect((await postReview(request(human()))).status).toBe(200);
    expect((await postReview(request(human(), {}, "192.0.2.50"))).status).toBe(409);
    await postReview(request(human({ email: "a@b.co", message: "First review from this email address." }), {}, "192.0.2.60"));
    expect((await postReview(request(human({ email: "a@b.co", message: "Second review, same email address." }), {}, "192.0.2.61"))).status).toBe(409);
  });

  it("rate-limits repeated submissions from one visitor", async () => {
    const statuses = [];
    for (let i = 0; i < 3; i++) statuses.push((await postReview(request(human({ message: `Distinct review number ${i} for the test.` })))).status);
    expect(statuses).toEqual([200, 200, 429]);
  });

  it("silently drops bots that fill the honeypot or submit instantly", async () => {
    expect((await postReview(request(human({ website: "http://spam.example" })))).status).toBe(200);
    expect((await postReview(request(human({ startedAt: Date.now() })))).status).toBe(200);
    await dbModule.ensureSchema();
    expect((await pg.query("SELECT 1 FROM reviews")).rows).toHaveLength(0);
  });

  it("rejects invalid input with field errors", async () => {
    const res = await postReview(request(human({ rating: 9 })));
    expect(res.status).toBe(422);
    expect((await res.json()).fields.rating).toBeTruthy();
  });

  it("rejects posts from other websites", async () => {
    expect((await postReview(request(human(), { origin: "https://evil.example" }))).status).toBe(403);
  });
});

describe("problems solved counter", () => {
  it("counts solves and caps one visitor per day", async () => {
    for (let i = 0; i < 3; i++) await stats.recordSolve("visitor-a");
    await stats.recordSolve("visitor-b");
    expect(await stats.getSolveCount()).toBe(4);
    await pg.query("UPDATE solve_limits SET n = 300 WHERE ip_hash = 'visitor-a'");
    expect(await stats.recordSolve("visitor-a")).toBe(false);
    expect(await stats.getSolveCount()).toBe(4);
  });
});
