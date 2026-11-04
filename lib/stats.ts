// Anonymous count of solved problems (server only). Only a +1 is recorded:
// never the expression, the result, or anything that identifies the visitor.

import { unstable_cache } from "next/cache";
import { ensureSchema, getSql } from "@/lib/db";

const COUNTER = "problems_solved";
/** Increments accepted per visitor per day, so one visitor cannot inflate the number. */
const MAX_PER_VISITOR_PER_DAY = 300;

async function fetchSolveCount(): Promise<number> {
  const sql = getSql();
  if (!sql) return 0;
  try {
    await ensureSchema();
    const rows = (await sql.query(`SELECT value FROM site_counters WHERE name = $1`, [COUNTER])) as { value: string | number }[];
    return Number(rows[0]?.value ?? 0);
  } catch (err) {
    console.error("stats: database read failed", err);
    return 0;
  }
}

export const getSolveCount = unstable_cache(fetchSolveCount, ["solve-count"], { revalidate: 300, tags: ["stats"] });

export async function recordSolve(visitor: string): Promise<boolean> {
  const sql = getSql();
  if (!sql) return false;
  await ensureSchema();
  const rows = (await sql.query(
    `INSERT INTO solve_limits (ip_hash, day, n) VALUES ($1, CURRENT_DATE, 1)
     ON CONFLICT (ip_hash, day) DO UPDATE SET n = solve_limits.n + 1
     RETURNING n`,
    [visitor],
  )) as { n: number }[];
  if ((rows[0]?.n ?? 0) > MAX_PER_VISITOR_PER_DAY) return false;
  await sql.query(
    `INSERT INTO site_counters (name, value) VALUES ($1, 1)
     ON CONFLICT (name) DO UPDATE SET value = site_counters.value + 1`,
    [COUNTER],
  );
  // Occasionally clear rate-limit rows older than two days.
  if (Math.random() < 0.01) await sql.query(`DELETE FROM solve_limits WHERE day < CURRENT_DATE - 2`);
  return true;
}
