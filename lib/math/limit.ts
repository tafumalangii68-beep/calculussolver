// Limits: symbolic where possible (direct substitution, factor-and-cancel,
// L'Hôpital's rule, degree comparison, logarithm rewrite for 1^∞-type forms),
// always cross-checked against a numerical estimate from the requested side(s).

import type { LimitSide, Step } from "@/types/solver";
import { E, contains, fn, isNum, mul, num, pow, substitute, sym, type Node } from "./ast";
import { differentiate } from "./derivative";
import { MathError } from "./errors";
import { evalAt, evaluate } from "./evaluate";
import { recognize } from "./numeric";
import type { PointValue } from "./parser";
import * as P from "./polynomial";
import { toLatex, toText } from "./print";
import * as R from "./rational";
import { simplify, simplifyMul, substituteExact } from "./simplify";

export type LimitValue =
  | { kind: "finite"; exact: Node | null; approx: number }
  | { kind: "inf"; sign: 1 | -1 }
  | { kind: "dne"; reason: string }
  | { kind: "unknown"; reason: string };

export interface LimitOutcome {
  value: LimitValue;
  steps: Step[];
  method: "symbolic" | "numeric";
  notes: string[];
}

// ---------- numerical probing ----------

type Probe =
  | { kind: "finite"; value: number; error: number }
  | { kind: "inf"; sign: 1 | -1 }
  | { kind: "undefined" }
  | { kind: "unknown" };

function probe(f: Node, v: string, point: PointValue, side: "left" | "right"): Probe {
  const xs: number[] = [];
  for (let k = 2; k <= 16; k++) {
    const h = 10 ** (-k / 2);
    if (point.kind === "inf") xs.push(point.sign / h);
    else {
      const a = evaluate(point.node);
      xs.push(side === "right" ? a + h * Math.max(1, Math.abs(a)) : a - h * Math.max(1, Math.abs(a)));
    }
  }
  const ys = xs.map((x) => evalAt(f, v, x));
  const finite = ys.filter((y) => !Number.isNaN(y));
  if (finite.length === 0) return { kind: "undefined" };
  const tail = ys.slice(-8);
  if (tail.every((y) => !Number.isNaN(y))) {
    const mags = tail.map(Math.abs);
    const growing = mags.every((m, i) => i === 0 || m >= mags[i - 1] * 0.999);
    if ((growing && mags[mags.length - 1] > 1e6 && mags[mags.length - 1] > 100 * mags[0]) || tail.some((y) => !Number.isFinite(y))) {
      const last = tail.filter((y) => !Number.isNaN(y)).pop()!;
      const signs = new Set(tail.slice(-4).map(Math.sign));
      if (signs.size === 1) return { kind: "inf", sign: last > 0 ? 1 : -1 };
    }
  }
  const finiteYs = ys.filter(Number.isFinite);
  const mags = finiteYs.map(Math.abs);
  // Slow but steady growth, e.g. ln(x): magnitudes increase and the increments do not die out.
  if (mags.length === ys.length && new Set(finiteYs.slice(-6).map(Math.sign)).size === 1) {
    const diffs = mags.slice(1).map((m, i) => m - mags[i]);
    if (diffs.every((d) => d > 0) && diffs[diffs.length - 1] >= 0.3 * diffs[0] && mags[mags.length - 1] > 10) {
      return { kind: "inf", sign: finiteYs[finiteYs.length - 1] > 0 ? 1 : -1 };
    }
  }
  // Values shrinking geometrically towards zero (e.g. sin(h), h·ln h, √h).
  if (mags.length >= 6) {
    const last = mags[mags.length - 1];
    const monotone = mags.every((m, i) => i === 0 || m <= mags[i - 1] * 1.0001);
    const ratios = [1, 2, 3].map((j) => mags[mags.length - j] / mags[mags.length - j - 1]);
    if (monotone && last < 1e-3 && last / mags[0] < 1e-2 && ratios.every((r) => r < 0.95)) {
      return { kind: "finite", value: 0, error: last };
    }
  }
  // Pick the most stable consecutive pair (protects against round-off for tiny h).
  let best: { value: number; error: number } | null = null;
  for (let i = 0; i + 1 < ys.length; i++) {
    const a = ys[i];
    const b = ys[i + 1];
    if (!Number.isFinite(a) || !Number.isFinite(b)) continue;
    const err = Math.abs(b - a);
    if (!best || err < best.error) best = { value: b, error: err };
  }
  if (best && best.error <= 1e-4 * Math.max(1, Math.abs(best.value))) {
    return { kind: "finite", value: Math.abs(best.value) < 1e-12 ? 0 : best.value, error: best.error };
  }
  return { kind: "unknown" };
}

function sameProbe(a: Probe, b: Probe): boolean {
  if (a.kind === "finite" && b.kind === "finite") {
    return Math.abs(a.value - b.value) <= 1e-4 * Math.max(1, Math.abs(a.value)) + a.error + b.error;
  }
  if (a.kind === "inf" && b.kind === "inf") return a.sign === b.sign;
  return false;
}

// ---------- symbolic engine ----------

type Exact = { kind: "finite"; node: Node } | { kind: "inf"; sign: 1 | -1 };

function split(f: Node): { N: Node; D: Node } {
  const factors = f.k === "mul" ? f.factors : [f];
  const top: Node[] = [];
  const bottom: Node[] = [];
  for (const factor of factors) {
    if (factor.k === "pow" && factor.exp.k === "num" && factor.exp.v.n < 0) {
      bottom.push(simplify(pow(factor.base, num(-factor.exp.v.n, factor.exp.v.d))));
    } else top.push(factor);
  }
  return { N: simplifyMul(top), D: simplifyMul(bottom) };
}

class LimitSolver {
  steps: Step[] = [];

  constructor(private v: string, private point: PointValue, private side: LimitSide) {}

  private get pointTex(): string {
    if (this.point.kind === "inf") return this.point.sign > 0 ? "\\infty" : "-\\infty";
    const base = toLatex(this.point.node);
    return this.side === "left" ? `${base}^{-}` : this.side === "right" ? `${base}^{+}` : base;
  }

  prefix(): string {
    const x = this.v === "θ" ? "\\theta" : this.v;
    return `\\lim_{${x} \\to ${this.pointTex}}`;
  }

  lim(f: Node): string {
    return `${this.prefix()} ${f.k === "add" ? `\\left(${toLatex(f)}\\right)` : toLatex(f)}`;
  }

  private step(rule: string, latex: string, note?: string, depth = 0): void {
    this.steps.push({ rule, latex, note, depth });
  }

  private numericSide(f: Node): Probe {
    if (this.point.kind === "inf") return probe(f, this.v, this.point, "right");
    if (this.side === "both") {
      const l = probe(f, this.v, this.point, "left");
      const r = probe(f, this.v, this.point, "right");
      if (l.kind === "undefined") return r;
      if (r.kind === "undefined") return l;
      return sameProbe(l, r) ? r : { kind: "unknown" };
    }
    return probe(f, this.v, this.point, this.side);
  }

  solve(f: Node, depth = 0): Exact | null {
    if (depth > 6) return null;
    const v = this.v;
    if (!contains(f, v)) {
      this.step("Constant", `${this.lim(f)} = ${toLatex(f)}`, "The expression does not depend on the variable.", depth);
      return { kind: "finite", node: f };
    }

    if (this.point.kind === "finite") {
      try {
        const value = substituteExact(f, v, this.point.node);
        if (!contains(value, v) && Number.isFinite(evaluate(value))) {
          const numeric = this.numericSide(f);
          if (numeric.kind === "finite" && Math.abs(numeric.value - evaluate(value)) <= 1e-5 * Math.max(1, Math.abs(numeric.value))) {
            this.step(
              "Direct substitution",
              `${this.lim(f)} = ${toLatex(value)}`,
              "The function is continuous here, so substitute the value directly.",
              depth,
            );
            return { kind: "finite", node: value };
          }
        }
      } catch (err) {
        if (!(err instanceof MathError)) throw err;
      }
    }

    // At ±∞, substitute x = ±1/t and let t → 0⁺; this settles limits like 1/(1 + 1/x).
    if (this.point.kind === "inf") {
      try {
        const t = "τ";
        const inT = simplify(substitute(f, v, mul(num(this.point.sign), pow(sym(t), num(-1)))));
        const value = substituteExact(inT, t, num(0));
        const numeric = this.numericSide(f);
        if (!contains(value, t) && Number.isFinite(evaluate(value)) && numeric.kind === "finite" &&
          Math.abs(numeric.value - evaluate(value)) <= 1e-5 * Math.max(1, Math.abs(numeric.value))) {
          this.step("Limit laws", `${this.lim(f)} = ${toLatex(value)}`, "Every term that contains 1/x tends to 0, and the rest is continuous.", depth);
          return { kind: "finite", node: value };
        }
      } catch (err) {
        if (!(err instanceof MathError)) throw err;
      }
    }

    // Exponential forms such as 1^∞: rewrite u^w as e^(w ln u).
    if (f.k === "pow" && contains(f.base, v) && contains(f.exp, v)) {
      const inner = simplify(mul(f.exp, fn("ln", f.base)));
      this.step("Rewrite with logarithms", `${this.lim(f)} = e^{${this.lim(inner)}}`, "Since u^w = e^{w ln u}, find the limit of the exponent first.", depth);
      const r = this.solve(inner, depth + 1);
      if (!r) return null;
      if (r.kind === "inf") return r.sign > 0 ? { kind: "inf", sign: 1 } : { kind: "finite", node: num(0) };
      const result = simplify(pow(E, r.node));
      this.step("Exponentiate", `${this.lim(f)} = ${toLatex(result)}`, undefined, depth);
      return { kind: "finite", node: result };
    }

    const { N, D } = split(f);
    const hasDen = contains(D, v);

    // Rational functions.
    const pn = P.toPoly(N, v, 20);
    const pd = P.toPoly(D, v, 20);
    if (pn && pd && hasDen) {
      if (this.point.kind === "inf") return this.degreeRule(f, pn, pd, depth);
      const g = P.polyGcd(pn, pd);
      if (P.degree(g) >= 1) {
        const n2 = P.polyDivMod(pn, g).q;
        const d2 = P.polyDivMod(pd, g).q;
        const reduced = simplify(mul(P.fromPoly(n2, v), pow(P.fromPoly(d2, v), num(-1))));
        this.step(
          "Factor and cancel",
          `${this.lim(f)} = ${this.lim(reduced)}`,
          `Numerator and denominator share the factor ${toLatex(P.fromPoly(g, v))}, which can be cancelled because x ≠ a inside the limit.`,
          depth,
        );
        return this.solve(reduced, depth + 1);
      }
    }

    // Product of a vanishing and an unbounded factor (0·∞): rewrite as a quotient.
    if (!hasDen && f.k === "mul") {
      const varying = f.factors.filter((x) => contains(x, v));
      if (varying.length === 2) {
        const [a, b] = varying;
        const pa = this.numericSide(a);
        const pb = this.numericSide(b);
        const zeroA = pa.kind === "finite" && Math.abs(pa.value) < 1e-9;
        const zeroB = pb.kind === "finite" && Math.abs(pb.value) < 1e-9;
        if ((zeroA && pb.kind === "inf") || (zeroB && pa.kind === "inf")) {
          const [small, big] = zeroA ? [a, b] : [b, a];
          const constants = f.factors.filter((x) => !contains(x, v));
          // Keep a logarithm or inverse trig factor in the numerator: it differentiates nicely.
          const [top, bottomOf] = isLogLike(big) ? [big, small] : [small, big];
          const numer = simplifyMul([...constants, top]);
          const denom = simplify(pow(bottomOf, num(-1)));
          this.step(
            "Rewrite 0·∞ as a quotient",
            `${this.lim(f)} = ${this.prefix()} \\frac{${toLatex(numer)}}{${toLatex(denom)}}`,
            "A product of the form 0·∞ is rewritten as a quotient so L'Hôpital's rule applies.",
            depth,
          );
          return this.lhopital(numer, denom, depth + 1);
        }
      }
    }

    if (hasDen) {
      const pN = this.numericSide(N);
      const pD = this.numericSide(D);
      const zero = (p: Probe) => p.kind === "finite" && Math.abs(p.value) < 1e-9;
      if ((zero(pN) && zero(pD)) || (pN.kind === "inf" && pD.kind === "inf")) {
        return this.lhopital(N, D, depth);
      }
      if (pD.kind === "inf" && pN.kind === "finite") {
        this.step("Bounded over unbounded", `${this.lim(f)} = 0`, "The numerator approaches a finite value while the denominator grows without bound.", depth);
        return { kind: "finite", node: num(0) };
      }
    }
    const overall = this.numericSide(f);
    if (depth > 0 && overall.kind === "inf") {
      this.step("Unbounded growth", `${this.lim(f)} = ${overall.sign > 0 ? "\\infty" : "-\\infty"}`, "The remaining expression grows without bound.", depth);
      return overall;
    }
    return null;
  }

  private lhopital(N: Node, D: Node, depth: number): Exact | null {
    const dN = differentiate(N, this.v);
    const dD = differentiate(D, this.v);
    if (isNum(dD, 0)) return null;
    const next = simplify(mul(dN, pow(dD, num(-1))));
    this.step(
      "L'Hôpital's rule",
      `${this.prefix()} \\frac{${toLatex(N)}}{${toLatex(D)}} = ${this.prefix()} \\frac{${toLatex(dN)}}{${toLatex(dD)}} = ${this.lim(next)}`,
      "The limit has an indeterminate form (0/0 or ∞/∞), so differentiate the numerator and denominator separately.",
      depth,
    );
    return this.solve(next, depth + 1);
  }

  private degreeRule(f: Node, pn: P.Poly, pd: P.Poly, depth: number): Exact {
    const sign = this.point.kind === "inf" ? this.point.sign : 1;
    const dn = P.degree(pn);
    const dd = P.degree(pd);
    const ln = pn[pn.length - 1];
    const ld = pd[pd.length - 1];
    const x = this.v;
    let result: Exact;
    let note: string;
    if (dn < dd) {
      result = { kind: "finite", node: num(0) };
      note = `The denominator has the higher degree (${dd} > ${dn}), so the fraction tends to 0.`;
    } else if (dn === dd) {
      result = { kind: "finite", node: simplify({ k: "num", v: R.div(ln, ld) }) };
      note = `Equal degrees (${dn}): the limit is the ratio of leading coefficients.`;
    } else {
      const s = Math.sign(R.toNumber(ln) / R.toNumber(ld)) * (sign < 0 && (dn - dd) % 2 === 1 ? -1 : 1);
      result = { kind: "inf", sign: s > 0 ? 1 : -1 };
      note = `The numerator has the higher degree (${dn} > ${dd}), so the fraction grows without bound.`;
    }
    const valueTex = result.kind === "finite" ? toLatex(result.node) : result.sign > 0 ? "\\infty" : "-\\infty";
    this.step("Compare degrees", `${this.lim(f)} = ${valueTex}`, `${note} (Divide numerator and denominator by ${x}^${dd}.)`, depth);
    return result;
  }
}

function isLogLike(n: Node): boolean {
  switch (n.k) {
    case "fn":
      return ["ln", "asin", "acos", "atan"].includes(n.name) || isLogLike(n.arg);
    case "mul":
      return n.factors.some(isLogLike);
    case "pow":
      return isLogLike(n.base);
    default:
      return false;
  }
}

// ---------- public API ----------

export function computeLimit(f: Node, v: string, point: PointValue, side: LimitSide): LimitOutcome {
  const g = simplify(f);
  const notes: string[] = [];
  const solver = new LimitSolver(v, point, side);

  // Numerical behaviour from each requested side.
  let numeric: Probe;
  if (point.kind === "inf") {
    numeric = probe(g, v, point, "right");
  } else if (side === "both") {
    const left = probe(g, v, point, "left");
    const right = probe(g, v, point, "right");
    if (left.kind === "undefined" && right.kind !== "undefined") {
      notes.push("The function is not defined to the left of this point, so the limit from the right (the only side in the domain) is reported.");
      numeric = right;
    } else if (right.kind === "undefined" && left.kind !== "undefined") {
      notes.push("The function is not defined to the right of this point, so the limit from the left (the only side in the domain) is reported.");
      numeric = left;
    } else if (left.kind !== "unknown" && right.kind !== "unknown" && left.kind !== "undefined" && !sameProbe(left, right)) {
      const describe = (p: Probe) =>
        p.kind === "finite" ? `${+p.value.toPrecision(8)}` : p.kind === "inf" ? (p.sign > 0 ? "+∞" : "−∞") : "no value";
      const reason = `The left-hand limit (${describe(left)}) and the right-hand limit (${describe(right)}) are different.`;
      return {
        value: { kind: "dne", reason },
        steps: [{ rule: "Compare one-sided limits", latex: oneSidedTex(g, v, point, left, right), note: reason, depth: 0 }],
        method: "numeric",
        notes,
      };
    } else {
      numeric = right.kind === "finite" || right.kind === "inf" ? right : left;
      if (left.kind === "unknown" || right.kind === "unknown") numeric = { kind: "unknown" };
    }
  } else {
    numeric = probe(g, v, point, side);
  }

  let exact: Exact | null = null;
  try {
    exact = solver.solve(g);
  } catch (err) {
    if (!(err instanceof MathError)) throw err;
  }

  if (exact) {
    const agrees =
      numeric.kind === "unknown" ||
      (exact.kind === "inf" && numeric.kind === "inf" && numeric.sign === exact.sign) ||
      (exact.kind === "finite" && numeric.kind === "finite" &&
        Math.abs(evaluate(exact.node) - numeric.value) <= 1e-4 * Math.max(1, Math.abs(numeric.value)) + 10 * numeric.error);
    if (agrees) {
      if (numeric.kind === "unknown") notes.push("The numerical check was inconclusive, so this result relies on the symbolic steps alone.");
      const value: LimitValue =
        exact.kind === "inf" ? exact : { kind: "finite", exact: exact.node, approx: evaluate(exact.node) };
      return { value, steps: solver.steps, method: "symbolic", notes };
    }
  }

  // Numerical fallback.
  const steps: Step[] = [];
  if (numeric.kind === "finite") {
    const recognized = recognize(numeric.value, Math.max(1e-9, 20 * numeric.error));
    steps.push({
      rule: "Numerical evaluation",
      latex: `${solver.lim(g)} \\approx ${+numeric.value.toPrecision(10)}`,
      note: "Evaluated the function closer and closer to the point and watched the values settle.",
      depth: 0,
    });
    if (recognized) notes.push(`The numerical value matches ${toText(recognized)} to the precision checked. Treat this as a strong estimate, not a proof.`);
    return { value: { kind: "finite", exact: recognized, approx: numeric.value }, steps, method: "numeric", notes };
  }
  if (numeric.kind === "inf") {
    steps.push({
      rule: "Numerical evaluation",
      latex: `${solver.lim(g)} = ${numeric.sign > 0 ? "\\infty" : "-\\infty"}`,
      note: "The values grow without bound as the variable approaches the point.",
      depth: 0,
    });
    return { value: numeric, steps, method: "numeric", notes };
  }
  if (numeric.kind === "undefined") {
    return { value: { kind: "dne", reason: "The function is not defined near this point." }, steps, method: "numeric", notes };
  }
  return {
    value: {
      kind: "unknown",
      reason: "The values do not settle on a single number (the function may oscillate), and no symbolic method applied.",
    },
    steps,
    method: "numeric",
    notes,
  };
}

function oneSidedTex(f: Node, v: string, point: PointValue, left: Probe, right: Probe): string {
  if (point.kind === "inf") return "";
  const a = toLatex(point.node);
  const x = v === "θ" ? "\\theta" : v;
  const show = (p: Probe) => (p.kind === "finite" ? `${+p.value.toPrecision(8)}` : p.kind === "inf" ? (p.sign > 0 ? "\\infty" : "-\\infty") : "\\text{undefined}");
  return `\\lim_{${x} \\to ${a}^{-}} ${toLatex(f)} = ${show(left)}, \\quad \\lim_{${x} \\to ${a}^{+}} ${toLatex(f)} = ${show(right)}`;
}

/** Limit as a plain number (or ±Infinity / NaN), used by the definite-integral solver. */
export function limitNumber(f: Node, v: string, sign: 1 | -1): number {
  const out = computeLimit(f, v, { kind: "inf", sign }, "both");
  if (out.value.kind === "finite") return out.value.approx;
  if (out.value.kind === "inf") return out.value.sign * Infinity;
  return NaN;
}

export function limitExact(f: Node, v: string, sign: 1 | -1): Node | null {
  const out = computeLimit(f, v, { kind: "inf", sign }, "both");
  // Numerically recognised values are acceptable here: the definite-integral solver
  // cross-checks the final answer against numerical integration.
  return out.value.kind === "finite" ? out.value.exact : null;
}

