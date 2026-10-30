// Numerical methods: tanh-sinh quadrature, root finding, and recognition of
// decimal values as simple closed forms (used only to *suggest* exact values,
// which are then labelled as numerical estimates).

import { E, PI, fn, mul, num, numR, pow, type Node } from "./ast";
import { approximate } from "./rational";
import { simplify } from "./simplify";

export type RealFn = (x: number) => number;

// ---------- formatting ----------

export function formatNumber(x: number, digits = 10): string {
  if (Number.isNaN(x)) return "undefined";
  if (x === Infinity) return "∞";
  if (x === -Infinity) return "-∞";
  if (Math.abs(x) < 1e-12) return "0";
  const abs = Math.abs(x);
  if (abs >= 1e10 || abs < 1e-6) {
    const [m, e] = x.toExponential(digits - 1).split("e");
    return `${trimZeros(m)} × 10^${Number(e)}`;
  }
  return trimZeros(x.toPrecision(digits));
}

function trimZeros(s: string): string {
  return s.includes(".") ? s.replace(/0+$/, "").replace(/\.$/, "") : s;
}

// ---------- quadrature ----------

export interface QuadratureResult {
  value: number;
  ok: boolean;
  reason?: string;
}

/** Tanh-sinh (double exponential) quadrature on a finite interval. */
function tanhSinh(f: RealFn, a: number, b: number, tol = 1e-11): QuadratureResult {
  const half = (b - a) / 2;
  const mid = (a + b) / 2;
  let bad = false;
  const at = (x: number): number => {
    const y = f(x);
    if (Number.isNaN(y)) bad = true;
    return Number.isFinite(y) ? y : 0;
  };

  // Contribution of the node pair at parameter t (and the centre when t = 0).
  const pair = (t: number): number => {
    const u = (Math.PI / 2) * Math.sinh(t);
    const coshU = Math.cosh(u);
    const w = ((Math.PI / 2) * Math.cosh(t)) / (coshU * coshU);
    if (w === 0 || !Number.isFinite(w)) return 0;
    const complement = 1 / (Math.exp(u) * coshU); // 1 - tanh(u), computed without cancellation
    const offset = half * complement;
    if (t === 0) return w * at(mid);
    return w * (at(b - offset) + at(a + offset));
  };

  const tMax = 4;
  let h = 1;
  let sum = pair(0);
  for (let t = h; t <= tMax; t += h) sum += pair(t);
  let estimate = sum * h * half;
  let previous = NaN;
  for (let level = 1; level <= 11; level++) {
    h /= 2;
    for (let t = h; t <= tMax; t += 2 * h) sum += pair(t);
    previous = estimate;
    estimate = sum * h * half;
    if (bad) return { value: NaN, ok: false, reason: "The integrand is undefined somewhere on the interval." };
    if (level >= 3 && Math.abs(estimate - previous) <= tol * Math.max(1, Math.abs(estimate))) {
      return { value: estimate, ok: true };
    }
  }
  const converged = Math.abs(estimate - previous) <= 1e-6 * Math.max(1, Math.abs(estimate));
  return converged
    ? { value: estimate, ok: true }
    : { value: estimate, ok: false, reason: "The numerical integration did not converge; the integral may diverge." };
}

export function integrateNumeric(f: RealFn, a: number, b: number): QuadratureResult {
  if (a === b) return { value: 0, ok: true };
  if (a > b) {
    const r = integrateNumeric(f, b, a);
    return { ...r, value: -r.value };
  }
  let result: QuadratureResult;
  if (Number.isFinite(a) && Number.isFinite(b)) {
    result = tanhSinh(f, a, b);
  } else if (Number.isFinite(a)) {
    result = tanhSinh((t) => (t >= 1 ? 0 : f(a + t / (1 - t)) / ((1 - t) * (1 - t))), 0, 1);
  } else if (Number.isFinite(b)) {
    result = tanhSinh((t) => (t >= 1 ? 0 : f(b - t / (1 - t)) / ((1 - t) * (1 - t))), 0, 1);
  } else {
    const left = integrateNumeric(f, -Infinity, 0);
    const right = integrateNumeric(f, 0, Infinity);
    result = { value: left.value + right.value, ok: left.ok && right.ok, reason: left.reason ?? right.reason };
  }
  if (result.ok && Math.abs(result.value) > 1e12) {
    return { value: result.value, ok: false, reason: "The integral appears to diverge." };
  }
  return result;
}

/** Looks for points in (a, b) where f blows up or is undefined. */
export function findSingularity(f: RealFn, a: number, b: number, samples = 2000): number | null {
  const lo = Number.isFinite(a) ? a : -1e3;
  const hi = Number.isFinite(b) ? b : 1e3;
  let prev = Math.abs(f(lo + (hi - lo) / samples));
  for (let i = 1; i < samples; i++) {
    const x = lo + ((hi - lo) * i) / samples;
    const y = f(x);
    if (!Number.isFinite(y)) return x;
    const ay = Math.abs(y);
    if (ay > 1e7 && ay > 50 * prev) return x;
    prev = ay;
  }
  return null;
}

// ---------- roots ----------

function bisect(g: RealFn, lo: number, hi: number): number {
  let glo = g(lo);
  for (let i = 0; i < 200 && hi - lo > 1e-14 * Math.max(1, Math.abs(lo)); i++) {
    const mid = (lo + hi) / 2;
    const gm = g(mid);
    if (gm === 0) return mid;
    if (Math.sign(gm) === Math.sign(glo)) {
      lo = mid;
      glo = gm;
    } else hi = mid;
  }
  return (lo + hi) / 2;
}

/** Finds real roots of g in [a, b] by sampling and refinement (sign changes and touch points). */
export function findRoots(g: RealFn, a: number, b: number, samples = 4000): number[] {
  const roots: number[] = [];
  const xs: number[] = [];
  const ys: number[] = [];
  for (let i = 0; i <= samples; i++) {
    const x = a + ((b - a) * i) / samples;
    xs.push(x);
    ys.push(g(x));
  }
  const scale = ys.reduce((m, y) => (Number.isFinite(y) ? Math.max(m, Math.min(Math.abs(y), 1e6)) : m), 1);
  const push = (r: number) => {
    if (r < a - 1e-12 || r > b + 1e-12) return;
    if (!roots.some((x) => Math.abs(x - r) < 1e-7 * Math.max(1, Math.abs(r)))) roots.push(r);
  };
  for (let i = 0; i <= samples; i++) {
    const y = ys[i];
    if (!Number.isFinite(y)) continue;
    if (y === 0) {
      push(xs[i]);
      continue;
    }
    if (i < samples && Number.isFinite(ys[i + 1]) && Math.sign(y) !== Math.sign(ys[i + 1]) && ys[i + 1] !== 0) {
      const r = bisect(g, xs[i], xs[i + 1]);
      // Reject sign changes caused by a pole rather than a root.
      if (Math.abs(g(r)) < 1e-6 * Math.max(1, scale)) push(r);
    }
    // Touch points (even multiplicity): local minimum of |g| close to zero.
    if (i > 0 && i < samples && Number.isFinite(ys[i - 1]) && Number.isFinite(ys[i + 1])) {
      const ay = Math.abs(y);
      if (ay <= Math.abs(ys[i - 1]) && ay <= Math.abs(ys[i + 1]) && Math.sign(ys[i - 1]) === Math.sign(ys[i + 1])) {
        const r = goldenMin((x) => Math.abs(g(x)), xs[i - 1], xs[i + 1]);
        if (Math.abs(g(r)) < 1e-10) push(r);
      }
    }
  }
  return roots.sort((p, q) => p - q);
}

function goldenMin(f: RealFn, a: number, b: number): number {
  const phi = (Math.sqrt(5) - 1) / 2;
  let c = b - phi * (b - a);
  let d = a + phi * (b - a);
  for (let i = 0; i < 100; i++) {
    if (f(c) < f(d)) b = d;
    else a = c;
    c = b - phi * (b - a);
    d = a + phi * (b - a);
  }
  return (a + b) / 2;
}

// ---------- recognition ----------

/**
 * Tries to express x as a simple closed form: p/q, (p/q)·π, (p/q)·e, (p/q)·√k, ln(k), (p/q)·ln 2.
 * Returns null if nothing simple matches within tolerance.
 */
export function recognize(x: number, tol = 1e-9): Node | null {
  if (!Number.isFinite(x)) return null;
  if (Math.abs(x) < tol) return num(0);
  const tryScale = (scale: number, make: (c: Node) => Node, maxDen = 60): Node | null => {
    const r = approximate(x / scale, maxDen, tol);
    if (!r || Math.abs(r.n) > 10000) return null;
    return simplify(make(numR(r)));
  };
  // Small denominators and named constants first, so π/2 is not mistaken for 355/226.
  return (
    tryScale(1, (c) => c, 16) ??
    tryScale(Math.PI, (c) => mul(c, PI)) ??
    tryScale(Math.E, (c) => mul(c, E)) ??
    [2, 3, 5, 6, 7].map((k) => tryScale(Math.sqrt(k), (c) => mul(c, pow(num(k), num(1, 2))), 24)).find(Boolean) ??
    tryScale(Math.LN2, (c) => mul(c, fn("ln", num(2))), 12) ??
    [3, 5, 10].map((k) => tryScale(Math.log(k), (c) => mul(c, fn("ln", num(k))), 6)).find(Boolean) ??
    tryScale(Math.PI * Math.PI, (c) => mul(c, pow(PI, num(2))), 24) ??
    tryScale(Math.sqrt(Math.PI), (c) => mul(c, pow(PI, num(1, 2))), 12) ??
    (tol <= 1e-9 ? tryScale(1, (c) => c, 1000) : null)
  );
}

/** Sample points that avoid integers and common special values. */
export const SAMPLE_POINTS = [-2.73, -1.61, -0.83, -0.37, 0.29, 0.71, 1.37, 2.19, 3.07, 4.41];
