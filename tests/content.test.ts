// Every worked example published on the site must be reproduced by the solver.

import { describe, expect, it } from "vitest";
import { posts } from "@/data/blog";
import { calculatorList } from "@/data/calculators";
import { guides } from "@/data/guides";
import { homeExamples } from "@/data/home";
import { evaluate } from "@/lib/math/evaluate";
import { parse } from "@/lib/math/parser";
import { solve } from "@/lib/math/solve";
import type { WorkedExample } from "@/types/content";

const POINTS = [-1.7, -0.6, 0.35, 0.8, 1.9, 2.6, 4.3];

const examples: [string, WorkedExample][] = [
  ...calculatorList.flatMap((page) => page.examples.map((e) => [`${page.slug}: ${e.title}`, e] as [string, WorkedExample])),
  ...guides.flatMap((g) => g.examples.map((e) => [`${g.slug}: ${e.title}`, e] as [string, WorkedExample])),
  ...posts.flatMap((p) => p.examples.map((e) => [`blog/${p.slug}: ${e.title}`, e] as [string, WorkedExample])),
  ...homeExamples.map((e) => [`home: ${e.title}`, e] as [string, WorkedExample]),
];

describe("published worked examples", () => {
  it.each(examples)("%s", async (_name, example) => {
    const { check } = example;
    const result = await solve({ variable: "x", ...check });
    if (!result.ok) throw new Error(result.error);

    if (check.expected === "dne") {
      expect(result.answerText).toBe("does not exist");
      return;
    }
    if (check.operation === "critical-points") {
      // answerText looks like "x = -1 (local maximum); x = 3 (local minimum)".
      const xs = result.answerText.split(";").map((part) => evaluate(parse(part.replace(/^\s*x = /, "").replace(/\s*\(.*\)\s*$/, "")).node));
      const expected = check.expected.split(",").map((s) => evaluate(parse(s).node));
      expect(xs.length).toBe(expected.length);
      xs.forEach((x, i) => expect(Math.abs(x - expected[i])).toBeLessThan(1e-7));
      return;
    }
    const actual = parse(result.answerText.replace(/\s*\+\s*C$/, "").replace(/^≈/, "")).node;
    const expected = parse(check.expected).node;
    const constantOffset = check.operation === "indefinite-integral";
    let offset: number | null = null;
    let compared = 0;
    for (const x of POINTS) {
      const a = evaluate(actual, { x });
      const b = evaluate(expected, { x });
      if (!Number.isFinite(a) || !Number.isFinite(b)) continue;
      const diff = a - b;
      if (constantOffset) offset ??= diff;
      expect(Math.abs(diff - (constantOffset ? offset! : 0))).toBeLessThan(1e-8 * Math.max(1, Math.abs(b)));
      compared++;
    }
    expect(compared).toBeGreaterThan(0);
  });
});
