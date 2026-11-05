// The on-demand review refresh route: off without a secret, rejects wrong secrets, and on success
// expires the review data immediately and the pages built from it.

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const calls: unknown[][] = [];
vi.mock("next/cache", () => ({
  unstable_cache: (fn: unknown) => fn,
  revalidateTag: (...args: unknown[]) => calls.push(["tag", ...args]),
  revalidatePath: (...args: unknown[]) => calls.push(["path", ...args]),
}));

const { GET, POST } = await import("@/app/api/reviews/revalidate/route");
const SECRET = "test-secret-0123456789abcdef";
const url = (q = "") => `https://www.calculussolver.pro/api/reviews/revalidate${q}`;

describe("GET/POST /api/reviews/revalidate", () => {
  beforeEach(() => {
    calls.length = 0;
  });
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("is switched off until REVALIDATE_SECRET is set", async () => {
    vi.stubEnv("REVALIDATE_SECRET", "");
    const res = await GET(new Request(url(`?secret=${SECRET}`)));
    expect(res.status).toBe(503);
    expect(calls).toHaveLength(0);
  });

  it("rejects a missing or wrong secret without refreshing anything", async () => {
    vi.stubEnv("REVALIDATE_SECRET", SECRET);
    expect((await GET(new Request(url()))).status).toBe(401);
    expect((await GET(new Request(url("?secret=wrong")))).status).toBe(401);
    expect((await POST(new Request(url(), { method: "POST", headers: { authorization: "Bearer nope" } }))).status).toBe(401);
    expect(calls).toHaveLength(0);
  });

  it("expires the review data at once and refreshes the pages that show it", async () => {
    vi.stubEnv("REVALIDATE_SECRET", SECRET);
    const res = await GET(new Request(url(`?secret=${SECRET}`)));
    expect(res.status).toBe(200);
    expect(res.headers.get("cache-control")).toBe("no-store");
    expect(calls).toEqual([
      ["tag", "reviews", { expire: 0 }],
      ["path", "/"],
      ["path", "/reviews"],
      ["path", "/sitemap.xml"],
    ]);
  });

  it("also accepts the secret as a Bearer token", async () => {
    vi.stubEnv("REVALIDATE_SECRET", SECRET);
    const res = await POST(new Request(url(), { method: "POST", headers: { authorization: `Bearer ${SECRET}` } }));
    expect(res.status).toBe(200);
  });
});
