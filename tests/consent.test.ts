import { describe, expect, it } from "vitest";
import { CONSENT_VERSION, parseConsent } from "@/lib/consent";

describe("consent records", () => {
  it("accepts a valid record", () => {
    const raw = JSON.stringify({ version: CONSENT_VERSION, necessary: true, analytics: false, marketing: true, updatedAt: "2026-01-01" });
    expect(parseConsent(raw)).toMatchObject({ analytics: false, marketing: true, necessary: true });
  });

  it.each([null, "", "not json", "{}", JSON.stringify({ version: 0, analytics: true, marketing: true })])("rejects %j so the banner is shown again", (raw) => {
    expect(parseConsent(raw)).toBeNull();
  });
});
