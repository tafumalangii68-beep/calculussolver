// Known problems with verified answers. Answers are compared numerically after
// parsing the solver's plain-text output, so equivalent forms are accepted.

import { describe, expect, it } from "vitest";
import { evaluate } from "@/lib/math/evaluate";
import { parse } from "@/lib/math/parser";
import { solve } from "@/lib/math/solve";
import type { SolveRequest, SolveSuccess } from "@/types/solver";

const POINTS = [-1.7, -0.6, 0.35, 0.8, 1.9, 2.6];

async function ok(req: Partial<SolveRequest> & { expression: string; operation: SolveRequest["operation"] }): Promise<SolveSuccess> {
  const result = await solve({ variable: "x", ...req });
  if (!result.ok) throw new Error(`${req.expression}: ${result.error}`);
  return result;
}

/** Asserts two expressions in x agree wherever both are defined (optionally up to a constant). */
function sameFunction(actual: string, expected: string, upToConstant = false) {
  const a = parse(actual.replace(/\s*\+\s*C$/, "")).node;
  const e = parse(expected).node;
  let offset: number | null = null;
  let compared = 0;
  for (const x of POINTS) {
    const va = evaluate(a, { x });
    const ve = evaluate(e, { x });
    if (!Number.isFinite(va) || !Number.isFinite(ve)) continue;
    const diff = va - ve;
    if (upToConstant) {
      offset ??= diff;
      expect(Math.abs(diff - offset)).toBeLessThan(1e-8 * Math.max(1, Math.abs(ve)));
    } else {
      expect(Math.abs(diff)).toBeLessThan(1e-8 * Math.max(1, Math.abs(ve)));
    }
    compared++;
  }
  expect(compared).toBeGreaterThanOrEqual(2);
}

function sameNumber(actual: string, expected: number) {
  expect(Math.abs(evaluate(parse(actual).node) - expected)).toBeLessThan(1e-8 * Math.max(1, Math.abs(expected)));
}

describe("derivatives", () => {
  const cases: [string, string, number?][] = [
    ["3x^2 - 5x + 2", "6x - 5"],
    ["x^2 sin(x)", "2x sin(x) + x^2 cos(x)"],
    ["x/(x+1)", "1/(x+1)^2"],
    ["sin(x^2)", "2x cos(x^2)"],
    ["e^(3x) cos(x)", "3e^(3x)cos(x) - e^(3x) sin(x)"],
    ["ln(x^2+1)", "2x/(x^2+1)"],
    ["x^x", "x^x (ln(x) + 1)"],
    ["sqrt(1 - x^2)", "-x/sqrt(1-x^2)"],
    ["tan(x)", "sec(x)^2"],
    ["atan(2x)", "2/(1+4x^2)"],
    ["asin(x)", "1/sqrt(1-x^2)"],
    ["2^x", "2^x ln(2)"],
    ["|x|", "x/|x|"],
    ["x^4", "12x^2", 2],
    ["sin(x)", "-cos(x)", 3],
    ["e^(2x)", "16 e^(2x)", 4],
  ];
  it.each(cases)("d/dx %s", async (expression, expected, order = 1) => {
    const r = await ok({ operation: "derivative", expression, order });
    sameFunction(r.answerText, expected);
    expect(r.sections.length).toBe(order);
    expect(r.sections[0].steps.length).toBeGreaterThan(0);
  });

  it("treats other letters as constants", async () => {
    const r = await ok({ operation: "derivative", expression: "a x^2" });
    expect(r.answerText.replace(/\s/g, "")).toBe("2*a*x");
  });

  it("supports other variables", async () => {
    const r = await ok({ operation: "derivative", expression: "t^3", variable: "t" });
    expect(r.answerText).toBe("3*t^2");
  });
});

describe("indefinite integrals", () => {
  const cases: [string, string][] = [
    ["3x^2 + 2x + 1", "x^3 + x^2 + x"],
    ["x e^x", "(x - 1) e^x"],
    ["x^2 sin(x)", "-x^2 cos(x) + 2x sin(x) + 2cos(x)"],
    ["ln(x)", "x ln(x) - x"],
    ["1/x", "ln(abs(x))"],
    ["x e^(x^2)", "e^(x^2)/2"],
    ["1/(1+x^2)", "atan(x)"],
    ["1/(x^2 - 1)", "ln(abs(x-1))/2 - ln(abs(x+1))/2"],
    ["sec(x)^2", "tan(x)"],
    ["e^x cos(x)", "e^x (sin(x) + cos(x))/2"],
    ["sqrt(x)", "2/3 x^(3/2)"],
    ["(2x+3)/(x^2+2x+5)", "ln(x^2+2x+5) + atan((x+1)/2)/2"],
    ["sin(x)^2", "x/2 - sin(2x)/4"],
    ["x^3/(x-1)", "x^3/3 + x^2/2 + x + ln(abs(x-1))"],
    ["cos(x)^3", "sin(x) - sin(x)^3/3"],
    ["abs(x)", "x abs(x)/2"],
  ];
  it.each(cases)("∫ %s dx", async (expression, expected) => {
    const r = await ok({ operation: "indefinite-integral", expression });
    expect(r.answerText.endsWith("+ C")).toBe(true);
    sameFunction(r.answerText, expected, true);
    expect(r.check?.status).toBe("verified");
  });

  it("reports non-elementary integrals honestly", async () => {
    for (const expression of ["e^(x^2)", "sin(x)/x"]) {
      const r = await solve({ operation: "indefinite-integral", expression, variable: "x" });
      expect(r.ok).toBe(false);
      if (!r.ok) expect(r.error).toMatch(/elementary/);
    }
  });
});

describe("definite integrals", () => {
  const cases: [string, string, string, number, boolean][] = [
    ["x^2", "0", "1", 1 / 3, true],
    ["sin(x)", "0", "pi", 2, true],
    ["ln(x)", "1", "e", 1, true],
    ["1/x^2", "1", "inf", 1, true],
    ["e^(-x)", "0", "inf", 1, true],
    ["1/sqrt(x)", "0", "1", 2, true],
    ["1/(1+x^2)", "-inf", "inf", Math.PI, true],
    ["e^(-x^2)", "-inf", "inf", Math.sqrt(Math.PI), false],
    ["sin(x)/x", "1", "2", 0.6593299064355118, false],
  ];
  it.each(cases)("∫ %s from %s to %s", async (expression, lower, upper, expected, exact) => {
    const r = await ok({ operation: "definite-integral", expression, lower, upper });
    const value = r.answerText.startsWith("≈") ? Number(r.answerText.slice(1)) : evaluate(parse(r.answerText).node);
    expect(Math.abs(value - expected)).toBeLessThan(1e-7 * Math.max(1, expected));
    if (exact) expect(r.answerLatex.startsWith("\\approx")).toBe(false);
  });

  it("detects divergence", async () => {
    const r = await ok({ operation: "definite-integral", expression: "1/x", lower: "1", upper: "inf" });
    expect(r.answerText).toBe("diverges");
  });
});

describe("limits", () => {
  const cases: [string, string, "both" | "left" | "right", number | "inf" | "-inf" | "dne"][] = [
    ["sin(x)/x", "0", "both", 1],
    ["(x^2-1)/(x-1)", "1", "both", 2],
    ["(1+1/x)^x", "inf", "both", Math.E],
    ["(1-cos(x))/x^2", "0", "both", 0.5],
    ["1/x", "0", "both", "dne"],
    ["1/x", "0", "right", "inf"],
    ["1/x", "0", "left", "-inf"],
    ["(3x^2+1)/(2x^2-x)", "inf", "both", 1.5],
    ["x ln(x)", "0", "right", 0],
    ["e^x/x^2", "inf", "both", "inf"],
    ["sqrt(x^2+x)-x", "inf", "both", 0.5],
    ["abs(x)/x", "0", "both", "dne"],
    ["x^x", "0", "right", 1],
    ["(2x^3)/(x^2+1)", "-inf", "both", "-inf"],
    ["atan(x)", "inf", "both", Math.PI / 2],
  ];
  it.each(cases)("lim %s as x → %s (%s)", async (expression, point, side, expected) => {
    const r = await ok({ operation: "limit", expression, point, side });
    if (expected === "dne") expect(r.answerText).toBe("does not exist");
    else if (expected === "inf") expect(r.answerText).toBe("infinity");
    else if (expected === "-inf") expect(r.answerText).toBe("-infinity");
    else sameNumber(r.answerText.replace(/^≈/, ""), expected);
  });

  it("is honest about oscillating limits", async () => {
    const r = await solve({ operation: "limit", expression: "sin(1/x)", point: "0", variable: "x" });
    expect(r.ok).toBe(false);
  });
});

describe("Taylor polynomials", () => {
  it.each([
    ["sin(x)", "0", 5, "x - x^3/6 + x^5/120"],
    ["e^x", "0", 4, "1 + x + x^2/2 + x^3/6 + x^4/24"],
    ["ln(x)", "1", 3, "(x-1) - (x-1)^2/2 + (x-1)^3/3"],
    ["1/(1-x)", "0", 3, "1 + x + x^2 + x^3"],
    ["cos(x)", "pi", 2, "-1 + (x-pi)^2/2"],
  ] as const)("T(%s) about %s, order %i", async (expression, point, order, expected) => {
    const r = await ok({ operation: "taylor", expression, point, order });
    sameFunction(r.answerText, expected);
  });

  it("rejects centers where the function is undefined", async () => {
    const r = await solve({ operation: "taylor", expression: "ln(x)", point: "0", order: 3, variable: "x" });
    expect(r.ok).toBe(false);
  });
});

describe("critical points", () => {
  it("finds and classifies cubic critical points exactly", async () => {
    const r = await ok({ operation: "critical-points", expression: "x^3 - 3x" });
    expect(r.table?.rows.map((row) => row[0])).toEqual(["-1", "1"]);
    expect(r.table?.rows.map((row) => row[3])).toEqual(["local maximum", "local minimum"]);
  });

  it("finds points where the derivative is undefined", async () => {
    const r = await ok({ operation: "critical-points", expression: "abs(x)" });
    expect(r.table?.rows[0][0]).toBe("0");
    expect(r.table?.rows[0][2]).toBe("f′(x) undefined");
    expect(r.table?.rows[0][3]).toBe("local minimum");
  });

  it("uses irrational exact roots when available", async () => {
    const r = await ok({ operation: "critical-points", expression: "x^3 - 6x" });
    expect(r.table?.rows.length).toBe(2);
    expect(r.answerLatex).toContain("\\sqrt{2}");
  });

  it("classifies flat points", async () => {
    const r = await ok({ operation: "critical-points", expression: "x^3" });
    expect(r.table?.rows[0][3]).toBe("neither (flat point)");
  });

  it("respects the search interval for periodic functions", async () => {
    const r = await ok({ operation: "critical-points", expression: "sin(x)", rangeMin: "0", rangeMax: "7" });
    expect(r.table?.rows.length).toBe(2);
  });
});

describe("input validation", () => {
  it.each([
    ["", /Enter an expression/],
    ["(x+1", /closing bracket/],
    ["x+1)", /extra closing/],
    ["x +", /ends with/],
    ["x */ 2", /followed by/],
    ["foo(x)", /Unknown function/],
    ["y = x^2", /not an equation/],
    ["x # 2", /Unexpected character/],
    ["sin^-1(x)", /ambiguous/],
  ])("rejects %j", async (expression, message) => {
    const r = await solve({ operation: "derivative", expression, variable: "x" });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error).toMatch(message);
  });

  it("requires numeric bounds", async () => {
    const r = await solve({ operation: "definite-integral", expression: "x", lower: "a", upper: "1", variable: "x" });
    expect(r.ok).toBe(false);
  });

  it("rejects other letters where a numeric answer is needed", async () => {
    const r = await solve({ operation: "limit", expression: "a x", point: "1", variable: "x" });
    expect(r.ok).toBe(false);
  });
});

describe("claims made in the site content", () => {
  it("reports ∫ from -1 to 1 of 1/x² as divergent instead of -2", async () => {
    const r = await ok({ operation: "definite-integral", expression: "1/x^2", lower: "-1", upper: "1" });
    expect(r.answerText).toBe("diverges");
  });

  it("does not apply L'Hôpital when the form is not indeterminate", async () => {
    const r = await ok({ operation: "limit", expression: "(x+1)/(x+2)", point: "0" });
    expect(r.answerText).toBe("1/2");
  });
});
