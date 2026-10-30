// Exact rational arithmetic on safe JavaScript integers.
// Anything that would overflow throws a MathError so we never silently lose precision.

import { MathError } from "./errors";

export interface Rational {
  n: number;
  d: number;
}

function gcd(a: number, b: number): number {
  a = Math.abs(a);
  b = Math.abs(b);
  while (b) [a, b] = [b, a % b];
  return a;
}

function checkSafe(...values: number[]): void {
  for (const v of values) {
    if (!Number.isSafeInteger(v)) {
      throw new MathError("A number in this problem became too large to handle exactly.");
    }
  }
}

export function rat(n: number, d = 1): Rational {
  checkSafe(n, d);
  if (d === 0) throw new MathError("Division by zero.");
  if (d < 0) {
    n = -n;
    d = -d;
  }
  const g = gcd(n, d) || 1;
  return { n: n / g, d: d / g };
}

/** Converts a finite decimal string such as "0.125" into an exact rational. */
export function ratFromDecimal(text: string): Rational {
  const [whole, frac = ""] = text.split(".");
  if (frac.length > 12) throw new MathError(`The number ${text} has too many decimal places.`);
  const d = 10 ** frac.length;
  const n = Number((whole || "0") + frac);
  return rat(n, d);
}

export const add = (a: Rational, b: Rational): Rational => rat(a.n * b.d + b.n * a.d, a.d * b.d);
export const sub = (a: Rational, b: Rational): Rational => rat(a.n * b.d - b.n * a.d, a.d * b.d);
export const mul = (a: Rational, b: Rational): Rational => rat(a.n * b.n, a.d * b.d);
export const div = (a: Rational, b: Rational): Rational => rat(a.n * b.d, a.d * b.n);
export const neg = (a: Rational): Rational => ({ n: -a.n, d: a.d });
export const eq = (a: Rational, b: Rational): boolean => a.n === b.n && a.d === b.d;
export const isInt = (a: Rational): boolean => a.d === 1;
export const toNumber = (a: Rational): number => a.n / a.d;
export const cmp = (a: Rational, b: Rational): number => a.n * b.d - b.n * a.d;

/** Integer power of a rational. Throws on overflow. */
export function powInt(a: Rational, k: number): Rational {
  if (k === 0) return rat(1);
  if (k < 0) {
    if (a.n === 0) throw new MathError("Division by zero.");
    return powInt(rat(a.d, a.n), -k);
  }
  let n = 1;
  let d = 1;
  for (let i = 0; i < k; i++) {
    n *= a.n;
    d *= a.d;
    checkSafe(n, d);
  }
  return rat(n, d);
}

/** Exact integer k-th root if one exists (sign-aware for odd k), otherwise null. */
export function intRoot(value: number, k: number): number | null {
  if (value < 0) {
    if (k % 2 === 0) return null;
    const r = intRoot(-value, k);
    return r === null ? null : -r;
  }
  const guess = Math.round(value ** (1 / k));
  for (const c of [guess - 1, guess, guess + 1]) {
    if (c >= 0 && c ** k === value) return c;
  }
  return null;
}

/**
 * Splits a positive integer m into outside^k * inside where inside has no k-th power factor.
 * Used to simplify radicals such as sqrt(12) = 2*sqrt(3).
 */
export function extractPower(m: number, k: number): { outside: number; inside: number } {
  let outside = 1;
  let inside = m;
  if (m > 1e7) return { outside, inside };
  for (let p = 2; p ** k <= inside; p++) {
    const pk = p ** k;
    while (inside % pk === 0) {
      inside /= pk;
      outside *= p;
    }
  }
  return { outside, inside };
}

/** Best rational approximation with denominator <= maxDen (continued fractions). */
export function approximate(x: number, maxDen = 1000, tol = 1e-9): Rational | null {
  if (!Number.isFinite(x)) return null;
  const sign = x < 0 ? -1 : 1;
  let v = Math.abs(x);
  let [h0, h1, k0, k1] = [0, 1, 1, 0];
  for (let i = 0; i < 30; i++) {
    const a = Math.floor(v);
    [h0, h1] = [h1, a * h1 + h0];
    [k0, k1] = [k1, a * k1 + k0];
    if (k1 > maxDen) return null;
    if (Math.abs(h1 / k1 - Math.abs(x)) <= tol * Math.max(1, Math.abs(x))) {
      return Number.isSafeInteger(h1) ? rat(sign * h1, k1) : null;
    }
    const frac = v - a;
    if (frac < 1e-15) break;
    v = 1 / frac;
  }
  return null;
}
