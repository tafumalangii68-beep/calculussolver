// Critical points of f on an interval: where f'(x) = 0 or f'(x) is undefined
// (while f itself is defined). Exact roots come from polynomial factors;
// everything else is found numerically and labelled as approximate.

import type { ResultTable } from "@/types/solver";
import { contains, numR, pow, type Node } from "./ast";
import { evalAt, evaluate } from "./evaluate";
import { MathError } from "./errors";
import { findRoots, formatNumber, recognize } from "./numeric";
import * as P from "./polynomial";
import { toLatex } from "./print";
import { simplify, simplifyMul, substituteExact } from "./simplify";

export type PointType = "local minimum" | "local maximum" | "neither (flat point)" | "endpoint behaviour unclear";

export interface CriticalPoint {
  x: number;
  exact: Node | null;
  reason: "f′(x) = 0" | "f′(x) undefined";
  type: PointType;
  test: string;
  fValue: string;
}

export interface CriticalOutcome {
  points: CriticalPoint[];
  table: ResultTable;
}

function factorsOf(n: Node): Node[] {
  return n.k === "mul" ? n.factors : [n];
}

/** Exact real zeros of a canonical expression's polynomial (and |u|) factors. */
function exactZeros(n: Node, v: string): Node[] {
  const out: Node[] = [];
  for (const f of factorsOf(n)) {
    let base = f;
    if (f.k === "pow" && f.exp.k === "num" && f.exp.v.n > 0) base = f.base;
    if (base.k === "fn" && base.name === "abs") base = base.arg;
    if (!contains(base, v)) continue;
    const p = P.toPoly(base, v, 12);
    if (!p) continue;
    out.push(...P.exactRealRoots(p).exact);
  }
  return out;
}

function splitFraction(n: Node): { top: Node; bottom: Node } {
  const top: Node[] = [];
  const bottom: Node[] = [];
  for (const f of factorsOf(n)) {
    if (f.k === "pow" && f.exp.k === "num" && f.exp.v.n < 0) {
      bottom.push(simplify(pow(f.base, numR({ n: -f.exp.v.n, d: f.exp.v.d }))));
    } else if (f.k === "fn" && f.name === "abs") {
      // |u| in a derivative usually comes from u/|u|; treat zeros of u as "undefined" points.
      bottom.push(f);
      top.push(f);
    } else top.push(f);
  }
  return { top: simplifyMul(top), bottom: simplifyMul(bottom) };
}

export function findCriticalPoints(f: Node, f1: Node, f2: Node, v: string, lo: number, hi: number): CriticalOutcome {
  if (!(lo < hi)) throw new MathError("The search interval must have its minimum below its maximum.");
  if (hi - lo > 1e4) throw new MathError("The search interval is too wide (maximum width 10000).");

  const { top, bottom } = splitFraction(f1);
  const candidates: { x: number; exact: Node | null; reason: CriticalPoint["reason"] }[] = [];
  const add = (x: number, exact: Node | null, reason: CriticalPoint["reason"]) => {
    if (!Number.isFinite(x) || x < lo - 1e-12 || x > hi + 1e-12) return;
    if (!Number.isFinite(evalAt(f, v, x))) return;
    const existing = candidates.find((c) => Math.abs(c.x - x) < 1e-7 * Math.max(1, Math.abs(x)));
    if (existing) {
      if (!existing.exact && exact) existing.exact = exact;
      return;
    }
    candidates.push({ x, exact, reason });
  };

  for (const z of exactZeros(top, v)) {
    const x = evaluate(z);
    const d = evalAt(f1, v, x);
    if (Number.isFinite(d) && Math.abs(d) < 1e-9) add(x, z, "f′(x) = 0");
  }
  for (const z of exactZeros(bottom, v)) {
    const x = evaluate(z);
    if (!Number.isFinite(evalAt(f1, v, x))) add(x, z, "f′(x) undefined");
  }
  for (const x of findRoots((t) => evalAt(f1, v, t), lo, hi)) {
    const guess = recognize(x, 1e-9);
    add(x, guess && Math.abs(evaluate(guess) - x) < 1e-9 ? guess : null, "f′(x) = 0");
  }
  candidates.sort((a, b) => a.x - b.x);
  if (candidates.length > 40) {
    throw new MathError("There are too many critical points in this interval to list.", "Narrow the search interval.");
  }

  const points: CriticalPoint[] = candidates.map((c) => {
    let second: number;
    let secondExact: Node | null = null;
    try {
      secondExact = c.exact ? substituteExact(f2, v, c.exact) : null;
      second = secondExact ? evaluate(secondExact) : evalAt(f2, v, c.x);
    } catch {
      second = NaN;
    }
    let type: PointType;
    let test: string;
    if (c.reason === "f′(x) = 0" && Number.isFinite(second) && Math.abs(second) > 1e-8) {
      type = second > 0 ? "local minimum" : "local maximum";
      test = `Second derivative test: f″(x) ≈ ${formatNumber(second, 6)} ${second > 0 ? "> 0" : "< 0"}`;
    } else {
      const delta = 1e-4 * Math.max(1, Math.abs(c.x));
      const left = evalAt(f1, v, c.x - delta);
      const right = evalAt(f1, v, c.x + delta);
      const s = (y: number) => (y > 0 ? "+" : y < 0 ? "−" : "0");
      if (left < 0 && right > 0) type = "local minimum";
      else if (left > 0 && right < 0) type = "local maximum";
      else if (Number.isFinite(left) && Number.isFinite(right)) type = "neither (flat point)";
      else type = "endpoint behaviour unclear";
      test = `First derivative test: f′ changes sign ${s(left)} to ${s(right)}`;
    }
    let fValue: string;
    try {
      fValue = c.exact ? toLatex(substituteExact(f, v, c.exact)) : `\\approx ${formatNumber(evalAt(f, v, c.x), 8)}`;
    } catch {
      fValue = `\\approx ${formatNumber(evalAt(f, v, c.x), 8)}`;
    }
    return { x: c.x, exact: c.exact, reason: c.reason, type, test, fValue };
  });

  const name = v === "θ" ? "\\theta" : v;
  return {
    points,
    table: {
      caption: `Critical points on [${formatNumber(lo)}, ${formatNumber(hi)}]`,
      headers: [name, `f(${name})`, "Reason", "Classification", "Test used"],
      rows: points.map((p) => [
        p.exact ? toLatex(p.exact) + (p.exact.k === "num" ? "" : ` \\approx ${formatNumber(p.x, 8)}`) : `\\approx ${formatNumber(p.x, 10)}`,
        p.fValue,
        p.reason,
        p.type,
        p.test,
      ]),
      textColumns: [2, 3, 4],
    },
  };
}

