import { visitorHash } from "@/lib/db";
import { recordSolve } from "@/lib/stats";

/** Adds 1 to the "problems solved" counter. The request carries no data about the problem. */
export async function POST(request: Request) {
  try {
    await recordSolve(visitorHash(request));
  } catch (err) {
    console.error("stats: record failed", err);
  }
  return new Response(null, { status: 204, headers: { "Cache-Control": "no-store" } });
}
