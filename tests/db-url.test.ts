// Finding the Neon connection string under the names Vercel's integration may use.

import { describe, expect, it } from "vitest";
import { findDatabaseUrl } from "@/lib/db";

const POOLED = "postgresql://u:p@ep-x-pooler.neon.tech/db?sslmode=require";
const DIRECT = "postgresql://u:p@ep-x.neon.tech/db?sslmode=require";

describe("findDatabaseUrl", () => {
  it("uses DATABASE_URL first, then POSTGRES_URL", () => {
    expect(findDatabaseUrl({ DATABASE_URL: POOLED, POSTGRES_URL: "other" })).toBe(POOLED);
    expect(findDatabaseUrl({ POSTGRES_URL: POOLED })).toBe(POOLED);
  });

  it("finds prefixed names from a custom integration prefix", () => {
    expect(findDatabaseUrl({ STORAGE_DATABASE_URL: POOLED, STORAGE_DATABASE_URL_UNPOOLED: DIRECT })).toBe(POOLED);
    expect(findDatabaseUrl({ NEON_POSTGRES_URL: POOLED, NEON_POSTGRES_URL_NON_POOLING: DIRECT })).toBe(POOLED);
  });

  it("finds a renamed connection string by its value, skipping direct and Prisma variants", () => {
    expect(findDatabaseUrl({ STORAGE_URL_UNPOOLED: DIRECT, STORAGE_PRISMA_URL: DIRECT, STORAGE_URL: POOLED })).toBe(POOLED);
  });

  it("ignores unrelated URLs and returns undefined when nothing is configured", () => {
    expect(findDatabaseUrl({ VERCEL_URL: "calculussolver.vercel.app", NEXT_PUBLIC_SITE_URL: "https://x" })).toBeUndefined();
    expect(findDatabaseUrl({})).toBeUndefined();
  });
});
