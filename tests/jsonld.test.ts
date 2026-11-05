// Structured data is embedded in a <script> tag and can include visitor-written review text,
// so it must never be able to close that tag.

import { describe, expect, it } from "vitest";
import { serializeJsonLd } from "@/components/content/JsonLd";
import { reviewsLd } from "@/lib/seo";

describe("JSON-LD serialisation", () => {
  const hostile = "Great site </script><script>alert(1)</script> <!-- x";
  const out = serializeJsonLd(
    reviewsLd({ count: 1, average: 5 }, [{ name: "</script>Eve", rating: 5, message: hostile, createdAt: "2026-01-01T00:00:00Z" }]),
  );

  it("contains no raw '<', so the script tag cannot be closed or commented out", () => {
    expect(out).not.toContain("<");
    expect(out.toLowerCase()).not.toContain("</script");
  });

  it("still parses back to exactly the original text", () => {
    const parsed = JSON.parse(out) as { review: { reviewBody: string; author: { name: string } }[] };
    expect(parsed.review[0].reviewBody).toBe(hostile);
    expect(parsed.review[0].author.name).toBe("</script>Eve");
  });
});
