// Polynomials with exact rational coefficients. Index i holds the coefficient of v^i.

import { ZERO, add, mul, numR, pow, sym, num, type Node } from "./ast";
import * as R from "./rational";
import { expand, simplify, splitCoefficient } from "./simplify";

export type Poly = R.Rational[];

const zero = () => R.rat(0);

export function trim(p: Poly): Poly {
  const out = [...p];
  while (out.length > 1 && out[out.length - 1].n === 0) out.pop();
  return out.length ? out : [zero()];
}

export const degree = (p: Poly): number => {
  const t = trim(p);
  return t.length === 1 && t[0].n === 0 ? -Infinity : t.length - 1;
};

/** Converts n to a polynomial in v with rational coefficients, or null. */
export function toPoly(n: Node, v: string, maxDegree = 30): Poly | null {
  let e: Node;
  try {
    e = expand(n);
  } catch {
    return null;
  }
  const terms = e.k === "add" ? e.terms : [e];
  const coeffs: Poly = [];
  for (const t of terms) {
    const { coef, rest } = splitCoefficient(t);
    let k: number;
    if (rest.k === "num" && rest.v.n === 1 && rest.v.d === 1) k = 0;
    else if (rest.k === "sym" && rest.name === v) k = 1;
    else if (rest.k === "pow" && rest.base.k === "sym" && rest.base.name === v && rest.exp.k === "num" && rest.exp.v.d === 1 && rest.exp.v.n > 0) k = rest.exp.v.n;
    else return null;
    if (k > maxDegree) return null;
    while (coeffs.length <= k) coeffs.push(zero());
    coeffs[k] = R.add(coeffs[k], coef);
  }
  return trim(coeffs.length ? coeffs : [zero()]);
}

export function fromPoly(p: Poly, v: string): Node {
  const terms: Node[] = [];
  p.forEach((c, k) => {
    if (c.n === 0) return;
    const x = k === 0 ? num(1) : k === 1 ? sym(v) : pow(sym(v), num(k));
    terms.push(mul(numR(c), x));
  });
  return terms.length ? simplify(add(...terms)) : ZERO;
}

export function polyEval(p: Poly, x: R.Rational): R.Rational {
  let acc = zero();
  for (let i = p.length - 1; i >= 0; i--) acc = R.add(R.mul(acc, x), p[i]);
  return acc;
}

export function polyDeriv(p: Poly): Poly {
  return trim(p.slice(1).map((c, i) => R.mul(c, R.rat(i + 1))));
}

export function polyDivMod(a: Poly, b: Poly): { q: Poly; r: Poly } {
  const db = degree(b);
  if (db === -Infinity) throw new Error("Polynomial division by zero");
  let r = trim(a);
  const q: Poly = [];
  const lead = b[db];
  while (degree(r) >= db) {
    const dr = degree(r);
    const factor = R.div(r[dr], lead);
    const shift = dr - db;
    while (q.length <= shift) q.push(zero());
    q[shift] = factor;
    const next = [...r];
    for (let i = 0; i <= db; i++) next[i + shift] = R.sub(next[i + shift], R.mul(factor, b[i]));
    r = trim(next);
  }
  return { q: trim(q.length ? q : [zero()]), r };
}

function monic(p: Poly): Poly {
  const t = trim(p);
  const lead = t[t.length - 1];
  return lead.n === 0 ? t : t.map((c) => R.div(c, lead));
}

export function polyGcd(a: Poly, b: Poly): Poly {
  let [x, y] = [trim(a), trim(b)];
  while (degree(y) !== -Infinity) {
    [x, y] = [y, polyDivMod(x, y).r];
  }
  return monic(x);
}

function divisors(n: number): number[] {
  n = Math.abs(n);
  const out: number[] = [];
  for (let i = 1; i * i <= n; i++) {
    if (n % i === 0) {
      out.push(i);
      if (i * i !== n) out.push(n / i);
    }
  }
  return out;
}

/**
 * Finds all rational roots with multiplicity via the rational root theorem,
 * and returns the remaining factor that has no rational roots.
 */
export function rationalRoots(p: Poly): { roots: R.Rational[]; rest: Poly } {
  let poly = trim(p);
  const roots: R.Rational[] = [];
  while (degree(poly) > 0 && poly[0].n === 0) {
    roots.push(zero());
    poly = trim(poly.slice(1));
  }
  // Scale to integer coefficients.
  const lcm = poly.reduce((l, c) => (l * c.d) / gcdInt(l, c.d), 1);
  if (!Number.isSafeInteger(lcm)) return { roots, rest: poly };
  let changed = true;
  while (changed && degree(poly) > 0) {
    changed = false;
    const ints = poly.map((c) => (c.n * lcm) / c.d);
    const a0 = ints[0];
    const an = ints[ints.length - 1];
    if (Math.abs(a0) > 1e6 || Math.abs(an) > 1e6) break;
    for (const pDiv of divisors(a0)) {
      for (const qDiv of divisors(an)) {
        for (const sign of [1, -1]) {
          const cand = R.rat(sign * pDiv, qDiv);
          if (polyEval(poly, cand).n === 0) {
            roots.push(cand);
            poly = polyDivMod(poly, [R.neg(cand), R.rat(1)]).q;
            changed = true;
            break;
          }
        }
        if (changed) break;
      }
      if (changed) break;
    }
  }
  return { roots, rest: poly };
}

function gcdInt(a: number, b: number): number {
  a = Math.abs(a);
  b = Math.abs(b);
  while (b) [a, b] = [b, a % b];
  return a || 1;
}

/** Real roots of a polynomial: exact where possible (rational roots, quadratic formula). */
export function exactRealRoots(p: Poly): { exact: Node[]; leftover: Poly } {
  const { roots, rest } = rationalRoots(p);
  const exact: Node[] = roots.map((r) => numR(r));
  let leftover = rest;
  if (degree(rest) === 2) {
    const [c, b, a] = rest;
    const disc = R.sub(R.mul(b, b), R.mul(R.rat(4), R.mul(a, c)));
    if (disc.n >= 0) {
      const sqrtDisc = simplify(pow(numR(disc), num(1, 2)));
      const twoA = R.mul(R.rat(2), a);
      for (const sign of [-1, 1]) {
        exact.push(simplify(mul(add(numR(R.neg(b)), mul(num(sign), sqrtDisc)), numR(R.div(R.rat(1), twoA)))));
      }
    }
    leftover = [R.rat(1)];
  } else if (degree(rest) === 1) {
    exact.push(numR(R.div(R.neg(rest[0]), rest[1])));
    leftover = [R.rat(1)];
  }
  return { exact, leftover };
}
