// Database access (server only). Uses Neon Postgres over HTTP.
// The connection string comes from DATABASE_URL, which Vercel adds automatically
// when you connect a Neon database to the project. Without it, features that
// need the database switch themselves off instead of failing.

import { createHash } from "node:crypto";
import { neon, type NeonQueryFunction } from "@neondatabase/serverless";

let client: NeonQueryFunction<false, false> | null | undefined;
let schemaReady: Promise<void> | null = null;

export function getSql(): NeonQueryFunction<false, false> | null {
  if (client === undefined) {
    const url = process.env.DATABASE_URL ?? process.env.POSTGRES_URL;
    client = url ? neon(url) : null;
  }
  return client;
}

/** Creates the tables on first use, so no manual setup step is needed. Also documented in db/schema.sql. */
export function ensureSchema(): Promise<void> {
  const sql = getSql();
  if (!sql) return Promise.resolve();
  schemaReady ??= (async () => {
    await sql.query(`CREATE TABLE IF NOT EXISTS reviews (
      id BIGSERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT,
      rating SMALLINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
      message TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
      ip_hash TEXT NOT NULL,
      content_hash TEXT NOT NULL UNIQUE,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )`);
    // Added after launch; safe to run repeatedly.
    await sql.query(`ALTER TABLE reviews ADD COLUMN IF NOT EXISTS category TEXT`);
    await sql.query(`CREATE INDEX IF NOT EXISTS reviews_status_created ON reviews (status, created_at DESC)`);
    await sql.query(`CREATE INDEX IF NOT EXISTS reviews_ip_created ON reviews (ip_hash, created_at)`);
    await sql.query(`CREATE TABLE IF NOT EXISTS site_counters (name TEXT PRIMARY KEY, value BIGINT NOT NULL DEFAULT 0)`);
    await sql.query(`CREATE TABLE IF NOT EXISTS solve_limits (
      ip_hash TEXT NOT NULL,
      day DATE NOT NULL,
      n INT NOT NULL DEFAULT 0,
      PRIMARY KEY (ip_hash, day)
    )`);
  })().catch((err) => {
    schemaReady = null;
    throw err;
  });
  return schemaReady;
}

/**
 * One-way, daily-rotating hash of the visitor's IP address, used only for rate limiting.
 * The raw IP is never stored, and hashes from different days cannot be linked.
 */
export function visitorHash(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const ip = forwarded || request.headers.get("x-real-ip") || "unknown";
  const day = new Date().toISOString().slice(0, 10);
  const secret = process.env.REVIEWS_SALT ?? process.env.DATABASE_URL ?? "calculus-solver";
  return createHash("sha256").update(`${secret}|${day}|${ip}`).digest("hex");
}

export function sha256(text: string): string {
  return createHash("sha256").update(text).digest("hex");
}
